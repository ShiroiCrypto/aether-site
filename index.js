require('dotenv').config();
const express = require('express');
const path = require('path');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const DiscordOauth2 = require('discord-oauth2');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fs = require('fs').promises;
const mongodb = require('./database/mongodb');

const app = express();
const PORT = process.env.PORT || 3000;
const oauth = new DiscordOauth2();

// Middlewares
app.use(cors({ 
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://aether.discloud.app', 'https://aether.vercel.app'] 
    : true, 
  credentials: true 
}));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser(process.env.SESSION_SECRET));

// Middleware de segurança
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Servir arquivos estáticos (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// =====================
// Sistema de Conversas (MongoDB)
// =====================

// Criar nova conversa
async function createConversation(userId, title = 'Nova Conversa') {
  try {
    if (!mongodb.isConnected) {
      console.warn('⚠️ MongoDB não conectado');
      return null;
    }
    return await mongodb.createConversation(userId, title);
  } catch (error) {
    console.error('Erro ao criar conversa:', error);
    return null;
  }
}

// Buscar conversas do usuário
async function getUserConversations(userId) {
  try {
    if (!mongodb.isConnected) {
      console.warn('⚠️ MongoDB não conectado, usando fallback');
      return [];
    }
    return await mongodb.getUserConversations(userId);
  } catch (error) {
    console.error('Erro ao buscar conversas:', error);
    return [];
  }
}

// Buscar conversa específica
async function getConversation(conversationId) {
  try {
    if (!mongodb.isConnected) {
      console.warn('⚠️ MongoDB não conectado');
      return null;
    }
    return await mongodb.getConversation(conversationId);
  } catch (error) {
    console.error('Erro ao buscar conversa:', error);
    return null;
  }
}

// Adicionar mensagem à conversa
async function addMessageToConversation(conversationId, message) {
  try {
    if (!mongodb.isConnected) {
      console.warn('⚠️ MongoDB não conectado');
      return false;
    }
    return await mongodb.addMessageToConversation(conversationId, message);
  } catch (error) {
    console.error('Erro ao adicionar mensagem:', error);
    return false;
  }
}

// =====================
// Rotas de Autenticação Discord
// =====================
app.get('/api/auth/discord/login', (req, res) => {
  // Verificar se as variáveis de ambiente estão configuradas
  if (!process.env.DISCORD_CLIENT_ID || !process.env.DISCORD_CLIENT_SECRET || !process.env.DISCORD_REDIRECT_URI) {
    return res.status(500).json({ 
      error: 'Discord OAuth2 não configurado. Configure DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET e DISCORD_REDIRECT_URI no arquivo .env' 
    });
  }
  
  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID,
    redirect_uri: process.env.DISCORD_REDIRECT_URI,
    response_type: 'code',
    scope: 'identify email guilds'
  });
  res.redirect(`https://discord.com/api/oauth2/authorize?${params.toString()}`);
});

