#!/bin/bash

git checkout main
git pull --force

# Parar os containers existentes
echo "🛑 Parando containers..."
docker-compose down

# Reconstruir os containers
echo "🔨 Reconstruindo containers..."
docker-compose build

# Subir os containers
echo "🚀 Iniciando containers..."
docker-compose up -d

echo "✅ Containers reiniciados com sucesso!"

docker-compose logs -f
