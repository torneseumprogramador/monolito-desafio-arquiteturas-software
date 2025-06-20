const Produto = require('../models/Produto');

class ProdutoController {
  // Listar todos os produtos
  static async index(req, res) {
    try {
      const produtos = await Produto.findAll();
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
  static createForm(req, res) {
    res.render('produtos/create', { 
      title: 'Novo Produto',
      produto: {}
    });
  }

  // Criar novo produto
  static async create(req, res) {
    try {
      const { nome, descricao, preco, categoria, estoque } = req.body;
      
      // Validação básica
      if (!nome || !preco || !categoria) {
        return res.render('produtos/create', {
          title: 'Novo Produto',
          produto: req.body,
          error: 'Nome, preço e categoria são obrigatórios'
        });
      }

      await Produto.create({ nome, descricao, preco, categoria, estoque });
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
  static async editForm(req, res) {
    try {
      const produto = await Produto.findById(req.params.id);
      if (!produto) {
        return res.redirect('/produtos?message=Produto não encontrado');
      }
      
      res.render('produtos/edit', { 
        title: 'Editar Produto',
        produto
      });
    } catch (error) {
      res.redirect('/produtos?message=Erro ao carregar produto');
    }
  }

  // Atualizar produto
  static async update(req, res) {
    try {
      const { nome, descricao, preco, categoria, estoque } = req.body;
      const id = req.params.id;
      
      // Validação básica
      if (!nome || !preco || !categoria) {
        const produto = await Produto.findById(id);
        return res.render('produtos/edit', {
          title: 'Editar Produto',
          produto,
          error: 'Nome, preço e categoria são obrigatórios'
        });
      }

      const success = await Produto.update(id, { nome, descricao, preco, categoria, estoque });
      if (success) {
        res.redirect('/produtos?message=Produto atualizado com sucesso!');
      } else {
        res.redirect('/produtos?message=Produto não encontrado');
      }
    } catch (error) {
      const produto = await Produto.findById(req.params.id);
      res.render('produtos/edit', {
        title: 'Editar Produto',
        produto,
        error: error.message
      });
    }
  }

  // Deletar produto
  static async delete(req, res) {
    try {
      const success = await Produto.delete(req.params.id);
      if (success) {
        res.redirect('/produtos?message=Produto deletado com sucesso!');
      } else {
        res.redirect('/produtos?message=Produto não encontrado');
      }
    } catch (error) {
      res.redirect('/produtos?message=Erro ao deletar produto');
    }
  }

  // Buscar produtos
  static async search(req, res) {
    try {
      const termo = req.query.q;
      if (!termo) {
        return res.redirect('/produtos');
      }
      
      const produtos = await Produto.search(termo);
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
  static async show(req, res) {
    try {
      const produto = await Produto.findById(req.params.id);
      if (!produto) {
        return res.redirect('/produtos?message=Produto não encontrado');
      }
      
      res.render('produtos/show', { 
        title: produto.nome,
        produto
      });
    } catch (error) {
      res.redirect('/produtos?message=Erro ao carregar produto');
    }
  }
}

module.exports = ProdutoController; 