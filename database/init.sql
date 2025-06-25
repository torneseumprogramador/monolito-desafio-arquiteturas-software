-- Script de inicialização do banco de dados
-- Sistema de Cadastro de Produtos

-- Criar banco de dados se não existir
CREATE DATABASE IF NOT EXISTS produtos_db;
USE produtos_db;

-- Criar tabela de produtos
CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    estoque INT DEFAULT 0,
    imagem VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_categoria (categoria),
    INDEX idx_preco (preco),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir dados de exemplo
INSERT INTO produtos (nome, descricao, preco, categoria, estoque) VALUES
('Smartphone Samsung Galaxy S21', 'Smartphone Android com câmera de 64MP, tela de 6.2" e 128GB de armazenamento', 2999.99, 'Eletrônicos', 15),
('Notebook Dell Inspiron 15', 'Notebook com processador Intel i5, 8GB RAM, 256GB SSD e Windows 11', 3499.99, 'Eletrônicos', 8),
('Camiseta Básica Algodão', 'Camiseta 100% algodão, disponível em várias cores e tamanhos', 29.90, 'Vestuário', 50),
('Tênis Nike Air Max', 'Tênis esportivo com tecnologia Air Max, ideal para corrida e caminhada', 399.90, 'Esportes', 12),
('Livro "O Senhor dos Anéis"', 'Trilogia completa de J.R.R. Tolkien em edição especial', 89.90, 'Livros', 25),
('Panela de Pressão Tramontina', 'Panela de pressão 5L com válvula de segurança', 129.90, 'Casa e Jardim', 18),
('Café em Grãos Especial', 'Café arábica torrado e moído, pacote de 500g', 24.90, 'Alimentos', 30),
('Fone de Ouvido Bluetooth', 'Fone sem fio com cancelamento de ruído e bateria de longa duração', 199.90, 'Eletrônicos', 22),
('Bicicleta Mountain Bike', 'Bicicleta aro 29 com 21 marchas e freios a disco', 899.90, 'Esportes', 5),
('Vaso Decorativo Cerâmica', 'Vaso de cerâmica artesanal, ideal para plantas e decoração', 45.90, 'Casa e Jardim', 35);

-- Criar usuário específico para a aplicação (opcional)
-- CREATE USER IF NOT EXISTS 'produtos_user'@'%' IDENTIFIED BY 'produtos_pass';
-- GRANT ALL PRIVILEGES ON produtos_db.* TO 'produtos_user'@'%';
-- FLUSH PRIVILEGES;

-- Verificar se os dados foram inseridos
SELECT COUNT(*) as total_produtos FROM produtos; 