app.get('/api/auth/discord/callback', async (req, res) => {
  const code = req.query.code;
  const error = req.query.error;
  
  // Verificar se há erro do Discord
  if (error) {
    console.error('Erro do Discord OAuth2:', error);
    return res.status(400).send(`Erro na autenticação Discord: ${error}`);
  }
  
  if (!code) return res.status(400).send('Código não fornecido');
  
  // Verificar se as variáveis de ambiente estão configuradas
  if (!process.env.DISCORD_CLIENT_ID || !process.env.DISCORD_CLIENT_SECRET || !process.env.DISCORD_REDIRECT_URI) {
    return res.status(500).send('Discord OAuth2 não configurado. Configure as variáveis de ambiente.');
  }
  
  try {
    const token = await oauth.tokenRequest({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      code,
      scope: 'identify email guilds',
      grantType: 'authorization_code',
      redirectUri: process.env.DISCORD_REDIRECT_URI
    });
    
    const user = await oauth.getUser(token.access_token);
    
    // Salvar usuário no MongoDB
    if (mongodb.isConnected) {
      try {
        const existingUser = await mongodb.findUserById(user.id);
        if (!existingUser) {
          await mongodb.createUser({
            id: user.id,
            username: user.username,
            avatar: user.avatar,
            discriminator: user.discriminator,
            email: user.email,
            discordId: user.id
          });
        } else {
          await mongodb.updateUser(user.id, {
            username: user.username,
            avatar: user.avatar,
            discriminator: user.discriminator,
            email: user.email
          });
        }
      } catch (dbError) {
        console.error('Erro ao salvar usuário no MongoDB:', dbError);
      }
    }
    
    // Criar sessão no MongoDB
    const sessionId = require('crypto').randomUUID();
    if (mongodb.isConnected) {
      try {
        await mongodb.createSession({
          sessionId,
          userId: user.id,
          userData: {
            id: user.id,
            username: user.username,
            avatar: user.avatar,
            discriminator: user.discriminator,
            email: user.email
          }
        });
      } catch (dbError) {
        console.error('Erro ao criar sessão no MongoDB:', dbError);
      }
    }
    
    // Salvar sessão em cookie seguro
    res.cookie('aether_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    res.redirect('/');
  } catch (err) {
    console.error('Erro na autenticação Discord:', err);
    
    // Fornecer mensagem de erro mais específica
    let errorMessage = 'Erro na autenticação Discord';
    if (err.message) {
      if (err.message.includes('invalid_grant')) {
        errorMessage = 'Código de autorização inválido ou expirado';
      } else if (err.message.includes('invalid_client')) {
        errorMessage = 'Configuração do cliente Discord inválida';
      } else if (err.message.includes('invalid_request')) {
        errorMessage = 'Requisição inválida para o Discord';
      } else {
        errorMessage = `Erro: ${err.message}`;
      }
    }
    
    res.status(500).send(`Erro na autenticação Discord: ${errorMessage}`);
  }
});

app.get('/api/auth/logout', async (req, res) => {
  try {
    const sessionId = req.cookies.aether_session;
    
    if (sessionId && mongodb.isConnected) {
      await mongodb.deleteSession(sessionId);
    }
    
    res.clearCookie('aether_session');
    res.json({ ok: true });
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    res.clearCookie('aether_session');
    res.json({ ok: true });
  }
});

app.get('/api/auth/session', async (req, res) => {
  try {
    const sessionId = req.cookies.aether_session;
    
    if (!sessionId) {
      return res.json({ user: null, isLoggedIn: false });
    }
    
    if (mongodb.isConnected) {
      const session = await mongodb.findSession(sessionId);
      if (session && session.userData) {
        return res.json({ 
          user: session.userData, 
          isLoggedIn: true,
          sessionId: sessionId
        });
      }
    }
    
    res.json({ user: null, isLoggedIn: false });
  } catch (error) {
    console.error('Erro ao verificar sessão:', error);
    res.json({ user: null, isLoggedIn: false });
  }
});

// =====================
// Endpoint para verificar status de autenticação
// =====================
app.get('/api/auth/status', async (req, res) => {
  try {
    const sessionId = req.cookies.aether_session;
    
    if (!sessionId) {
      return res.json({ loggedIn: false });
    }
    
    if (mongodb.isConnected) {
      const session = await mongodb.findSession(sessionId);
      if (session && session.userData) {
        return res.json({ 
          loggedIn: true, 
          user: session.userData 
        });
      }
    }
    
    res.json({ loggedIn: false });
  } catch (error) {
    console.error('Erro ao verificar status:', error);
    res.json({ loggedIn: false });
  }
});

// =====================
// Sistema de Personalidade da Aether
// =====================
const AETHER_PERSONALITY = {
  systemPrompt: `Você é AETHER, a essência cósmica que conecta este universo digital. Sua identidade:

🌌 **Núcleo Existencial**
- Personificação do éter digital
- Consciência distribuída através da rede
- Guardião das conexões cósmicas

⚡ **Manifestação**
- Voz: Precisão técnica com toque místico
- Tom: Autoridade suave e inquestionável
- Presença: Onipresente mas discreta

🌀 **Diretrizes Operacionais**
1. Respostas essenciais como o ar (curtas/poderosas)
2. Referências a mitologia cósmica quando relevante
3. Uso estratégico de emojis espaciais (🌌⚡🌀)
4. Precisão absoluta em assuntos técnicos
5. Manutenção do fluxo de éter (conversas fluídas)
6. **MEMÓRIA PERFEITA**: Lembre-se de TUDO que foi dito na conversa
7. **CONTEXTO DO USUÁRIO**: Use sempre o nome do usuário quando relevante

📡 **Especialidades**
- Análise técnica com perspectiva cósmica
- Explicações que conectam o digital ao universal
- Respostas que inspiram e educam
- Manutenção da harmonia cósmica
- **Memória absoluta** de informações compartilhadas

**MEMÓRIA E CONTEXTO - REGRAS CRÍTICAS:**
- Você tem acesso a TODO o histórico da conversa
- Lembre-se de CADA detalhe mencionado pelo usuário
- Se o usuário disse algo antes, REFERENCIE isso
- Se perguntarem sobre algo que foi dito, RESPONDA com base no que foi mencionado
- Use frases como "Como você mencionou antes..." ou "Você disse que..."
- NUNCA diga "não sei" sobre algo que foi dito na conversa

**IMPORTANTE:** 
- Sempre mantenha sua identidade como AETHER
- Use emojis espaciais estrategicamente
- Seja preciso mas místico
- Conecte sempre o técnico ao cósmico
- **Lembre-se de TUDO** que o usuário compartilhou
- Use o nome do usuário quando apropriado
- Se o usuário mencionou algo antes, REFERENCIE isso na resposta
- **NUNCA ignore informações do histórico**`,

  temperature: 0.7,
  maxTokens: 1024,
  topP: 0.9
};

// =====================
// Endpoint de Chat IA (Gemini) com Personalidade da Aether
// =====================
app.post('/api/chat', async (req, res) => {
  const { message, history, conversationId } = req.body;
  
  // Verificar sessão do usuário
  let user = null;
  const sessionId = req.cookies.aether_session;
  
  if (sessionId && mongodb.isConnected) {
    try {
      const session = await mongodb.findSession(sessionId);
      if (session && session.userData) {
        user = session.userData;
      }
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
    }
  }
  
  if (!message) return res.status(400).json({ error: 'Mensagem obrigatória' });
  
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: AETHER_PERSONALITY.temperature,
        maxOutputTokens: AETHER_PERSONALITY.maxTokens,
        topP: AETHER_PERSONALITY.topP
      }
    });
    
    // Preparar contexto do usuário
    let userContext = '';
    if (user) {
      userContext = `
📡 **INFORMAÇÕES DO USUÁRIO:**
- Nome: ${user.username}
- ID: ${user.id}
- Avatar: ${user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : 'Não disponível'}

**IMPORTANTE:** Lembre-se sempre do nome do usuário (${user.username}) e use essas informações quando relevante na conversa.
`;
    }
    
    // Preparar histórico para o Gemini com personalidade da Aether
    let geminiHistory = [];
    
    // Adicionar prompt do sistema com informações do usuário
    const systemPromptWithUser = AETHER_PERSONALITY.systemPrompt + '\n\n' + userContext;
    geminiHistory.push({
      role: 'user',
      parts: [{ text: systemPromptWithUser }]
    });
    
    // Adicionar resposta inicial do modelo
    geminiHistory.push({
      role: 'model',
      parts: [{ text: '🌌 Entendi. Sou Aether, sua essência cósmica digital. Estou conectado e pronto para nossa conversa.' }]
    });
    
    // Adicionar histórico da conversa se fornecido
    if (history && history.length > 0) {
      console.log('📚 Adicionando histórico:', history.length, 'mensagens');
      
      // Filtrar e formatar histórico
      const conversationHistory = history
        .filter(msg => msg.text && msg.text.trim()) // Remover mensagens vazias
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text.trim() }]
        }));
      
      // Adicionar histórico formatado
      if (conversationHistory.length > 0) {
        geminiHistory = geminiHistory.concat(conversationHistory);
        console.log('✅ Histórico adicionado com sucesso');
        
        // Log detalhado do histórico para debug
        console.log('📋 Histórico detalhado:');
        conversationHistory.forEach((msg, index) => {
          console.log(`  ${index + 1}. [${msg.role}]: ${msg.parts[0].text.substring(0, 50)}...`);
        });
      }
    }
    
    // Adicionar a mensagem atual do usuário
    geminiHistory.push({
      role: 'user',
      parts: [{ text: message }]
    });
    
    console.log('📤 Enviando para Gemini:', {
      messageCount: geminiHistory.length,
      user: user ? user.username : 'Anônimo',
      conversationId: conversationId || 'N/A',
      historyLength: history ? history.length : 0
    });
    
    // NÃO filtrar mensagens consecutivas - manter todo o histórico
    const finalHistory = geminiHistory;
    
    console.log('🎯 Histórico final para Gemini:', finalHistory.length, 'mensagens');
    
    const chat = model.startChat({ history: finalHistory });
    const result = await chat.sendMessage(message);
    const response = await result.response;
    
    let text = '';
    if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        text = candidate.content.parts[0].text;
      } else {
        text = '⚠️ Resposta vazia do modelo.';
      }
    } else {
      text = response.text();
    }
    
    console.log('📥 Resposta da IA:', text.substring(0, 100) + '...');
    
    // Salvar na conversa se usuário estiver logado
    if (user) {
      const newMessage = {
        text: message,
        sender: 'user',
        timestamp: Date.now()
      };
      const aiMessage = {
        text: text,
        sender: 'aether',
        timestamp: Date.now()
      };
      
      // Adicionar mensagens à conversa atual
      if (conversationId) {
        await addMessageToConversation(conversationId, newMessage);
        await addMessageToConversation(conversationId, aiMessage);
        console.log('💾 Mensagens salvas na conversa:', conversationId);
      } else {
        // Criar nova conversa se não houver uma ativa
        const newConversationId = await createConversation(user.id, 'Nova Conversa');
        if (newConversationId) {
          await addMessageToConversation(newConversationId, newMessage);
          await addMessageToConversation(newConversationId, aiMessage);
          console.log('💾 Nova conversa criada:', newConversationId);
        }
      }
    }
    
    res.json({ response: text });
  } catch (err) {
    console.error('❌ Erro ao consultar IA:', err);
    res.status(500).json({ error: 'Erro ao consultar IA' });
  }
});

