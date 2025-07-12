// =====================
// Sistema de Gerenciamento de Conversas
// =====================

class ConversationManager {
  constructor() {
    this.currentConversationId = null;
    this.conversations = [];
    this.isLoggedIn = false;
    this.userId = null;
    
    this.init();
  }

  async init() {
    this.bindEvents();
    await this.checkLoginStatus();
    await this.loadConversations();
  }

  bindEvents() {
    console.log('🔧 Configurando event listeners do ConversationManager...');
    
    // Botão nova conversa
    const newConversationBtn = document.getElementById('new-conversation-btn');
    if (newConversationBtn) {
      console.log('✅ Botão nova conversa encontrado');
      newConversationBtn.addEventListener('click', () => this.createNewConversation());
    } else {
      console.error('❌ Botão nova conversa não encontrado');
    }

    // Toggle sidebar
    const sidebarToggle = document.getElementById('sidebar-toggle');
    if (sidebarToggle) {
      console.log('✅ Botão toggle sidebar encontrado');
      sidebarToggle.addEventListener('click', () => {
        console.log('📱 Botão toggle sidebar clicado');
        this.toggleSidebar();
      });
    } else {
      console.error('❌ Botão sidebar-toggle não encontrado');
    }
    
    console.log('✅ Event listeners do ConversationManager configurados');
  }

  async checkLoginStatus() {
    try {
      const response = await fetch('/api/auth/status');
      const data = await response.json();
      
      this.isLoggedIn = data.loggedIn;
      this.userId = data.user?.id;
      
      this.updateUI();
    } catch (error) {
      console.error('Erro ao verificar status de login:', error);
      this.isLoggedIn = false;
    }
  }

  updateUI() {
    const sidebar = document.getElementById('chat-sidebar');
    const conversationsList = document.getElementById('conversations-list');
    const newConversationBtn = document.getElementById('new-conversation-btn');
    
    if (!this.isLoggedIn) {
      if (sidebar) sidebar.style.display = 'none';
      if (newConversationBtn) newConversationBtn.style.display = 'none';
      return;
    }
    
    if (sidebar) sidebar.style.display = 'flex';
    if (newConversationBtn) newConversationBtn.style.display = 'flex';
    
    // Mostrar mensagem se não há conversas
    if (this.conversations.length === 0) {
      if (conversationsList) {
        conversationsList.innerHTML = `
          <div class="no-conversations">
            <i class="fas fa-comments"></i>
            <p>Nenhuma conversa encontrada</p>
            <p>Crie sua primeira conversa para começar!</p>
          </div>
        `;
      }
    }
  }

  async loadConversations() {
    if (!this.isLoggedIn) return;
    
    try {
      const response = await fetch('/api/conversations');
      const data = await response.json();
      
      this.conversations = data.conversations || [];
      this.renderConversations();
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    }
  }

  renderConversations() {
    const conversationsList = document.getElementById('conversations-list');
    if (!conversationsList) return;
    
    if (this.conversations.length === 0) {
      conversationsList.innerHTML = `
        <div class="no-conversations">
          <i class="fas fa-comments"></i>
          <p>Nenhuma conversa encontrada</p>
          <p>Crie sua primeira conversa para começar!</p>
        </div>
      `;
      return;
    }
    
    conversationsList.innerHTML = this.conversations.map(conversation => {
      const isActive = conversation._id === this.currentConversationId;
      const lastMessage = conversation.messages && conversation.messages.length > 0 
        ? conversation.messages[conversation.messages.length - 1] 
        : null;
      
      const date = new Date(conversation.updatedAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      });
      
      return `
        <div class="conversation-item ${isActive ? 'active' : ''}" 
             data-conversation-id="${conversation._id}">
          <div class="conversation-header">
            <div class="conversation-info">
              <div class="conversation-title">${conversation.title}</div>
              <div class="conversation-date">${date}</div>
            </div>
            <button class="delete-conversation-btn" data-conversation-id="${conversation._id}" title="Deletar conversa">
              <i class="fas fa-trash"></i>
            </button>
          </div>
          ${lastMessage ? `<div class="conversation-preview">${lastMessage.text.substring(0, 50)}...</div>` : ''}
        </div>
      `;
    }).join('');
    
    // Adicionar event listeners
    conversationsList.querySelectorAll('.conversation-item').forEach(item => {
      item.addEventListener('click', (e) => {
        // Não executar se clicou no botão de deletar
        if (e.target.closest('.delete-conversation-btn')) {
          return;
        }
        const conversationId = item.dataset.conversationId;
        this.loadConversation(conversationId);
      });
    });
    
