const express = require('express');
const router = express.Router();
const ProdutoController = require('../controllers/ProdutoController');

// Rota principal - listar produtos
router.get('/', ProdutoController.index);

// Rota para busca
router.get('/search', ProdutoController.search);

// Rota para mostrar formulário de criação
router.get('/create', ProdutoController.createForm);

// Rota para criar produto
router.post('/', ProdutoController.create);

// Rota para mostrar detalhes do produto
router.get('/:id', ProdutoController.show);

// Rota para mostrar formulário de edição
router.get('/:id/edit', ProdutoController.editForm);

// Rota para atualizar produto
router.post('/:id', ProdutoController.update);

// Rota para deletar produto
router.post('/:id/delete', ProdutoController.delete);

module.exports = router; 