const depthOverlay = document.querySelector('.depth-overlay');
const soundToggle = document.getElementById('soundToggle');

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

window.addEventListener('scroll', () => {
  const progress = clamp(window.scrollY / (document.body.scrollHeight * 0.65), 0, 1);
  depthOverlay.style.opacity = (progress * 0.8).toFixed(3);
});

let audioCtx;
let oscillator;
let gainNode;
let lfo;
let lfoGain;

const startAmbient = async () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = 55;

    gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.0001;

    lfo = audioCtx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.08;

    lfoGain = audioCtx.createGain();
    lfoGain.gain.value = 8;

    lfo.connect(lfoGain);
    lfoGain.connect(oscillator.frequency);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    lfo.start();
  }

  if (audioCtx.state === 'suspended') {
    await audioCtx.resume();
  }

  gainNode.gain.cancelScheduledValues(audioCtx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.028, audioCtx.currentTime + 0.5);
};

const stopAmbient = () => {
  if (!audioCtx || !gainNode) {
    return;
  }

  gainNode.gain.cancelScheduledValues(audioCtx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.35);
};

let soundOn = false;

soundToggle.addEventListener('click', async () => {
  soundOn = !soundOn;

  if (soundOn) {
    await startAmbient();
    soundToggle.classList.add('active');
    soundToggle.setAttribute('aria-pressed', 'true');
    soundToggle.innerHTML = '<span class="dot"></span>Ambient Sound: On';
  } else {
    stopAmbient();
    soundToggle.classList.remove('active');
    soundToggle.setAttribute('aria-pressed', 'false');
    soundToggle.innerHTML = '<span class="dot"></span>Ambient Sound: Off';
  }
});
