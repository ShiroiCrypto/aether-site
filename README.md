# 🌌 Aether - Sua IA Espacial

[![Version](https://img.shields.io/badge/version-v0.1.0-blue.svg)](https://github.com/shiroi/aether-site)
[![Node.js](https://img.shields.io/badge/node.js-18+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-yellow.svg)](LICENSE)
[![Discord](https://img.shields.io/badge/discord-join%20community-7289DA.svg)](https://discord.gg/cqTEq3re6D)

> **Converse, aprenda, explore com inteligência e privacidade**  
> IA baseada no Gemini 1.5 Flash com design cósmico e integração Discord

## 🚀 v0.1.0 - Resumo Executivo

**Aether v0.1.0** é a primeira versão oficial do site da IA cósmica, apresentando um chat inteligente integrado ao Gemini 1.5 Flash, autenticação Discord OAuth2 real, design responsivo mobile-first e sistema de personalização avançado. A plataforma oferece uma experiência imersiva com partículas animadas, múltiplos temas e histórico persistente de conversas.

---

## ✨ Funcionalidades Principais

### 🤖 **Chat Inteligente com IA Real**
- **Gemini 1.5 Flash**: Conversas contextuais e inteligentes
- **Memória Persistente**: Histórico salvo por usuário no MongoDB
- **Múltiplas Conversas**: Sistema de conversas organizadas
- **Contexto Completo**: IA lembra de informações anteriores
- **Personalização**: Personalidade cósmica única

### 🔐 **Autenticação Discord Real**
- **OAuth2 Completo**: Login seguro via Discord
- **Perfil Integrado**: Avatar e informações do usuário
- **Sessão Persistente**: Login mantido entre sessões
- **Logout Seguro**: Encerramento de sessão adequado

### 🎨 **Design Cósmico Responsivo**
- **Mobile-First**: Otimizado para todos os dispositivos
- **Partículas Animadas**: 80 partículas interativas
- **Glassmorphism**: Efeitos de vidro e blur
- **Temas Dinâmicos**: Cósmico, Neon e Cristal
- **Animações Suaves**: Transições fluidas

### 📱 **Experiência Mobile Otimizada**
- **Menu Hambúrguer**: Navegação intuitiva
- **Chat Mobile**: Sidebar toggle e controles touch
- **Áreas de Toque**: Mínimo 44px para acessibilidade
- **Orientação Adaptativa**: Landscape e portrait
- **Performance Otimizada**: Carregamento rápido

---

## 🛠️ Tecnologias

### Frontend
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Particles.js](https://img.shields.io/badge/Particles.js-000000?style=for-the-badge&logo=particles.js&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

### APIs & Serviços
![Google AI](https://img.shields.io/badge/Google_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Discord](https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white)

---

## 🚀 Instalação Rápida

### 1. Clone o Repositório
```bash
git clone https://github.com/shiroi/aether-site.git
cd aether-site
```

### 2. Configure as Variáveis de Ambiente
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com suas chaves
nano .env
```

**Exemplo do `.env`:**
```env
# Google AI (Gemini)
GEMINI_API_KEY=sua_chave_gemini_aqui

# Discord OAuth2
DISCORD_CLIENT_ID=seu_client_id_aqui
DISCORD_CLIENT_SECRET=seu_client_secret_aqui
DISCORD_REDIRECT_URI=https://aether.discloud.app/api/auth/discord/callback

# MongoDB (Opcional)
MONGODB_URI=mongodb://localhost:27017/aether

# Configurações
SESSION_SECRET=uma_senha_super_secreta_para_sessao
PORT=3000
```

### 3. Instale as Dependências
```bash
npm install
```

### 4. Execute o Projeto
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

### 5. Acesse o Site
🌐 **http://localhost:8080**

---

## 🔧 Configuração Detalhada

### Discord OAuth2 Setup
1. Acesse [Discord Developer Portal](https://discord.com/developers/applications)
2. Crie uma nova aplicação
3. Vá para "OAuth2" → "General"
4. Adicione `http://localhost:3000/api/auth/discord/callback` como Redirect URI
5. Copie o Client ID e Client Secret para o `.env`

### Google AI (Gemini) Setup
1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crie uma nova API key
3. Copie a chave para `GEMINI_API_KEY` no `.env`

### Verificar Configuração
```bash
# Teste o status da configuração
curl http://localhost:8080/api/health
```

---

## 📱 Como Usar

### 🧭 **Navegação**
- **Hero Section**: Apresentação da Aether
- **Sobre**: Informações sobre a IA
- **Funcionalidades**: Lista de recursos
- **Chat**: Conversa interativa
- **Discord**: Integração com bot
- **Personalização**: Configurações

### 💬 **Chat Inteligente**
1. Role até a seção "🌌 Conversa com Aether"
2. Faça login com Discord para salvar histórico
3. Digite sua mensagem no campo de texto
4. Pressione Enter ou clique em enviar
5. Aether responderá com contexto completo

### 🔐 **Login Discord**
1. Clique em "Entrar com Discord" na navbar
2. Autorize o acesso no Discord
3. Seu perfil aparecerá na navbar
4. Histórico será salvo automaticamente

### 🎨 **Personalização**
1. Role até a seção "Personalização"
2. Escolha um tema (Cósmico, Neon, Cristal)
3. Ative/desative partículas animadas
4. Selecione a fonte do chat
5. Preferências são salvas automaticamente

---

## 🏗️ Estrutura do Projeto

```
aether-site/
├── 📁 public/                 # Frontend (arquivos estáticos)
│   ├── 📄 index.html          # Página principal
│   ├── 📁 css/
│   │   ├── style.css          # Estilos principais
│   │   ├── chat.css           # Estilos do chat
│   │   ├── mobile.css         # Responsividade mobile
│   │   └── particles.css      # Partículas animadas
│   ├── 📁 js/
│   │   ├── main.js            # Funcionalidades gerais
│   │   ├── chat.js            # Sistema de chat
│   │   ├── auth.js            # Autenticação Discord
│   │   └── particles-config.js # Configuração partículas
│   └── 📁 test/
│       ├── test-mobile.html   # Teste responsividade
│       └── test-memory.html   # Teste memória IA
├── 📁 database/               # Configuração banco de dados
├── 📄 index.js                # Servidor Express (backend)
├── 📄 package.json            # Dependências e scripts
├── 📄 .env                    # Variáveis de ambiente
└── 📄 README.md               # Esta documentação
```

---

## 🌟 Recursos Especiais

### 🤖 **IA com Memória Perfeita**
- **Contexto Completo**: IA lembra de todas as conversas anteriores
- **Personalidade Cósmica**: Respostas temáticas e envolventes
- **Informações do Usuário**: IA conhece dados do Discord
- **Histórico Persistente**: Conversas salvas no MongoDB

### 🎨 **Design Cósmico**
- **80 Partículas Interativas**: Cores ciano, roxo e branco
- **Glassmorphism**: Efeitos de vidro e blur
- **Animações Suaves**: Transições fluidas
- **Temas Dinâmicos**: 3 temas disponíveis

### 📱 **Mobile-First**
- **Menu Hambúrguer**: Navegação intuitiva
- **Chat Responsivo**: Sidebar toggle mobile
- **Touch Otimizado**: Áreas mínimas de 44px
- **Orientação Adaptativa**: Landscape e portrait

---

## 🚨 Troubleshooting

### ❌ **Erro "OAuth2 invalid"**
```bash
# Verifique se o .env está configurado
cat .env | grep DISCORD

# Confirme se a Redirect URI está correta
# Deve ser: http://localhost:3000/api/auth/discord/callback
```

### ❌ **Chat não funciona**
```bash
# Verifique se a API key do Gemini está configurada
cat .env | grep GEMINI

# Teste a conexão
curl http://localhost:3000/api/health
```

### ❌ **Problemas Mobile**
- Acesse `http://localhost:3000/test-mobile.html`
- Verifique informações do dispositivo
- Teste funcionalidades mobile

### ✅ **Verificar Status**
```bash
# Endpoint de saúde da aplicação
curl http://localhost:3000/api/health
```

---

## 📊 Compatibilidade

| Navegador | Versão Mínima | Status |
|-----------|---------------|--------|
| Chrome    | 90+           | ✅     |
| Firefox   | 88+           | ✅     |
| Safari    | 14+           | ✅     |
| Edge      | 90+           | ✅     |
| Mobile    | Todos         | ✅     |

---

## 🚀 Roadmap

### ✅ **v0.1.0 - Concluído**
- [x] Chat inteligente com Gemini 1.5 Flash
- [x] Autenticação Discord OAuth2 real
- [x] Design responsivo mobile-first
- [x] Sistema de temas e personalização
- [x] Histórico persistente no MongoDB
- [x] Partículas animadas interativas

### 🔄 **v0.2.0 - Em Desenvolvimento**
- [ ] Sincronização entre dispositivos
- [ ] Mais temas e personalizações
- [ ] Sistema de notificações push
- [ ] Analytics e métricas
- [ ] Integração com bot Discord

### 🎯 **v0.3.0 - Planejado**
- [ ] Chat em tempo real (WebSocket)
- [ ] Sistema de plugins
- [ ] API pública para desenvolvedores
- [ ] Aplicativo mobile nativo

---

## 🤝 Contribuindo

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. Abra um **Pull Request**

### 📋 **Diretrizes de Contribuição**
- Siga o padrão de código existente
- Adicione testes para novas funcionalidades
- Atualize a documentação quando necessário
- Mantenha o design cósmico consistente

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 🙏 Agradecimentos

- **Google AI** pela API Gemini 1.5 Flash
- **Discord** pela plataforma OAuth2
- **Comunidade Aether** pelo feedback e suporte
- **Shiroi** pelo desenvolvimento e manutenção

---

**Aether: Sua IA Espacial** 🌌

*Conectando o digital ao universal, uma conversa de cada vez.*

---

<div align="center">

[![Discord](https://img.shields.io/badge/Discord-Join%20Community-7289DA?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/cqTEq3re6D)
[![GitHub](https://img.shields.io/badge/GitHub-View%20Source-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/shiroicrypto/aether-site)
[![Website](https://img.shields.io/badge/Website-Visit%20Site-00D4FF?style=for-the-badge&logo=google-chrome&logoColor=white)](https://aether.discloud.app)

</div>
