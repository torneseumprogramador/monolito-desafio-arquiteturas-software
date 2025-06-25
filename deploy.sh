#!/bin/bash

git checkout main
git pull --force

# Parar os containers existentes
echo "🛑 Parando containers..."
docker-compose -f docker-compose-app-prod.yml down

# Reconstruir os containers
echo "🔨 Reconstruindo containers..."
docker-compose -f docker-compose-app-prod.yml build

# Subir os containers
echo "🚀 Iniciando containers..."
docker-compose -f docker-compose-app-prod.yml up -d

echo "✅ Containers reiniciados com sucesso!"

docker-compose -f docker-compose-app-prod.yml logs -f
