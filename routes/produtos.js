const express = require('express');
const router = express.Router();
const { ProdutoController, uploadMulter } = require('../controllers/ProdutoController');

// Criar instância do controller
const produtoController = new ProdutoController();

// Rota principal - listar produtos
router.get('/', (req, res) => produtoController.index(req, res));

// Rota para busca
router.get('/search', (req, res) => produtoController.search(req, res));

// Rota para mostrar formulário de criação
router.get('/create', (req, res) => produtoController.createForm(req, res));

// Rota para criar produto (com upload para S3)
router.post('/', uploadMulter.single('imagem'), (req, res) => produtoController.create(req, res));

// Rota para mostrar detalhes do produto
router.get('/:id', (req, res) => produtoController.show(req, res));

// Rota para mostrar formulário de edição
router.get('/:id/edit', (req, res) => produtoController.editForm(req, res));

// Rota para atualizar produto (com upload para S3)
router.post('/:id', uploadMulter.single('imagem'), (req, res) => produtoController.update(req, res));

// Rota para deletar produto
router.post('/:id/delete', (req, res) => produtoController.delete(req, res));

module.exports = router; 