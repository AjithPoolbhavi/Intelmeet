// Premium Animation System
export const animations = {
  // Durations
  duration: {
    fast: 150,
    base: 200,
    normal: 300,
    slow: 500,
    slower: 700,
    slowest: 1000,
  },

  // Easing functions
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeInQuad: 'cubic-bezier(0.11, 0, 0.5, 0)',
    easeOutQuad: 'cubic-bezier(0.5, 1, 0.89, 1)',
    easeInCubic: 'cubic-bezier(0.32, 0, 0.67, 0)',
    easeOutCubic: 'cubic-bezier(0.33, 1, 0.68, 1)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },

  // Transition presets
  transitions: {
    fast: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: 'all 500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Keyframes for CSS animations
  keyframes: {
    fadeIn: `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `,
    fadeOut: `
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
    `,
    slideInUp: `
      @keyframes slideInUp {
        from { 
          opacity: 0; 
          transform: translateY(20px); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0); 
        }
      }
    `,
    slideInDown: `
      @keyframes slideInDown {
        from { 
          opacity: 0; 
          transform: translateY(-20px); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0); 
        }
      }
    `,
    slideInLeft: `
      @keyframes slideInLeft {
        from { 
          opacity: 0; 
          transform: translateX(-20px); 
        }
        to { 
          opacity: 1; 
          transform: translateX(0); 
        }
      }
    `,
    slideInRight: `
      @keyframes slideInRight {
        from { 
          opacity: 0; 
          transform: translateX(20px); 
        }
        to { 
          opacity: 1; 
          transform: translateX(0); 
        }
      }
    `,
    scaleIn: `
      @keyframes scaleIn {
        from { 
          opacity: 0; 
          transform: scale(0.95); 
        }
        to { 
          opacity: 1; 
          transform: scale(1); 
        }
      }
    `,
    pulse: `
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `,
    bounce: `
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
    `,
    shimmer: `
      @keyframes shimmer {
        0% { background-position: -1000px 0; }
        100% { background-position: 1000px 0; }
      }
    `,
    spin: `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `,
    glow: `
      @keyframes glow {
        0%, 100% { opacity: 1; box-shadow: 0 0 5px rgba(139, 92, 246, 0.5); }
        50% { opacity: 0.8; box-shadow: 0 0 20px rgba(139, 92, 246, 0.8); }
      }
    `,
  },
};

export default animations;
