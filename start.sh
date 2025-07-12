#!/bin/bash

# =====================
# Script de Inicialização do Aether
# =====================

echo "🌌 Iniciando Aether..."

# Verificar se o arquivo .env existe
if [ ! -f .env ]; then
    echo "⚠️ Arquivo .env não encontrado!"
    echo "📝 Copiando env.example para .env..."
    cp env.example .env
    echo "✅ Arquivo .env criado. Configure as variáveis de ambiente antes de continuar."
    echo "🔧 Edite o arquivo .env com suas configurações:"
    echo "   - GEMINI_API_KEY"
    echo "   - DISCORD_CLIENT_ID"
    echo "   - DISCORD_CLIENT_SECRET"
    echo "   - MONGODB_URI (opcional)"
    echo "   - SESSION_SECRET"
    exit 1
fi

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

# Verificar se as variáveis essenciais estão configuradas
source .env

if [ -z "$GEMINI_API_KEY" ] || [ "$GEMINI_API_KEY" = "sua_chave_gemini_aqui" ]; then
    echo "❌ GEMINI_API_KEY não configurada!"
    echo "🔗 Obtenha sua chave em: https://makersuite.google.com/app/apikey"
    exit 1
fi

if [ -z "$DISCORD_CLIENT_ID" ] || [ "$DISCORD_CLIENT_ID" = "seu_client_id_aqui" ]; then
    echo "❌ DISCORD_CLIENT_ID não configurado!"
    echo "🔗 Configure no Discord Developer Portal"
    exit 1
fi

if [ -z "$DISCORD_CLIENT_SECRET" ] || [ "$DISCORD_CLIENT_SECRET" = "seu_client_secret_aqui" ]; then
    echo "❌ DISCORD_CLIENT_SECRET não configurado!"
    echo "🔗 Configure no Discord Developer Portal"
    exit 1
fi

if [ -z "$SESSION_SECRET" ] || [ "$SESSION_SECRET" = "uma_senha_super_secreta_para_sessao" ]; then
    echo "⚠️ SESSION_SECRET não configurado, usando valor padrão..."
    echo "🔒 Recomendado: Configure uma senha forte para SESSION_SECRET"
fi

# Definir porta padrão se não configurada
if [ -z "$PORT" ]; then
    export PORT=8080
    echo "🔧 Porta padrão definida: 8080"
fi

# Verificar ambiente
if [ "$NODE_ENV" = "production" ]; then
    echo "🚀 Iniciando em modo PRODUÇÃO"
    echo "🌐 URL: https://aether.discloud.app"
else
    echo "🔧 Iniciando em modo DESENVOLVIMENTO"
    echo "🌐 URL: http://localhost:$PORT"
fi

# Verificar MongoDB
if [ -n "$MONGODB_URI" ] && [ "$MONGODB_URI" != "mongodb+srv://usuario:senha@cluster.mongodb.net/aether?retryWrites=true&w=majority" ]; then
    echo "🗄️ MongoDB configurado"
else
    echo "⚠️ MongoDB não configurado - usando modo fallback"
fi

echo ""
echo "🚀 Iniciando servidor..."
echo "📡 Porta: $PORT"
echo "🔐 Discord OAuth2: Configurado"
echo "🤖 Gemini API: Configurado"
echo ""

# Iniciar o servidor
npm start 