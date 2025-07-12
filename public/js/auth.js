// =====================
// Discord Authentication System
// =====================
class DiscordAuth {
  constructor() {
    this.isAuthenticated = false;
    this.user = null;
    this.loginBtn = document.getElementById('login-btn');
    this.userProfile = document.getElementById('user-profile');
    this.userAvatar = document.getElementById('user-avatar');
    this.userName = document.getElementById('user-name');
    this.logoutBtn = document.getElementById('logout-btn');
    this.discordOAuthBtn = document.getElementById('discord-oauth-btn');
    
    this.init();
  }

  async init() {
    await this.checkSession();
    this.setupEventListeners();
    this.updateUI();
  }

  setupEventListeners() {
    // Botão de login na navbar
    this.loginBtn && this.loginBtn.addEventListener('click', () => {
      this.showLoginModal();
    });

    // Botão de logout
    this.logoutBtn && this.logoutBtn.addEventListener('click', () => {
      this.logout();
    });

    // Botão OAuth no modal
    this.discordOAuthBtn && this.discordOAuthBtn.addEventListener('click', () => {
      this.authenticateWithDiscord();
    });
  }

  showLoginModal() {
    const modal = document.getElementById('discord-modal');
    if (modal) {
      modal.style.display = 'flex';
    }
  }

  async authenticateWithDiscord() {
    // Redirecionar para login real do Discord
    window.location.href = '/api/auth/discord/login';
  }

  async login(user) {
    this.isAuthenticated = true;
    this.user = user;
    this.saveUserState();
    this.updateUI();
    
    // Atualizar sistema de conversas
    if (window.conversationManager) {
      await window.conversationManager.checkLoginStatus();
      await window.conversationManager.loadConversations();
    }
    
    // Mostrar notificação de sucesso
    this.showNotification('Login realizado com sucesso!', 'success');
  }

  async logout() {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        this.isAuthenticated = false;
        this.user = null;
        this.updateUI();
        
        // Atualizar sistema de conversas
        if (window.conversationManager) {
          await window.conversationManager.checkLoginStatus();
          window.conversationManager.clearChat();
        }
        
        this.showNotification('Logout realizado com sucesso!', 'info');
      }
    } catch (error) {
      console.error('Erro no logout:', error);
      this.showNotification('Erro ao fazer logout', 'error');
    }
  }

  async checkSession() {
    try {
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.isLoggedIn && data.user) {
          this.isAuthenticated = true;
          this.user = data.user;
          this.updateLoginState();
          
          // Atualizar sistema de conversas
          if (window.conversationManager) {
            await window.conversationManager.checkLoginStatus();
            await window.conversationManager.loadConversations();
          }
        } else {
          this.isAuthenticated = false;
          this.user = null;
          this.updateLoginState();
          
          // Limpar sistema de conversas
          if (window.conversationManager) {
            await window.conversationManager.checkLoginStatus();
          }
        }
      }
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
      this.isAuthenticated = false;
      this.user = null;
      this.updateLoginState();
    }
  }

  updateLoginState() {
    // Atualizar elementos da UI baseado no estado de login
    const loginElements = document.querySelectorAll('.login-required');
    const loggedInElements = document.querySelectorAll('.logged-in-only');
    const ctaElements = document.querySelectorAll('.cta-discord');
    
    if (this.isAuthenticated && this.user) {
      // Usuário logado
      loginElements.forEach(el => el.style.display = 'none');
      loggedInElements.forEach(el => el.style.display = 'block');
      ctaElements.forEach(el => {
        el.innerHTML = `
          <i class="fas fa-check"></i>
          ✅ Conectado como ${this.user.username}
        `;
        el.classList.add('connected');
      });
    } else {
      // Usuário não logado
      loginElements.forEach(el => el.style.display = 'block');
      loggedInElements.forEach(el => el.style.display = 'none');
      ctaElements.forEach(el => {
        el.innerHTML = `
          <i class="fab fa-discord"></i>
          🔐 Conectar com Discord
        `;
        el.classList.remove('connected');
      });
    }
  }

  updateUI() {
    if (this.isAuthenticated && this.user) {
      // Mostrar perfil do usuário
      this.loginBtn.style.display = 'none';
      this.userProfile.style.display = 'flex';
      
      // Atualizar dados do usuário
      if (this.user.avatar) {
        this.userAvatar.src = `https://cdn.discordapp.com/avatars/${this.user.id}/${this.user.avatar}.png`;
      } else {
        this.userAvatar.src = `https://cdn.discordapp.com/embed/avatars/${this.user.discriminator % 5}.png`;
      }
      this.userName.textContent = this.user.username;
      
      // Mostrar notificação de boas-vindas
      this.showNotification(`Bem-vindo, ${this.user.username}! 🌌`, 'success');
      
    } else {
      // Mostrar botão de login
      this.loginBtn.style.display = 'flex';
      this.userProfile.style.display = 'none';
    }
  }

  showLoadingState() {
    if (this.discordOAuthBtn) {
      this.discordOAuthBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Conectando...';
      this.discordOAuthBtn.disabled = true;
    }
  }

  hideLoadingState() {
    if (this.discordOAuthBtn) {
      this.discordOAuthBtn.innerHTML = '<i class="fab fa-discord"></i> Conectar Conta Discord';
      this.discordOAuthBtn.disabled = false;
    }
  }

  closeModal() {
    const modal = document.getElementById('discord-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  saveUserState() {
    localStorage.setItem('aether-user', JSON.stringify({
      isAuthenticated: this.isAuthenticated,
      user: this.user
    }));
  }

  loadUserState() {
    const saved = localStorage.getItem('aether-user');
    if (saved) {
      const state = JSON.parse(saved);
      this.isAuthenticated = state.isAuthenticated;
      this.user = state.user;
    }
  }

  showNotification(message, type = 'info') {
    // Criar notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-${this.getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
      </div>
    `;
    
    // Adicionar ao DOM
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Botão de fechar
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    });
  }

  getNotificationIcon(type) {
    switch (type) {
      case 'success': return 'check-circle';
      case 'error': return 'exclamation-circle';
      case 'warning': return 'exclamation-triangle';
      default: return 'info-circle';
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// =====================
// Inicializar Autenticação
// =====================
document.addEventListener('DOMContentLoaded', () => {
  new DiscordAuth();
});

// =====================
// CSS para Notificações
// =====================
const notificationCSS = `
  .notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--color-glass);
    backdrop-filter: var(--color-glass-blur);
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 300px;
  }
  
  .notification.show {
    transform: translateX(0);
  }
  
  .notification-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--color-text);
  }
  
  .notification-success {
    border-left: 4px solid #00FF88;
  }
  
  .notification-error {
    border-left: 4px solid #FF4444;
  }
  
  .notification-warning {
    border-left: 4px solid #FFAA00;
  }
  
  .notification-info {
    border-left: 4px solid var(--color-primary);
  }
  
  .notification-close {
    background: transparent;
    border: none;
    color: var(--color-text-alt);
    cursor: pointer;
    font-size: 1.2rem;
    margin-left: auto;
  }
  
  .notification-close:hover {
    color: var(--color-text);
  }
`;

// Adicionar CSS das notificações
const notificationStyle = document.createElement('style');
notificationStyle.textContent = notificationCSS;
document.head.appendChild(notificationStyle); 