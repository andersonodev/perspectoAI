#!/bin/bash

echo "🚀 Configurando ambiente Mentor IA..."

# Remove node_modules e package-lock.json se existirem
if [ -d "node_modules" ]; then
    echo "🧹 Removendo node_modules existente..."
    rm -rf node_modules
fi

if [ -f "package-lock.json" ]; then
    echo "🧹 Removendo package-lock.json existente..."
    rm -f package-lock.json
fi

# Instala dependências com legacy-peer-deps para resolver conflitos
echo "📦 Instalando dependências com --legacy-peer-deps..."
npm install --legacy-peer-deps

# Verifica se a instalação foi bem-sucedida
if [ $? -eq 0 ]; then
    echo "✅ Instalação concluída com sucesso!"
    echo ""
    echo "🎯 Para executar a aplicação:"
    echo "npm run dev"
    echo ""
    echo "🌐 A aplicação estará disponível em: http://localhost:5173"
else
    echo "❌ Erro na instalação das dependências"
    exit 1
fi