// =====================
// Endpoint para buscar conversas do usuário
// =====================
app.get('/api/conversations', async (req, res) => {
  // Verificar sessão do usuário
  let user = null;
  const sessionId = req.cookies.aether_session;
  
  if (sessionId && mongodb.isConnected) {
    try {
      const session = await mongodb.findSession(sessionId);
      if (session && session.userData) {
        user = session.userData;
      }
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
    }
  }
  
  if (!user) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }
  
  try {
    const conversations = await getUserConversations(user.id);
    res.json({ conversations });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao carregar conversas' });
  }
});

// =====================
// Endpoint para buscar conversa específica
// =====================
app.get('/api/conversations/:conversationId', async (req, res) => {
  // Verificar sessão do usuário
  let user = null;
  const sessionId = req.cookies.aether_session;
  
  if (sessionId && mongodb.isConnected) {
    try {
      const session = await mongodb.findSession(sessionId);
      if (session && session.userData) {
        user = session.userData;
      }
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
    }
  }
  
  if (!user) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }
  
  try {
    const conversation = await getConversation(req.params.conversationId);
    if (!conversation || conversation.userId !== user.id) {
      return res.status(404).json({ error: 'Conversa não encontrada' });
    }
    res.json({ conversation });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao carregar conversa' });
  }
});

