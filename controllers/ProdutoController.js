const ProdutoService = require('../services/ProdutoService');
const { S3Service, upload } = require('../services/S3Service');
const path = require('path');

// Configuração do multer
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});
const uploadMulter = multer({ storage: storage });

class ProdutoController {
  constructor() {
    this.produtoService = new ProdutoService();
  }

  // Listar todos os produtos
  async index(req, res) {
    try {
      const produtos = await this.produtoService.listarProdutos();
      
      res.render('produtos/index', { 
        produtos,
        title: 'Lista de Produtos',
        message: req.query.message
      });
    } catch (error) {
      res.render('error', { 
        message: 'Erro ao carregar produtos',
        error: error.message
      });
    }
  }

  // Mostrar formulário de criação
  createForm(req, res) {
    res.render('produtos/create', { 
      title: 'Novo Produto',
      produto: {}
    });
  }

  // Criar novo produto
  async create(req, res) {
    try {
      const { nome, descricao, preco, categoria, estoque } = req.body;
      let produtoData = { nome, descricao, preco, categoria, estoque };

      if (req.file) {
        produtoData.imagem = req.file;
      }

      await this.produtoService.criarProduto(produtoData);
      
      res.redirect('/produtos?message=Produto criado com sucesso!');
    } catch (error) {
      res.render('produtos/create', {
        title: 'Novo Produto',
        produto: req.body,
        error: error.message
      });
    }
  }

  // Mostrar formulário de edição
  async editForm(req, res) {
    try {
      const produto = await this.produtoService.buscarProdutoPorId(req.params.id);
      
      res.render('produtos/edit', { 
        title: 'Editar Produto',
        produto
      });
    } catch (error) {
      res.redirect('/produtos?message=Erro ao carregar produto');
    }
  }

  // Atualizar produto
  async update(req, res) {
    try {
      const { nome, descricao, preco, categoria, estoque } = req.body;
      const id = req.params.id;
      let produtoData = { nome, descricao, preco, categoria, estoque };

      if (req.file) {
        produtoData.imagem = req.file;
      }

      await this.produtoService.atualizarProduto(id, produtoData);
      
      res.redirect('/produtos?message=Produto atualizado com sucesso!');
    } catch (error) {
      try {
        const produto = await this.produtoService.buscarProdutoPorId(req.params.id);
        res.render('produtos/edit', {
          title: 'Editar Produto',
          produto,
          error: error.message
        });
      } catch (findError) {
        res.redirect('/produtos?message=Produto não encontrado');
      }
    }
  }

  // Deletar produto
  async delete(req, res) {
    try {
      await this.produtoService.deletarProduto(req.params.id);
      res.redirect('/produtos?message=Produto deletado com sucesso!');
    } catch (error) {
      res.redirect('/produtos?message=Erro ao deletar produto');
    }
  }

  // Buscar produtos
  async search(req, res) {
    try {
      const termo = req.query.q;
      if (!termo) {
        return res.redirect('/produtos');
      }
      
      const produtos = await this.produtoService.buscarProdutos(termo);
      res.render('produtos/index', { 
        produtos,
        title: `Resultados para: ${termo}`,
        searchTerm: termo
      });
    } catch (error) {
      res.render('error', { 
        message: 'Erro na busca',
        error: error.message
      });
    }
  }

  // Mostrar detalhes do produto
  async show(req, res) {
    try {
      const produto = await this.produtoService.buscarProdutoPorId(req.params.id);
      
      res.render('produtos/show', { 
        title: produto.nome,
        produto
      });
    } catch (error) {
      res.redirect('/produtos?message=Erro ao carregar produto');
    }
  }
}

module.exports = {
  ProdutoController,
  uploadMulter
}; 