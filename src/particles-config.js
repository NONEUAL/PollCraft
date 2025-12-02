const particlesConfig = {
  background: {
    color: {
      value: "transparent", 
    },
  },
  fpsLimit: 60,
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: "repulse", 
      },
      resize: true,
    },
    modes: {
      repulse: {
        distance: 80,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: "#ff2e63", 
    },
    links: {
      color: "#ff2e63", 
      distance: 150,
      enable: true,
      opacity: 0.15,
      width: 1,
    },
    collisions: {
      enable: true,
    },
    move: {
      direction: "none",
      enable: true,
      outModes: {
        default: "bounce",
      },
      random: false,
      speed: 1, 
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 60, 
    },
    opacity: {
      value: 0.15,
    },
    shape: {
      type: "circle",
    },
    size: {
      value: { min: 1, max: 3 },
    },
  },
  detectRetina: true,
};

export default particlesConfig;