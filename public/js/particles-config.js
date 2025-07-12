// =====================
// Particles Configuration
// =====================
document.addEventListener('DOMContentLoaded', () => {
  // Configuração das partículas
  const particlesConfig = {
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: ["#00D4FF", "#8A2BE2", "#FFFFFF"]
      },
      shape: {
        type: "circle",
        stroke: {
          width: 0,
          color: "#000000"
        },
        polygon: {
          nb_sides: 5
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

  // Inicializar partículas se o container existir
  const particlesContainer = document.getElementById('particles-js');
  if (particlesContainer && typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', particlesConfig, function() {
      console.log('🌌 Partículas cósmicas carregadas');
    });
  }
});

// =====================
// Função para controlar partículas
// =====================
window.toggleParticles = function(enabled) {
  const particlesContainer = document.getElementById('particles-js');
  if (particlesContainer) {
    if (enabled) {
      particlesContainer.style.display = 'block';
      if (typeof pJSDom !== 'undefined' && pJSDom.length > 0) {
        pJSDom[0].pJS.pJS.fn.particlesRefresh();
      }
    } else {
      particlesContainer.style.display = 'none';
    }
  }
};

// =====================
// Função para recarregar partículas
// =====================
window.reloadParticles = function() {
  const particlesContainer = document.getElementById('particles-js');
  if (particlesContainer && typeof particlesJS !== 'undefined') {
    // Limpar partículas existentes
    if (typeof pJSDom !== 'undefined' && pJSDom.length > 0) {
      pJSDom[0].pJS.pJS.fn.particlesEmpty();
    }
    
    // Recarregar configuração
    const particlesConfig = {
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: ["#00D4FF", "#8A2BE2", "#FFFFFF"]
        },
        shape: {
          type: "circle"
        },
        opacity: {
          value: 0.5,
          random: false
        },
        size: {
          value: 3,
          random: true
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
          bounce: false
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
          repulse: {
            distance: 200,
            duration: 0.4
          },
          push: {
            particles_nb: 4
          }
        }
      },
      retina_detect: true
    };
    
    particlesJS('particles-js', particlesConfig);
  }
}; 