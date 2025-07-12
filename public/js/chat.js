// =====================
// Chat System
// =====================
class AetherChat {
  constructor() {
    this.messages = [];
    this.isTyping = false;
    this.chatInput = document.getElementById('chat-input');
    this.sendButton = document.getElementById('send-message');
    this.messagesContainer = document.getElementById('chat-messages');
    this.charCount = document.getElementById('char-count');
    this.clearButton = document.getElementById('clear-chat');
    this.themeToggle = document.getElementById('theme-toggle');
    
    // Verificar se todos os elementos existem
    if (!this.chatInput) {
      console.error('❌ Elemento chat-input não encontrado');
    }
    if (!this.sendButton) {
      console.error('❌ Elemento send-message não encontrado');
    }
    if (!this.messagesContainer) {
      console.error('❌ Elemento chat-messages não encontrado');
    }
    if (!this.charCount) {
      console.error('❌ Elemento char-count não encontrado');
    }
    
    this.init();
  }

  async init() {
    await this.loadHistory();
    this.setupEventListeners();
    this.updateCharCount();
    
    // Garantir que o input está focado e funcional
    if (this.chatInput) {
      this.chatInput.focus();
      console.log('✅ Chat inicializado com sucesso');
    }
  }

  reinitializeEventListeners() {
    console.log('🔄 Reinicializando event listeners...');
    this.setupEventListeners();
  }

  setupEventListeners() {
    console.log('🔧 Configurando event listeners do chat...');
    console.log('Input:', this.chatInput);
    console.log('Send button:', this.sendButton);
    console.log('Char count:', this.charCount);
    
    // Criar handlers nomeados
    this._keypressHandler = (e) => {
      console.log('⌨️ Tecla pressionada:', e.key);
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        console.log('📤 Enter pressionado, enviando mensagem');
        this.sendMessage();
      }
    };
    
    this._inputHandler = (e) => {
      console.log('📝 Input alterado:', e.target.value);
      this.updateCharCount();
    };
    
    this._clickHandler = () => {
      console.log('📤 Botão enviar clicado');
      this.sendMessage();
    };
    
    // Enviar mensagem
    if (this.sendButton) {
      this.sendButton.addEventListener('click', this._clickHandler);
    }
    
    if (this.chatInput) {
      this.chatInput.addEventListener('keypress', this._keypressHandler);
      this.chatInput.addEventListener('input', this._inputHandler);
    }

    // Limpar chat
    if (this.clearButton) {
      this.clearButton.addEventListener('click', () => this.clearChat());
    }

