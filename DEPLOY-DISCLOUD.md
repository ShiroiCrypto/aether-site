# 🚀 Deploy no Discloud - Aether

Guia completo para fazer deploy do Aether no Discloud.

## 📋 Pré-requisitos

1. **Conta no Discloud**
   - Crie uma conta em [discloud.app](https://discloud.app)
   - Configure seu domínio personalizado

2. **Configurações Necessárias**
   - Google AI API Key (Gemini)
   - Discord OAuth2 App
   - MongoDB Atlas (opcional)

## 🔧 Configuração

### 1. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Porta do servidor
PORT=8080

# Ambiente
NODE_ENV=production

# Google AI (Gemini)
GEMINI_API_KEY=sua_chave_gemini_aqui

# Discord OAuth2
DISCORD_CLIENT_ID=seu_client_id_aqui
DISCORD_CLIENT_SECRET=seu_client_secret_aqui
DISCORD_REDIRECT_URI=https://aether.discloud.app/api/auth/discord/callback

# MongoDB (Opcional)
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/aether?retryWrites=true&w=majority

# Segurança
SESSION_SECRET=uma_senha_super_secreta_para_sessao
```

### 2. Configurar Discord OAuth2

1. Acesse [Discord Developer Portal](https://discord.com/developers/applications)
2. Crie uma nova aplicação
3. Vá para "OAuth2" → "General"
4. Adicione `https://aether.discloud.app/api/auth/discord/callback` como Redirect URI
5. Copie o Client ID e Client Secret

### 3. Configurar Google AI

1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crie uma nova API key
3. Copie a chave para `GEMINI_API_KEY`

### 4. Configurar MongoDB (Opcional)

1. Crie uma conta no [MongoDB Atlas](https://mongodb.com/atlas)
2. Crie um cluster gratuito
3. Configure o banco de dados
4. Copie a string de conexão

## 🚀 Deploy

### Método 1: Via Discloud Dashboard

1. **Fazer upload do projeto**
   - Compacte o projeto em um arquivo ZIP
   - Faça upload no dashboard do Discloud

2. **Configurar variáveis de ambiente**
   - No dashboard, vá para "Environment Variables"
   - Adicione todas as variáveis do `.env`

3. **Configurar domínio**
   - Vá para "Domains"
   - Configure `aether.discloud.app`

4. **Deploy**
   - Clique em "Deploy"
   - Aguarde o processo completar

### Método 2: Via CLI

1. **Instalar Discloud CLI**
   ```bash
   npm install -g discloud-cli
   ```

2. **Login**
   ```bash
   discloud login
   ```

3. **Deploy**
   ```bash
   discloud deploy
   ```

### Método 3: Via Git

1. **Conectar repositório**
   - No dashboard, conecte seu repositório GitHub
   - Configure auto-deploy

2. **Push para deploy**
   ```bash
   git add .
   git commit -m "Deploy to Discloud"
   git push origin main
   ```

## 🔍 Verificação

### 1. Testar Health Check
```bash
curl https://aether.discloud.app/api/health
```

### 2. Verificar Logs
```bash
discloud logs aether
```

### 3. Monitorar Performance
- Acesse o dashboard do Discloud
- Verifique métricas de CPU, RAM e rede

## 🛠️ Troubleshooting

### ❌ Erro de Conexão MongoDB
```
MongoServerSelectionError: SSL routines
```

**Solução:**
1. Verifique se a string de conexão está correta
2. Confirme se o IP está liberado no MongoDB Atlas
3. Teste a conexão localmente primeiro

### ❌ Erro de CORS
```
Access to fetch at 'https://aether.discloud.app' from origin '...' has been blocked by CORS policy
```

**Solução:**
1. Verifique se o domínio está configurado corretamente
2. Confirme as configurações de CORS no `index.js`

### ❌ Erro de Autenticação Discord
```
OAuth2 invalid
```

**Solução:**
1. Verifique se o `DISCORD_REDIRECT_URI` está correto
2. Confirme se a aplicação Discord está ativa
3. Teste o OAuth2 localmente primeiro

### ❌ Erro de API Gemini
```
API key not valid
```

**Solução:**
1. Verifique se a chave da API está correta
2. Confirme se a API está habilitada no Google Cloud
3. Teste a API localmente primeiro

## 📊 Monitoramento

### 1. Logs em Tempo Real
```bash
discloud logs aether --follow
```

### 2. Métricas de Performance
- CPU: < 80%
- RAM: < 512MB
- Disco: < 1GB
- Rede: < 100MB/s

### 3. Health Checks
- Endpoint: `/api/health`
- Intervalo: 30s
- Timeout: 10s
- Retries: 3

## 🔒 Segurança

### 1. Headers de Segurança
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000`

### 2. SSL/HTTPS
- Certificado Let's Encrypt automático
- Forçar HTTPS habilitado
- Auto-renewal configurado

### 3. Rate Limiting
- Implementar rate limiting se necessário
- Monitorar requisições suspeitas

## 📈 Escalabilidade

### 1. Auto-Scaling
- Mínimo: 1 instância
- Máximo: 3 instâncias
- Threshold: 80% CPU/RAM

### 2. Load Balancing
- Distribuição automática de carga
- Health checks ativos
- Failover automático

### 3. Cache
- Cache de arquivos estáticos
- Cache de API (300s)
- CDN habilitado

## 🔄 Atualizações

### 1. Deploy Automático
- Conecte repositório GitHub
- Configure webhooks
- Auto-deploy em push

### 2. Rollback
- Rollback automático em falha
- Threshold: 3 falhas
- Tempo de timeout: 300s

### 3. Versionamento
- Tags para versões
- Changelog atualizado
- Release notes

## 📞 Suporte

### 1. Discloud Support
- [Documentação](https://docs.discloud.app)
- [Discord](https://discord.gg/discloud)
- [GitHub](https://github.com/discloud)

### 2. Aether Support
- Email: shiroicrypto@gmail.com
- Discord: [Comunidade Aether](https://discord.gg/cqTEq3re6D)
- Issues: [GitHub](https://github.com/shiroicrypto/aether-site/issues)

---

**Aether no Discloud** 🌌

*Conectando o digital ao universal, uma conversa de cada vez.* 