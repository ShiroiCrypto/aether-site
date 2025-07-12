/* =====================
   Particles Configuration
   Sistema de Temas Integrado
   ===================== */

// Configurações base das partículas
const baseConfig = {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800
      }
    },
    color: {
      value: "#00D4FF"
    },
    shape: {
      type: "circle",
      stroke: {
        width: 0,
        color: "#000000"
      }
    },
    opacity: {
      value: 0.5,
      random: false,
      anim: {
        enable: false,
        speed: 1,
        opacity_min: 0.1,
        sync: false
      }
    },
    size: {
      value: 3,
      random: true,
      anim: {
        enable: false,
        speed: 40,
        size_min: 0.1,
        sync: false
      }
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#00D4FF",
      opacity: 0.4,
      width: 1
    },
    move: {
      enable: true,
      speed: 6,
      direction: "none",
      random: false,
      straight: false,
      out_mode: "out",
      bounce: false,
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 1200
      }
    }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: {
        enable: true,
        mode: "repulse"
      },
      onclick: {
        enable: true,
        mode: "push"
      },
      resize: true
    },
    modes: {
      grab: {
        distance: 400,
        line_linked: {
          opacity: 1
        }
      },
      bubble: {
        distance: 400,
        size: 40,
        duration: 2,
        opacity: 8,
        speed: 3
      },
      repulse: {
        distance: 200,
        duration: 0.4
      },
      push: {
        particles_nb: 4
      },
      remove: {
        particles_nb: 2
      }
    }
  },
  retina_detect: true
};

// Configurações específicas por tema
const themeConfigs = {
  cosmic: {
    particles: {
      color: { value: "#00D4FF" },
      line_linked: { color: "#00D4FF" }
    }
  },
  neon: {
    particles: {
      color: { value: "#00FF88" },
      line_linked: { color: "#00FF88" }
    }
  },
  crystal: {
    particles: {
      color: { value: "#64B5F6" },
      line_linked: { color: "#64B5F6" }
    }
  },
  dark: {
    particles: {
      color: { value: "#BB86FC" },
      line_linked: { color: "#BB86FC" }
    }
  }
};

// Função para obter configuração baseada no tema atual
function getParticlesConfig(theme = 'cosmic') {
  const config = JSON.parse(JSON.stringify(baseConfig));
  const themeConfig = themeConfigs[theme] || themeConfigs.cosmic;
  
  // Aplicar configurações do tema
  Object.assign(config.particles, themeConfig.particles);
  
  return config;
}

// Função para inicializar partículas
function initParticles(theme = 'cosmic') {
  if (typeof particlesJS !== 'undefined') {
    const config = getParticlesConfig(theme);
    particlesJS('particles-js', config);
  }
}

// Função para atualizar partículas com novo tema
function updateParticlesTheme(theme) {
  if (typeof pJSDom !== 'undefined' && pJSDom.length > 0) {
    const config = getParticlesConfig(theme);
    pJSDom[0].pJS.pJS.fn.particlesRefresh();
    
    // Atualizar cores das partículas
    pJSDom[0].pJS.pJS.particles.array.forEach(particle => {
      particle.color.value = config.particles.color.value;
    });
    
    // Atualizar linhas
    pJSDom[0].pJS.pJS.fn.particlesDraw();
  }
}

// Função para pausar/retomar partículas
function toggleParticles(enabled) {
  if (typeof pJSDom !== 'undefined' && pJSDom.length > 0) {
    if (enabled) {
      pJSDom[0].pJS.pJS.fn.particlesStart();
    } else {
      pJSDom[0].pJS.pJS.fn.particlesStop();
    }
  }
}

// Função para ajustar densidade das partículas baseada no dispositivo
function adjustParticlesForDevice() {
  const isMobile = window.innerWidth <= 768;
  const isSmallMobile = window.innerWidth <= 480;
  
  if (isSmallMobile) {
    baseConfig.particles.number.value = 30;
    baseConfig.particles.move.speed = 3;
  } else if (isMobile) {
    baseConfig.particles.number.value = 50;
    baseConfig.particles.move.speed = 4;
  } else {
    baseConfig.particles.number.value = 80;
    baseConfig.particles.move.speed = 6;
  }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  adjustParticlesForDevice();
  
  // Aguardar um pouco para garantir que particles.js carregou
  setTimeout(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'cosmic';
    initParticles(currentTheme);
  }, 100);
});

// Escutar mudanças de tema
window.addEventListener('themeChanged', function(e) {
  updateParticlesTheme(e.detail.theme);
});

// Escutar mudanças de tamanho da tela
window.addEventListener('resize', function() {
  adjustParticlesForDevice();
  
  // Reinicializar partículas se necessário
  if (typeof pJSDom !== 'undefined' && pJSDom.length > 0) {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'cosmic';
    updateParticlesTheme(currentTheme);
  }
});

// Exportar funções para uso global
window.particlesConfig = {
  initParticles,
  updateParticlesTheme,
  toggleParticles,
  adjustParticlesForDevice
}; 