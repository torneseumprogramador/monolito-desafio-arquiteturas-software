const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');

// Configuração do cliente S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Configuração do multer para S3
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_S3_BUCKET,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileName = `produtos/${uniqueSuffix}-${file.originalname.replace(/\s+/g, '_')}`;
      cb(null, fileName);
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    // Verificar se é uma imagem
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não suportado. Apenas imagens são permitidas.'), false);
    }
  }
});

class S3Service {
  /**
   * Faz upload de um arquivo para o S3
   * @param {Buffer} fileBuffer - Buffer do arquivo
   * @param {string} fileName - Nome do arquivo
   * @param {string} contentType - Tipo do conteúdo
   * @returns {Promise<string>} URL do arquivo no S3
   */
  static async uploadFile(fileBuffer, fileName, contentType) {
    try {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const key = `produtos/${uniqueSuffix}-${fileName.replace(/\s+/g, '_')}`;

      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType,
        ACL: 'public-read',
      });

      await s3Client.send(command);

      // Retorna a URL completa do arquivo
      const fileUrl = `${process.env.AWS_S3_BUCKET_URL}/${key}`;
      return fileUrl;
    } catch (error) {
      console.error('Erro ao fazer upload para S3:', error);
      throw new Error('Falha ao fazer upload do arquivo');
    }
  }

  /**
   * Deleta um arquivo do S3
   * @param {string} fileUrl - URL do arquivo no S3
   * @returns {Promise<boolean>} True se deletado com sucesso
   */
  static async deleteFile(fileUrl) {
    try {
      // Extrair a chave do arquivo da URL
      const urlParts = fileUrl.split('/');
      const key = urlParts.slice(3).join('/'); // Remove o protocolo, domínio e bucket

      const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
      });

      await s3Client.send(command);
      return true;
    } catch (error) {
      console.error('Erro ao deletar arquivo do S3:', error);
      return false;
    }
  }

  /**
   * Extrai a URL do arquivo do objeto req.file do multer-s3
   * @param {Object} file - Objeto file do multer-s3
   * @returns {string} URL do arquivo no S3
   */
  static getFileUrl(file) {
    if (!file) return null;
    
    // Se o arquivo foi enviado via multer-s3, a URL já está disponível
    if (file.location) {
      return file.location;
    }
    
    // Fallback para construir a URL
    return `${process.env.AWS_S3_BUCKET_URL}/${file.key}`;
  }

  /**
   * Verifica se as configurações do S3 estão válidas
   * @returns {boolean} True se as configurações estão corretas
   */
  static isConfigured() {
    return !!(
      process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY &&
      process.env.AWS_REGION &&
      process.env.AWS_S3_BUCKET &&
      process.env.AWS_S3_BUCKET_URL
    );
  }
}

module.exports = {
  S3Service,
  upload
}; 