    // Event listeners para botões de deletar
    conversationsList.querySelectorAll('.delete-conversation-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que o clique propague para o item
        const conversationId = btn.dataset.conversationId;
        this.deleteConversation(conversationId);
      });
    });
  }

  async createNewConversation() {
    if (!this.isLoggedIn) {
      alert('Faça login para criar conversas');
      return;
    }
    
    try {
      const title = prompt('Digite o título da nova conversa:', 'Nova Conversa');
      if (!title) return;
      
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title })
      });
      
      const data = await response.json();
      
      if (data.conversationId) {
        this.currentConversationId = data.conversationId;
        await this.loadConversations();
        await this.loadConversation(data.conversationId);
        if (window.aetherChat) {
          window.aetherChat.setMessages([]);
          window.aetherChat.addMessage('🌌 Nova conversa criada! Como posso ajudá-lo hoje?', 'aether');
        }
      }
    } catch (error) {
      console.error('Erro ao criar conversa:', error);
      alert('Erro ao criar conversa');
    }
  }

  async loadConversation(conversationId) {
    if (!this.isLoggedIn) return;
    
    try {
      console.log('🔄 Carregando conversa:', conversationId);
      this.currentConversationId = conversationId;
      this.renderConversations(); // Atualizar UI
      
      // Carregar mensagens usando o novo método do chat.js
      if (window.aetherChat) {
        const success = await window.aetherChat.loadConversationFromDatabase(conversationId);
        if (success) {
          console.log('✅ Conversa carregada com sucesso');
        } else {
          console.log('⚠️ Conversa não encontrada ou vazia');
          window.aetherChat.setMessages([]);
          window.aetherChat.addMessage('🌌 Nova conversa iniciada. Como posso ajudá-lo hoje?', 'aether');
        }
      }
    } catch (error) {
      console.error('❌ Erro ao carregar conversa:', error);
    }
  }

  async deleteConversation(conversationId) {
    if (!confirm('Tem certeza que deseja deletar esta conversa?')) return;
    
    try {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        // Se a conversa deletada era a atual, resetar
        if (this.currentConversationId === conversationId) {
          this.currentConversationId = null;
          if (window.aetherChat) {
            window.aetherChat.setMessages([]);
            window.aetherChat.addMessage('🌌 Conversa deletada. Selecione outra conversa ou crie uma nova.', 'aether');
          }
        }
        
        // Recarregar lista de conversas
        await this.loadConversations();
        
        // Se não há conversa ativa mas existem outras, selecionar a primeira
        if (!this.currentConversationId && this.conversations.length > 0) {
          const firstConversation = this.conversations[0];
          await this.loadConversation(firstConversation._id);
        }
        
        // Se não há conversas, mostrar mensagem
        if (this.conversations.length === 0) {
          if (window.aetherChat) {
            window.aetherChat.setMessages([]);
            window.aetherChat.addMessage('🌌 Nenhuma conversa encontrada. Crie uma nova conversa para começar!', 'aether');
          }
        }
      }
    } catch (error) {
      console.error('Erro ao deletar conversa:', error);
      alert('Erro ao deletar conversa');
    }
  }

  clearChat() {
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
      chatMessages.innerHTML = '';
    }
  }

  toggleSidebar() {
    console.log('🔄 Toggle sidebar chamado');
    const sidebar = document.getElementById('chat-sidebar');
    if (sidebar) {
      const wasCollapsed = sidebar.classList.contains('collapsed');
      sidebar.classList.toggle('collapsed');
      const isNowCollapsed = sidebar.classList.contains('collapsed');
      console.log(`✅ Sidebar ${wasCollapsed ? 'expandida' : 'colapsada'}: ${isNowCollapsed ? 'colapsada' : 'expandida'}`);
      
      // Atualizar ícone do botão se existir
      const toggleBtn = document.getElementById('sidebar-toggle');
      if (toggleBtn) {
        const icon = toggleBtn.querySelector('i');
        if (icon) {
          icon.className = isNowCollapsed ? 'fas fa-bars' : 'fas fa-times';
        }
      }
    } else {
      console.error('❌ Elemento chat-sidebar não encontrado');
    }
  }

  getCurrentConversationId() {
    return this.currentConversationId;
  }

  setCurrentConversationId(conversationId) {
    this.currentConversationId = conversationId;
  }
}

// =====================
// Estilos para elementos dinâmicos
// =====================
const conversationsStyle = document.createElement('style');
conversationsStyle.textContent = `
  .no-conversations {
    text-align: center;
    padding: 2rem;
    color: var(--color-text-alt);
  }
  
  .no-conversations i {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: var(--color-primary);
  }
  
  .no-conversations p {
    margin: 0.5rem 0;
  }
  
  .conversation-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.3rem;
  }
  
  .conversation-info {
    flex: 1;
  }
  
  .delete-conversation-btn {
    background: rgba(255, 0, 0, 0.2);
    border: none;
    border-radius: 4px;
    padding: 0.3rem 0.5rem;
    color: #ff4444;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.8rem;
    opacity: 0;
  }
  
  .conversation-item:hover .delete-conversation-btn {
    opacity: 1;
  }
  
  .delete-conversation-btn:hover {
    background: rgba(255, 0, 0, 0.3);
    color: #ff6666;
  }
  
  .chat-sidebar {
    transition: width 0.3s ease, opacity 0.3s ease;
    overflow: hidden;
  }
  
  .chat-sidebar.collapsed {
    width: 0 !important;
    opacity: 0;
    padding: 0;
    margin: 0;
  }
  
  .chat-sidebar:not(.collapsed) {
    width: 300px;
    opacity: 1;
  }
  
  @media (max-width: 768px) {
    .chat-sidebar.collapsed {
      display: none;
    }
    
    .delete-conversation-btn {
      opacity: 1;
    }
    
    .chat-sidebar:not(.collapsed) {
      width: 100%;
      max-width: 300px;
    }
  }
`;
document.head.appendChild(conversationsStyle);

// =====================
// Inicialização
// =====================
const conversationManager = new ConversationManager();

// Exportar para uso global
window.conversationManager = conversationManager; 