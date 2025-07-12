# 🚀 Guia de Deploy - Aether Site

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no Discord Developer Portal
- Chave da API Gemini (Google AI)
- Servidor ou plataforma de deploy (Discloud, Vercel, etc.)

## 🔧 Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Chave da API Gemini (Google Generative AI)
GEMINI_API_KEY=sua_chave_gemini_aqui

# Discord OAuth2
DISCORD_CLIENT_ID=seu_client_id_aqui
DISCORD_CLIENT_SECRET=seu_client_secret_aqui
DISCORD_REDIRECT_URI=https://aether.discloud.app/api/auth/discord/callback

# Segredos adicionais
SESSION_SECRET=uma_senha_super_secreta_para_sessao
PORT=3000
NODE_ENV=production
```

### 2. Configurar Discord OAuth2

1. Acesse [Discord Developer Portal](https://discord.com/developers/applications)
2. Crie uma nova aplicação
3. Vá para "OAuth2" → "General"
4. Adicione `https://aether.discloud.app/api/auth/discord/callback` como Redirect URI
5. Copie o Client ID e Client Secret

### 3. Obter Chave Gemini

1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crie uma nova chave de API
3. Copie a chave para o `.env`

## 🚀 Deploy no Discloud

### 1. Preparar o Projeto

```bash
# Instalar dependências
npm install

# Testar localmente
npm run dev
```

### 2. Configurar Discloud

1. Crie uma conta no [Discloud](https://discloud.app)
2. Crie um novo projeto
3. Faça upload dos arquivos ou conecte com GitHub
4. Configure as variáveis de ambiente no painel do Discloud

### 3. Comandos de Deploy

```bash
# Instalar PM2 globalmente (se necessário)
npm install -g pm2

# Iniciar em produção
npm run pm2:start

# Ver logs
npm run pm2:logs

# Reiniciar
npm run pm2:restart
```

## 🔒 Segurança

### Headers de Segurança
O projeto já inclui headers de segurança:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

### Cookies Seguros
- `httpOnly: true` - Previne acesso via JavaScript
- `secure: true` - Apenas HTTPS em produção
- `sameSite: 'lax'` - Proteção CSRF

### CORS Configurado
- Apenas origens permitidas em produção
- Credenciais habilitadas para autenticação

## 📊 Monitoramento

### Health Check
Acesse `/api/health` para verificar o status:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

### Logs
- Logs de erro: `./logs/err.log`
- Logs de saída: `./logs/out.log`
- Logs combinados: `./logs/combined.log`

## 🛠️ Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Produção
npm run prod

# PM2
npm run pm2:start
npm run pm2:stop
npm run pm2:restart
npm run pm2:logs

# Verificar status
curl https://aether.discloud.app/api/health
```

## 🔧 Troubleshooting

### Erro de CORS
- Verifique se as origens estão configuradas corretamente
- Certifique-se de que o CORS está habilitado

### Erro de Autenticação Discord
- Verifique se o Client ID e Secret estão corretos
- Confirme se a Redirect URI está configurada no Discord

### Erro de IA
- Verifique se a chave Gemini está válida
- Confirme se há créditos disponíveis na API

## 📝 Estrutura de Arquivos

```
aether-site/
├── public/           # Frontend
├── data/            # Histórico de conversas
├── logs/            # Logs do PM2
├── index.js         # Servidor Express
├── ecosystem.config.js # Configuração PM2
├── package.json     # Dependências
├── .env            # Variáveis de ambiente
└── DEPLOY.md       # Este arquivo
```

## 🌟 Funcionalidades Implementadas

- ✅ **IA Real**: Chat com Gemini 1.5 Flash
- ✅ **Login Real**: Discord OAuth2 completo
- ✅ **Histórico Persistente**: Salvo no servidor
- ✅ **Segurança**: Headers e cookies seguros
- ✅ **Monitoramento**: Health check e logs
- ✅ **Produção**: Configuração PM2

---

**Aether: Sua IA Espacial** 🌌 