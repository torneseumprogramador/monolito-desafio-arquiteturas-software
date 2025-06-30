const express = require('express');
const router = express.Router();
const { ProdutoController } = require('../controllers/ProdutoController');
const { upload } = require('../services/S3Service');

// Rota principal - listar produtos
router.get('/', ProdutoController.index);

// Rota para busca
router.get('/search', ProdutoController.search);

// Rota para mostrar formulário de criação
router.get('/create', ProdutoController.createForm);

// Rota para criar produto (com upload para S3)
router.post('/', upload.single('imagem'), ProdutoController.create);

// Rota para mostrar detalhes do produto
router.get('/:id', ProdutoController.show);

// Rota para mostrar formulário de edição
router.get('/:id/edit', ProdutoController.editForm);

// Rota para atualizar produto (com upload para S3)
router.post('/:id', upload.single('imagem'), ProdutoController.update);

// Rota para deletar produto
router.post('/:id/delete', ProdutoController.delete);

module.exports = router; 