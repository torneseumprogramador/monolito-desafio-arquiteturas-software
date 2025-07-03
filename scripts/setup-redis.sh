#!/bin/bash

echo "🚀 Configurando Redis para a aplicação..."

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Verificar se o arquivo .env existe
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp env.example .env
    echo "✅ Arquivo .env criado. Configure as variáveis de ambiente conforme necessário."
else
    echo "✅ Arquivo .env já existe."
fi

# Verificar se o Redis está configurado no .env
if grep -q "REDIS_HOST" .env; then
    echo "✅ Configurações do Redis encontradas no .env"
else
    echo "⚠️  Adicione as configurações do Redis ao arquivo .env:"
    echo "REDIS_HOST=localhost"
    echo "REDIS_PORT=6379"
    echo "REDIS_PASSWORD="
    echo "REDIS_DB=0"
    echo "REDIS_CACHE_TTL=60"
fi

echo ""
echo "🎯 Para iniciar a aplicação com Redis:"
echo "   docker-compose up -d"
echo ""
echo "🎯 Para verificar os logs:"
echo "   docker-compose logs -f app"
echo ""
echo "🎯 Para acessar o Redis CLI:"
echo "   docker-compose exec redis redis-cli"
echo ""
echo "✅ Configuração do Redis concluída!" 