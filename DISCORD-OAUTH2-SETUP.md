# 🔐 Configuração do Discord OAuth2

## 📋 Checklist de Verificação

### 1. Discord Developer Portal
- [ ] Acesse https://discord.com/developers/applications
- [ ] Crie uma nova aplicação ou use uma existente
- [ ] Vá para a seção "OAuth2"

### 2. Configurações OAuth2
- [ ] **Client ID**: Copie o Client ID da sua aplicação
- [ ] **Client Secret**: Gere um novo Client Secret se necessário
- [ ] **Redirect URIs**: Adicione os seguintes URIs:
  ```
  https://aether.discloud.app/api/auth/discord/callback
  http://localhost:8080/api/auth/discord/callback
  ```

### 3. Escopos (Scopes)
- [ ] Marque apenas os escopos necessários:
  - ✅ `identify` - Para obter informações básicas do usuário
  - ✅ `email` - Para obter o email do usuário
  - ❌ `guilds` - Removido para simplificar

### 4. Variáveis de Ambiente
Certifique-se de que seu arquivo `.env` tenha:

```env
# Discord OAuth2
DISCORD_CLIENT_ID=seu_client_id_aqui
DISCORD_CLIENT_SECRET=seu_client_secret_aqui
DISCORD_REDIRECT_URI=https://aether.discloud.app/api/auth/discord/callback

# Ambiente
NODE_ENV=production
```

### 5. Teste de Configuração
Acesse: `https://aether.discloud.app/api/auth/debug`

Deve retornar:
```json
{
  "message": "Configurações do Discord OAuth2",
  "config": {
    "clientId": "✅ Configurado",
    "clientSecret": "✅ Configurado", 
    "redirectUri": "https://aether.discloud.app/api/auth/discord/callback",
    "nodeEnv": "production"
  }
}
```

## 🚨 Problemas Comuns

### Erro: "invalid_client"
- Verifique se o Client ID e Client Secret estão corretos
- Certifique-se de que a aplicação está ativa no Discord Developer Portal

### Erro: "invalid_redirect_uri"
- Verifique se o Redirect URI está exatamente igual no Discord Developer Portal
- Certifique-se de que não há espaços extras ou caracteres especiais

### Erro: "invalid_scope"
- Verifique se os escopos estão marcados corretamente no Discord Developer Portal
- Use apenas `identify email` (removemos `guilds`)

### Erro: "invalid_grant"
- O código de autorização expirou (válido por apenas alguns minutos)
- Tente fazer login novamente

## 🔧 Debug

Para verificar se tudo está funcionando:

1. **Teste local**: `http://localhost:8080/api/auth/debug`
2. **Teste produção**: `https://aether.discloud.app/api/auth/debug`
3. **Teste login**: Acesse a página principal e clique em "Login com Discord"

## 📞 Suporte

Se ainda houver problemas:
1. Verifique os logs do servidor
2. Teste o endpoint de debug
3. Confirme as configurações no Discord Developer Portal
4. Verifique se as variáveis de ambiente estão corretas 