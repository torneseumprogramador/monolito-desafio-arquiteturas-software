#!/bin/bash

# Script de setup para o Sistema de Produtos
echo "🚀 Configurando Sistema de Cadastro de Produtos..."

# Criar arquivo .env se não existir
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp env.example .env
    echo "✅ Arquivo .env criado"
else
    echo "✅ Arquivo .env já existe"
fi

# Construir e iniciar os containers
echo "🐳 Construindo e iniciando containers..."
docker-compose up --build -d

# Aguardar o banco de dados inicializar
echo "⏳ Aguardando inicialização do banco de dados..."
sleep 30

# Verificar se os containers estão rodando
if docker-compose ps | grep -q "Up"; then
    echo "✅ Containers iniciados com sucesso!"
    echo ""
    echo "🌐 Aplicação disponível em: http://localhost:3000"
    echo "🗄️  phpMyAdmin disponível em: http://localhost:8080"
    echo ""
    echo "📋 Credenciais do banco:"
    echo "   Host: localhost"
    echo "   Porta: 3306"
    echo "   Usuário: root"
    echo "   Senha: password"
    echo "   Banco: produtos_db"
    echo ""
    echo "🔧 Comandos úteis:"
    echo "   Ver logs: docker-compose logs -f"
    echo "   Parar: docker-compose down"
    echo "   Reiniciar: docker-compose restart"
else
    echo "❌ Erro ao iniciar containers"
    echo "Verifique os logs com: docker-compose logs"
    exit 1
fi