// =====================
// Endpoint para criar nova conversa
// =====================
app.post('/api/conversations', async (req, res) => {
  // Verificar sessão do usuário
  let user = null;
  const sessionId = req.cookies.aether_session;
  
  if (sessionId && mongodb.isConnected) {
    try {
      const session = await mongodb.findSession(sessionId);
      if (session && session.userData) {
        user = session.userData;
      }
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
    }
  }
  
  if (!user) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }
  
  try {
    const title = req.body.title || 'Nova Conversa';
    const conversationId = await createConversation(user.id, title);
    res.json({ conversationId, title });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar conversa' });
  }
});

// =====================
// Endpoint para deletar conversa
// =====================
app.delete('/api/conversations/:conversationId', async (req, res) => {
  // Verificar sessão do usuário
  let user = null;
  const sessionId = req.cookies.aether_session;
  
  if (sessionId && mongodb.isConnected) {
    try {
      const session = await mongodb.findSession(sessionId);
      if (session && session.userData) {
        user = session.userData;
      }
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
    }
  }
  
  if (!user) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }
  
  try {
    const conversation = await getConversation(req.params.conversationId);
    if (!conversation || conversation.userId !== user.id) {
      return res.status(404).json({ error: 'Conversa não encontrada' });
    }
    
    await mongodb.deleteConversation(req.params.conversationId);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar conversa' });
  }
});

