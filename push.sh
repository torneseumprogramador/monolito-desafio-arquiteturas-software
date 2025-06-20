#!/bin/bash

# Verifica se foi passada uma mensagem de commit
if [ -z "$1" ]; then
    echo "Por favor, digite a mensagem do commit:"
    read commit_message
else
    commit_message="$1"
fi

# Executa os comandos git
echo "🚀 Iniciando processo de push..."

echo "📝 Adicionando alterações..."
git add .

echo "💾 Realizando commit..."
git commit -m "$commit_message"

echo "⬇️ Atualizando repositório local..."
git pull

echo "⬆️ Enviando alterações..."
git push

echo "✅ Push realizado com sucesso!"