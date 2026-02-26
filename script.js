const revealElements = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  },
  { threshold: 0.12 }
);
revealElements.forEach((item) => observer.observe(item));

const particleLayer = document.getElementById('particle-layer');
if (particleLayer) {
  const particleCount = window.innerWidth < 768 ? 24 : 48;
  for (let i = 0; i < particleCount; i += 1) {
    const node = document.createElement('span');
    node.className = 'particle';
    node.style.left = `${Math.random() * 100}%`;
    node.style.bottom = `${-Math.random() * 100}px`;
    node.style.animationDuration = `${6 + Math.random() * 12}s`;
    node.style.animationDelay = `${Math.random() * 8}s`;
    particleLayer.appendChild(node);
  }
}

let audioContext;
let oscillator;
let gainNode;

function stopAmbient() {
  if (oscillator) {
    oscillator.stop();
    oscillator.disconnect();
    gainNode.disconnect();
    oscillator = null;
  }
}

function playAmbient() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  oscillator = audioContext.createOscillator();
  gainNode = audioContext.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.value = 42;
  gainNode.gain.value = 0.01;
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.start();
}

const soundToggle = document.getElementById('sound-toggle');
if (soundToggle) {
  soundToggle.addEventListener('click', async () => {
    const enabled = soundToggle.getAttribute('aria-pressed') === 'true';
    if (enabled) {
      stopAmbient();
      soundToggle.setAttribute('aria-pressed', 'false');
      soundToggle.textContent = '🔊 Ocean Ambience';
      return;
    }

    try {
      playAmbient();
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      soundToggle.setAttribute('aria-pressed', 'true');
      soundToggle.textContent = '🔈 Ambience Active';
    } catch (error) {
      soundToggle.textContent = '🔇 Audio Unavailable';
    }
  });
}
