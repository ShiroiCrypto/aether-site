// =====================
// Loading Screen
// =====================
window.addEventListener('DOMContentLoaded', () => {
  const loadingScreen = document.getElementById('loading-screen');
  setTimeout(() => {
    loadingScreen.style.opacity = 0;
    setTimeout(() => loadingScreen.style.display = 'none', 500);
  }, 1200);
});

// =====================
// AOS Animation Init
// =====================
AOS.init({
  duration: 900,
  once: true,
  offset: 60
});

// =====================
// Navbar Toggle (Mobile)
// =====================
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    
    // Prevenir scroll do body quando menu está aberto
    if (navMenu.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });
  
  // Fechar menu ao clicar em um link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
  
  // Fechar menu ao clicar fora
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// =====================
// Smooth Scroll
// =====================
document.querySelectorAll('a.nav-link').forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
      navMenu.classList.remove('active');
    }
  });
});

// =====================
// Theme Switching & Preferences
// =====================
const themeOptions = document.querySelectorAll('.theme-option');
const root = document.documentElement;
const THEME_KEY = 'aether-theme';

function setTheme(theme) {
  themeOptions.forEach(btn => btn.classList.remove('active'));
  document.querySelector(`.theme-option[data-theme="${theme}"]`).classList.add('active');
  root.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

themeOptions.forEach(btn => {
  btn.addEventListener('click', () => setTheme(btn.dataset.theme));
});

// Carregar tema salvo
const savedTheme = localStorage.getItem(THEME_KEY) || 'cosmic';
setTheme(savedTheme);

// =====================
// Particles Toggle
// =====================
const particlesToggle = document.getElementById('particles-toggle');
const particlesJSContainer = document.getElementById('particles-js');
const PARTICLES_KEY = 'aether-particles';

function setParticles(enabled) {
  if (enabled) {
    particlesJSContainer.style.display = 'block';
    if (typeof window.toggleParticles === 'function') {
      window.toggleParticles(true);
    }
  } else {
    particlesJSContainer.style.display = 'none';
    if (typeof window.toggleParticles === 'function') {
      window.toggleParticles(false);
    }
  }
  localStorage.setItem(PARTICLES_KEY, enabled ? '1' : '0');
}

if (particlesToggle) {
  particlesToggle.addEventListener('change', e => setParticles(e.target.checked));
  // Carregar preferência
  const savedParticles = localStorage.getItem(PARTICLES_KEY);
  setParticles(savedParticles !== '0');
  particlesToggle.checked = savedParticles !== '0';
}

// =====================
// Font Selector
// =====================
const fontSelector = document.getElementById('font-selector');
const FONT_KEY = 'aether-font';
if (fontSelector) {
  fontSelector.addEventListener('change', e => {
    document.body.style.fontFamily = `${e.target.value}, Poppins, Orbitron, Arial, sans-serif`;
    localStorage.setItem(FONT_KEY, e.target.value);
  });
  // Carregar preferência
  const savedFont = localStorage.getItem(FONT_KEY);
  if (savedFont) {
    fontSelector.value = savedFont;
    document.body.style.fontFamily = `${savedFont}, Poppins, Orbitron, Arial, sans-serif`;
  }
}

// =====================
// Modal Discord OAuth
// =====================
const discordModal = document.getElementById('discord-modal');
const discordConnectBtn = document.getElementById('discord-connect-btn');
const modalCloseBtn = document.querySelector('.modal-close');

if (discordConnectBtn) {
  discordConnectBtn.addEventListener('click', () => {
    // Scroll para a seção do Discord
    document.getElementById('discord').scrollIntoView({ behavior: 'smooth' });
  });
}

modalCloseBtn && modalCloseBtn.addEventListener('click', () => {
  discordModal.style.display = 'none';
});
window.addEventListener('click', (e) => {
  if (e.target === discordModal) discordModal.style.display = 'none';
});

// =====================
// Botão "Iniciar Conversa"
// =====================
const startChatBtn = document.getElementById('start-chat-btn');
if (startChatBtn) {
  startChatBtn.addEventListener('click', () => {
    document.getElementById('chat').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      document.getElementById('chat-input').focus();
    }, 1000);
  });
}

// =====================
// Botão de Login Discord (Seção Discord)
// =====================
const discordLoginBtn = document.getElementById('discord-login-btn');
if (discordLoginBtn) {
  discordLoginBtn.addEventListener('click', () => {
    // Abrir modal de login Discord
    if (discordModal) {
      discordModal.style.display = 'flex';
    }
  });
}

// =====================
// Botão de Call-to-Action Discord (Seção Chat)
// =====================
const ctaDiscordLoginBtn = document.getElementById('cta-discord-login');
if (ctaDiscordLoginBtn) {
  ctaDiscordLoginBtn.addEventListener('click', () => {
    // Abrir modal de login Discord
    if (discordModal) {
      discordModal.style.display = 'flex';
    }
  });
}

// =====================
// Placeholder para integração futura do chat e login
// =====================
// Aqui serão integrados: auth.js (login Discord), chat.js (chat IA) 