const { S3Client, PutBucketPolicyCommand, GetBucketPolicyCommand, PutBucketAclCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

// Configuração do cliente S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function configureS3Bucket() {
  try {
    console.log('🔧 Configurando bucket S3 para acesso público...\n');

    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.AWS_S3_BUCKET) {
      console.error('❌ Erro: AWS_S3_BUCKET não está configurado no .env');
      return;
    }

    const bucketName = process.env.AWS_S3_BUCKET;
    console.log(`📦 Bucket: ${bucketName}`);

    // 1. Configurar ACL do bucket para permitir acesso público
    console.log('1️⃣ Configurando ACL do bucket...');
    try {
      await s3Client.send(new PutBucketAclCommand({
        Bucket: bucketName,
        ACL: 'public-read'
      }));
      console.log('✅ ACL do bucket configurado com sucesso');
    } catch (error) {
      console.log('⚠️  Aviso: Não foi possível configurar ACL do bucket:', error.message);
    }

    // 2. Configurar política do bucket para acesso público
    console.log('2️⃣ Configurando política do bucket...');
    const bucketPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicReadGetObject',
          Effect: 'Allow',
          Principal: '*',
          Action: 's3:GetObject',
          Resource: `arn:aws:s3:::${bucketName}/*`
        }
      ]
    };

    try {
      await s3Client.send(new PutBucketPolicyCommand({
        Bucket: bucketName,
        Policy: JSON.stringify(bucketPolicy)
      }));
      console.log('✅ Política do bucket configurada com sucesso');
    } catch (error) {
      console.log('⚠️  Aviso: Não foi possível configurar política do bucket:', error.message);
    }

    // 3. Verificar configuração atual
    console.log('3️⃣ Verificando configuração atual...');
    try {
      const policy = await s3Client.send(new GetBucketPolicyCommand({
        Bucket: bucketName
      }));
      console.log('✅ Política atual do bucket:');
      console.log(JSON.parse(policy.Policy));
    } catch (error) {
      console.log('⚠️  Não foi possível recuperar a política atual:', error.message);
    }

    console.log('\n🎉 Configuração concluída!');
    console.log('\n📋 Próximos passos:');
    console.log('1. Verifique se o bucket não tem "Block all public access" ativado');
    console.log('2. Teste o upload de uma imagem na aplicação');
    console.log('3. Verifique se a imagem é acessível publicamente');

  } catch (error) {
    console.error('❌ Erro durante a configuração:', error.message);
    console.log('\n🔍 Possíveis soluções:');
    console.log('1. Verifique se as credenciais AWS estão corretas');
    console.log('2. Verifique se o bucket existe na região especificada');
    console.log('3. Verifique se o usuário IAM tem permissões suficientes');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  configureS3Bucket();
}

module.exports = { configureS3Bucket }; 