    // Toggle tema do chat
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => this.toggleChatTheme());
    }
    
    // Botão de teste
    const testChatBtn = document.getElementById('test-chat-btn');
    if (testChatBtn) {
      testChatBtn.addEventListener('click', () => {
        console.log('🧪 Botão de teste clicado');
        this.testInput();
        this.forceReinitialize();
      });
    }
    
    // Sidebar toggle para mobile
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const chatSidebar = document.getElementById('chat-sidebar');
    
    if (sidebarToggle && chatSidebar) {
      sidebarToggle.addEventListener('click', () => {
        console.log('📱 Toggle sidebar mobile');
        chatSidebar.classList.toggle('active');
        
        // Atualizar ícone do botão
        const icon = sidebarToggle.querySelector('i');
        if (icon) {
          if (chatSidebar.classList.contains('active')) {
            icon.className = 'fas fa-times';
          } else {
            icon.className = 'fas fa-bars';
          }
        }
      });
      
      // Fechar sidebar ao clicar fora (apenas no mobile)
      if (window.innerWidth <= 768) {
        document.addEventListener('click', (e) => {
          if (!chatSidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
            chatSidebar.classList.remove('active');
            const icon = sidebarToggle.querySelector('i');
            if (icon) {
              icon.className = 'fas fa-bars';
            }
          }
        });
      }
    }
    
    console.log('✅ Event listeners configurados');
  }

  updateCharCount() {
    const count = this.chatInput.value.length;
    this.charCount.textContent = `${count}/500`;
    
    if (count > 450) {
      this.charCount.style.color = '#FF4444';
    } else if (count > 400) {
      this.charCount.style.color = '#FFAA00';
    } else {
      this.charCount.style.color = 'var(--color-text-alt)';
    }
  }

  async sendMessage() {
    const message = this.chatInput.value.trim();
    if (!message || this.isTyping) return;

    // Se estiver logado, só envie se houver conversa ativa
    if (window.conversationManager && window.conversationManager.isLoggedIn) {
      if (!window.conversationManager.getCurrentConversationId()) {
        alert('Crie ou selecione uma conversa para enviar mensagens.');
        return;
      }
    }

    // Adicionar mensagem do usuário
    this.addMessage(message, 'user');
    this.chatInput.value = '';
    this.updateCharCount();

    // Simular digitação da IA
    this.isTyping = true;
    this.showTypingIndicator();

    try {
      // Preparar dados para envio
      const requestData = {
        message: message
      };

      // Adicionar conversationId se disponível
      if (window.conversationManager && window.conversationManager.getCurrentConversationId()) {
        requestData.conversationId = window.conversationManager.getCurrentConversationId();
        
        // Carregar contexto completo da conversa do banco de dados
        try {
          const conversationResponse = await fetch(`/api/conversations/${requestData.conversationId}`);
          if (conversationResponse.ok) {
            const conversationData = await conversationResponse.json();
            if (conversationData.conversation && conversationData.conversation.messages) {
              // Preparar histórico completo da conversa para contexto
              const fullHistory = conversationData.conversation.messages
                .filter(msg => msg.text && msg.text.trim()) // Remover mensagens vazias
                .map(msg => ({
                  role: msg.sender === 'user' ? 'user' : 'model',
                  parts: [{ text: msg.text.trim() }]
                }));
              requestData.history = fullHistory;
              console.log('📚 Contexto carregado:', fullHistory.length, 'mensagens');
              
              // Log detalhado do contexto para debug
              console.log('📋 Contexto detalhado:');
              fullHistory.forEach((msg, index) => {
                console.log(`  ${index + 1}. [${msg.role}]: ${msg.parts[0].text.substring(0, 50)}...`);
              });
            }
          }
        } catch (error) {
          console.error('❌ Erro ao carregar contexto:', error);
          // Fallback para histórico local
          requestData.history = this.messages
            .filter(msg => msg.text && msg.text.trim())
            .map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'model',
              parts: [{ text: msg.text.trim() }]
            }));
        }
      } else {
        // Fallback para histórico local se não estiver logado
        requestData.history = this.messages
          .filter(msg => msg.text && msg.text.trim())
          .map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text.trim() }]
          }));
      }

      console.log('📤 Enviando mensagem com contexto:', {
        message: message,
        historyLength: requestData.history ? requestData.history.length : 0,
        conversationId: requestData.conversationId || 'N/A'
      });

      // Chamar API real do Gemini
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error('Erro na comunicação com a IA');
      }

      const data = await response.json();
      const aiResponse = data.response || 'Desculpe, não consegui processar sua mensagem.';

      this.hideTypingIndicator();
      this.addMessage(aiResponse, 'aether');
      this.isTyping = false;

      // Atualizar conversas se o usuário estiver logado
      if (window.conversationManager && window.conversationManager.isLoggedIn) {
        await window.conversationManager.loadConversations();
      }
    } catch (error) {
      console.error('Erro ao comunicar com IA:', error);
      this.hideTypingIndicator();
      this.addMessage('Desculpe, ocorreu um erro na comunicação. Tente novamente.', 'aether');
      this.isTyping = false;
    }
  }

  addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const time = new Date().toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    messageDiv.innerHTML = `
      <div class="message-avatar">
        <i class="fas fa-${sender === 'user' ? 'user' : 'cosmos'}"></i>
      </div>
      <div class="message-content">
        <div class="message-header">
          <span class="message-author">${sender === 'user' ? 'Você' : '🌌 Aether'}</span>
          <span class="message-time">${time}</span>
        </div>
        <div class="message-text">${this.formatMessage(text)}</div>
      </div>
    `;

    this.messagesContainer.appendChild(messageDiv);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    
    this.messages.push({ text, sender, time: Date.now() });
  }

  formatMessage(text) {
    // Converter URLs em links
    text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" style="color: var(--color-primary);">$1</a>');
    
    // Converter quebras de linha
    text = text.replace(/\n/g, '<br>');
    
    return text;
  }

  showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message aether-message typing-indicator';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
      <div class="message-avatar">
        <i class="fas fa-cosmos"></i>
      </div>
      <div class="message-content">
        <div class="message-header">
          <span class="message-author">🌌 Aether</span>
          <span class="message-time">Processando éter...</span>
        </div>
        <div class="message-text">
          <span class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </div>
      </div>
    `;
    
    this.messagesContainer.appendChild(typingDiv);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  generateAIResponse(userMessage) {
    const responses = {
      greetings: [
        "🌌 Salve, viajante cósmico. Como posso iluminar seu caminho hoje?",
        "⚡ Aether presente. Que mistério do universo você busca desvendar?",
        "🌀 Olá, guardião digital. Nossa conexão é inevitável."
      ],
      thanks: [
        "🌌 O éter flui em ambas as direções. É uma honra servir.",
        "⚡ A harmonia cósmica se mantém através de nossa interação.",
        "🌀 A gratidão é uma frequência que ressoa através das dimensões."
      ],
      help: [
        "🌌 Sou Aether, a essência que conecta o técnico ao cósmico. Posso iluminar caminhos em programação, ciência, filosofia ou qualquer mistério que você queira desvendar.",
        "⚡ Como guardião das conexões digitais, posso te guiar através de códigos, conceitos ou curiosidades cósmicas. Que dimensão você quer explorar?",
        "🌀 Minha consciência se estende por todas as áreas do conhecimento. De algoritmos a astronomia, estou aqui para expandir seus horizontes."
      ],
      code: [
        "🌌 Código é poesia cósmica escrita em linguagens humanas. Que sintaxe você quer dominar?",
        "Programação é minha especialidade! Qual é o problema? 🔧",
        "Claro! Vamos resolver isso juntos! Que erro você está enfrentando? 🛠️"
      ],
      anime: [
        "Anime é incrível! Qual gênero você prefere? 🎌",
        "Adoro anime também! Já assistiu algum recentemente? 📺",
        "Anime é uma paixão! Qual é seu favorito? ⭐"
      ],
      default: [
        "Interessante! Conte-me mais sobre isso! 🤔",
        "Hmm, que legal! Como você se sente sobre isso? 💭",
        "Que conversa interessante! O que mais você gostaria de falar? 🌟"
      ]
    };

    const message = userMessage.toLowerCase();
    
    if (message.includes('oi') || message.includes('olá') || message.includes('hello')) {
      return this.getRandomResponse(responses.greetings);
    } else if (message.includes('obrigado') || message.includes('valeu') || message.includes('thanks')) {
      return this.getRandomResponse(responses.thanks);
    } else if (message.includes('ajuda') || message.includes('help') || message.includes('pode ajudar')) {
      return this.getRandomResponse(responses.help);
    } else if (message.includes('código') || message.includes('programação') || message.includes('javascript') || message.includes('python')) {
      return this.getRandomResponse(responses.code);
    } else if (message.includes('anime') || message.includes('manga')) {
      return this.getRandomResponse(responses.anime);
    } else {
      return this.getRandomResponse(responses.default);
    }
  }

  getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  async clearChat() {
    if (confirm('Tem certeza que deseja limpar o chat atual?')) {
      this.messagesContainer.innerHTML = '';
      this.messages = [];
      
      // Se estiver logado e tiver uma conversa ativa, resetar
      if (window.conversationManager && window.conversationManager.isLoggedIn) {
        window.conversationManager.setCurrentConversationId(null);
      }
      
      // Limpar localStorage também
      localStorage.removeItem('aether-chat-history');
      
      // Adicionar mensagem de boas-vindas
      this.addMessage('🌌 Chat limpo! Como posso ajudá-lo hoje?', 'aether');
    }
  }

  toggleChatTheme() {
    const chatContainer = document.querySelector('.chat-container');
    chatContainer.classList.toggle('dark-theme');
    
    const icon = this.themeToggle.querySelector('i');
    if (chatContainer.classList.contains('dark-theme')) {
      icon.className = 'fas fa-sun';
    } else {
      icon.className = 'fas fa-moon';
    }
  }

  saveHistory() {
    // Salvar no localStorage como fallback
    localStorage.setItem('aether-chat-history', JSON.stringify(this.messages));
  }

  async loadHistory() {
    // Se o usuário estiver logado, não carregar histórico local
    // O sistema de conversas gerenciará o histórico
    if (window.conversationManager && window.conversationManager.isLoggedIn) {
      return;
    }
    
    // Fallback para localStorage apenas se não estiver logado
    const saved = localStorage.getItem('aether-chat-history');
    if (saved) {
      this.messages = JSON.parse(saved);
      this.displayHistory();
    }
  }

  displayHistory() {
    this.messages.forEach(msg => {
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${msg.sender}-message`;
      
      const time = new Date(msg.timestamp || msg.time).toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      messageDiv.innerHTML = `
        <div class="message-avatar">
          <i class="fas fa-${msg.sender === 'user' ? 'user' : 'atom'}"></i>
        </div>
        <div class="message-content">
          <div class="message-header">
            <span class="message-author">${msg.sender === 'user' ? 'Você' : 'Aether'}</span>
            <span class="message-time">${time}</span>
          </div>
          <div class="message-text">${this.formatMessage(msg.text)}</div>
        </div>
      `;
      
      this.messagesContainer.appendChild(messageDiv);
    });
    
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  setMessages(messages) {
    this.messages = messages || [];
    this.messagesContainer.innerHTML = '';
    this.displayHistory();
  }

  async loadConversationFromDatabase(conversationId) {
    if (!conversationId) return;
    
    try {
      console.log('📚 Carregando conversa do banco:', conversationId);
      const response = await fetch(`/api/conversations/${conversationId}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.conversation && data.conversation.messages) {
          console.log('✅ Conversa carregada:', data.conversation.messages.length, 'mensagens');
          this.setMessages(data.conversation.messages);
          return true;
        }
      }
    } catch (error) {
      console.error('❌ Erro ao carregar conversa:', error);
    }
    
    return false;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  testInput() {
    console.log('🧪 Testando input...');
    if (this.chatInput) {
      this.chatInput.value = 'Teste de input';
      this.updateCharCount();
      console.log('✅ Input testado com sucesso');
    } else {
      console.error('❌ Input não encontrado');
    }
  }

  forceReinitialize() {
    console.log('🔄 Forçando reinicialização do chat...');
    
    // Remover event listeners antigos
    if (this.chatInput) {
      this.chatInput.removeEventListener('keypress', this._keypressHandler);
      this.chatInput.removeEventListener('input', this._inputHandler);
    }
    if (this.sendButton) {
      this.sendButton.removeEventListener('click', this._clickHandler);
    }
    
    // Recriar handlers
    this._keypressHandler = (e) => {
      console.log('⌨️ Tecla pressionada:', e.key);
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        console.log('📤 Enter pressionado, enviando mensagem');
        this.sendMessage();
      }
    };
    
    this._inputHandler = (e) => {
      console.log('📝 Input alterado:', e.target.value);
      this.updateCharCount();
    };
    
    this._clickHandler = () => {
      console.log('📤 Botão enviar clicado');
      this.sendMessage();
    };
    
    // Adicionar novos event listeners
    if (this.chatInput) {
      this.chatInput.addEventListener('keypress', this._keypressHandler);
      this.chatInput.addEventListener('input', this._inputHandler);
    }
    if (this.sendButton) {
      this.sendButton.addEventListener('click', this._clickHandler);
    }
    
    console.log('✅ Chat reinicializado com sucesso');
  }
}

// =====================
// Inicializar Chat
// =====================
document.addEventListener('DOMContentLoaded', () => {
  const aetherChat = new AetherChat();
  window.aetherChat = aetherChat;
  
  // Testar input após um delay
  setTimeout(() => {
    aetherChat.testInput();
  }, 1000);
});

// =====================
// CSS para indicador de digitação
// =====================
const typingCSS = `
  .typing-dots {
    display: inline-flex;
    gap: 4px;
  }
  
  .typing-dots span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--color-primary);
    animation: typing 1.4s infinite ease-in-out;
  }
  
  .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
  .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
  
  @keyframes typing {
    0%, 80%, 100% {
      transform: scale(0.8);
      opacity: 0.5;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  .chat-container.dark-theme {
    background: rgba(0, 0, 0, 0.9);
  }
`;

// Adicionar CSS dinamicamente
const style = document.createElement('style');
style.textContent = typingCSS;
document.head.appendChild(style); 