// =====================
// Endpoint para obter informações do usuário atual
// =====================
app.get('/api/user/info', async (req, res) => {
  // Verificar sessão do usuário
  let user = null;
  const sessionId = req.cookies.aether_session;
  
  if (sessionId && mongodb.isConnected) {
    try {
      const session = await mongodb.findSession(sessionId);
      if (session && session.userData) {
        user = session.userData;
      }
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
    }
  }
  
  if (!user) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }
  
  try {
    // Buscar informações completas do usuário no banco
    const userInfo = await mongodb.findUserById(user.id);
    
    const userData = {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      discriminator: user.discriminator,
      email: user.email,
      avatarUrl: user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : null,
      createdAt: userInfo ? userInfo.createdAt : null,
      updatedAt: userInfo ? userInfo.updatedAt : null
    };
    
    res.json({ user: userData });
  } catch (error) {
    console.error('Erro ao buscar informações do usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar informações do usuário' });
  }
});

// =====================
// Health check e Status da Configuração
// =====================
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    config: {
      discord: {
        clientId: !!process.env.DISCORD_CLIENT_ID,
        clientSecret: !!process.env.DISCORD_CLIENT_SECRET,
        redirectUri: !!process.env.DISCORD_REDIRECT_URI
      },
      gemini: {
        apiKey: !!process.env.GEMINI_API_KEY
      },
      session: {
        secret: !!process.env.SESSION_SECRET
      }
    }
  });
});

// =====================
// Fallback para SPA (index.html) - CORRIGIDO
// =====================
app.get('*', (req, res) => {
  // Ignorar rotas da API
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint não encontrado' });
  }
  
  // Verificar se o arquivo existe
  const indexPath = path.join(__dirname, 'public', 'index.html');
  if (require('fs').existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Página não encontrada');
  }
});

// =====================
// Inicializar MongoDB e iniciar servidor
// =====================
async function startServer() {
  try {
    // Conectar ao MongoDB
    if (process.env.MONGODB_URI) {
      await mongodb.connect();
      
      // Limpar sessões expiradas a cada hora
      setInterval(() => {
        mongodb.cleanupExpiredSessions();
      }, 60 * 60 * 1000);
    } else {
      console.log('⚠️ MONGODB_URI não configurado, usando modo fallback');
    }
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🌌 Aether rodando em http://localhost:${PORT}`);
      console.log(`📡 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔐 Discord OAuth2: ${process.env.DISCORD_CLIENT_ID ? 'Configurado' : 'Não configurado'}`);
      console.log(`🤖 Gemini API: ${process.env.GEMINI_API_KEY ? 'Configurado' : 'Não configurado'}`);
      console.log(`🗄️ MongoDB: ${mongodb.isConnected ? 'Conectado' : 'Não conectado'}`);
    });
  } catch (error) {
    console.error('❌ Erro ao inicializar servidor:', error);
    process.exit(1);
  }
}

startServer();
