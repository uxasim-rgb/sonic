/**
 * SonicFlow — Sound design, shipped as code.
 * 84 interaction sounds synthesized live with Web Audio.
 * https://github.com/uxasim-rgb/sonic-flow
 * MIT License
 */

let ctx, masterGain, globalVol = 0.7, globalPitch = 0, globalReverb = 0;
let convolver = null;

function initAudio() {
  if (ctx) return;
  ctx = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = ctx.createGain();
  masterGain.gain.value = globalVol;
  masterGain.connect(ctx.destination);
}

function now() { return ctx ? ctx.currentTime : 0; }

function freqShift(freq) {
  return freq * Math.pow(2, globalPitch / 12);
}

// ===== CORE SYNTHESIS =====

function playTone(freq, type, peak, atk, dcy, sus, rel, dur) {
  initAudio();
  const f = freqShift(freq);
  const t = now();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f, t);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(peak * globalVol, t + atk);
  g.gain.linearRampToValueAtTime(peak * globalVol * sus, t + atk + dcy);
  g.gain.linearRampToValueAtTime(0, t + atk + dcy + dur + rel);
  o.connect(g);
  g.connect(masterGain);
  o.start(t);
  o.stop(t + atk + dcy + dur + rel + 0.05);
}

function playNoise(peak, dur, lpFreq) {
  initAudio();
  const len = ctx.sampleRate * dur;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  const g = ctx.createGain();
  const flt = ctx.createBiquadFilter();
  flt.type = 'lowpass';
  flt.frequency.setValueAtTime(lpFreq, now());
  g.gain.setValueAtTime(peak * globalVol, now());
  g.gain.exponentialRampToValueAtTime(0.001, now() + dur);
  src.buffer = buf;
  src.connect(flt);
  flt.connect(g);
  g.connect(masterGain);
  src.start(now());
}

function playBandNoise(peak, dur, freq, Q) {
  initAudio();
  const len = ctx.sampleRate * dur;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  const g = ctx.createGain();
  const flt = ctx.createBiquadFilter();
  flt.type = 'bandpass';
  flt.frequency.setValueAtTime(freq, now());
  flt.Q.value = Q || 5;
  g.gain.setValueAtTime(peak * globalVol, now());
  g.gain.exponentialRampToValueAtTime(0.001, now() + dur);
  src.buffer = buf;
  src.connect(flt);
  flt.connect(g);
  g.connect(masterGain);
  src.start(now());
}

function playSweepNoise(peak, dur, startFreq, endFreq) {
  initAudio();
  const len = ctx.sampleRate * dur;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  const g = ctx.createGain();
  const flt = ctx.createBiquadFilter();
  flt.type = 'lowpass';
  flt.frequency.setValueAtTime(startFreq, now());
  flt.frequency.linearRampToValueAtTime(endFreq, now() + dur);
  g.gain.setValueAtTime(0, now());
  g.gain.linearRampToValueAtTime(peak * globalVol, now() + dur * 0.2);
  g.gain.linearRampToValueAtTime(0, now() + dur);
  src.buffer = buf;
  src.connect(flt);
  flt.connect(g);
  g.connect(masterGain);
  src.start(now());
}

// ===== SOUND DEFINITIONS =====

const sounds = {
  // Feedback
  'success': () => { [523.25, 659.25, 783.99].forEach((f, i) => setTimeout(() => playTone(f, 'sine', 0.18, 0.008, 0.04, 0.3, 0.15, 0.08), i * 55)); },
  'success-soft': () => { [523.25, 659.25].forEach((f, i) => setTimeout(() => playTone(f, 'sine', 0.1, 0.015, 0.06, 0.4, 0.2, 0.12), i * 70)); },
  'success-bright': () => { [880, 1108.73, 1318.51].forEach((f, i) => setTimeout(() => playTone(f, 'sine', 0.15, 0.005, 0.03, 0.2, 0.1, 0.06), i * 45)); },
  'error': () => {
    initAudio(); const t = now(); const o = ctx.createOscillator(); const g = ctx.createGain(); const f = ctx.createBiquadFilter();
    o.type = 'sawtooth'; o.frequency.setValueAtTime(180, t); o.frequency.linearRampToValueAtTime(126, t + 0.12);
    f.type = 'lowpass'; f.frequency.setValueAtTime(800, t); f.frequency.linearRampToValueAtTime(200, t + 0.18);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.12 * globalVol, t + 0.008); g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    o.connect(f); f.connect(g); g.connect(masterGain); o.start(t); o.stop(t + 0.25);
  },
  'error-soft': () => { playTone(200, 'sine', 0.08, 0.01, 0.04, 0.3, 0.15, 0.1); setTimeout(() => playTone(180, 'sine', 0.06, 0.01, 0.04, 0.2, 0.15, 0.1), 120); },
  'error-shake': () => { [200, 180, 160, 180].forEach((f, i) => setTimeout(() => playTone(f, 'sine', 0.06, 0.005, 0.02, 0.2, 0.05, 0.03), i * 40)); },
  'warning': () => {
    [0, 150].forEach(d => setTimeout(() => {
      initAudio(); const o = ctx.createOscillator(); const g = ctx.createGain(); const f = ctx.createBiquadFilter();
      o.type = 'square'; o.frequency.setValueAtTime(440, now()); f.type = 'lowpass'; f.frequency.setValueAtTime(2000, now());
      g.gain.setValueAtTime(0, now()); g.gain.linearRampToValueAtTime(0.08 * globalVol, now() + 0.01); g.gain.exponentialRampToValueAtTime(0.001, now() + 0.15);
      o.connect(f); f.connect(g); g.connect(masterGain); o.start(now()); o.stop(now() + 0.2);
    }, d));
  },
  'confirm': () => { playTone(523, 'sine', 0.22, 0.008, 0.02, 0.3, 0.08, 0.04); setTimeout(() => playTone(659, 'sine', 0.22, 0.008, 0.02, 0.3, 0.1, 0.06), 70); },
  'deny': () => { playTone(300, 'sawtooth', 0.15, 0.01, 0.02, 0.2, 0.1, 0.05); setTimeout(() => playTone(250, 'sawtooth', 0.12, 0.01, 0.02, 0.2, 0.1, 0.08), 100); },
  'complete': () => { [392, 523.25, 659.25, 783.99, 1046.5].forEach((f, i) => setTimeout(() => playTone(f, 'sine', 0.12, 0.006, 0.03, 0.3, 0.15, 0.06), i * 45)); },
  'cancel': () => { playTone(350, 'triangle', 0.1, 0.01, 0.03, 0.2, 0.12, 0.08); setTimeout(() => playTone(280, 'triangle', 0.08, 0.01, 0.03, 0.15, 0.12, 0.1), 100); },
  'undo': () => { playTone(600, 'sine', 0.1, 0.01, 0.02, 0.3, 0.1, 0.05); setTimeout(() => playTone(500, 'sine', 0.08, 0.01, 0.02, 0.2, 0.1, 0.05), 80); setTimeout(() => playTone(400, 'sine', 0.06, 0.01, 0.02, 0.15, 0.1, 0.05), 160); },
  'bloom': () => {
    initAudio(); const t = now();
    [261.63, 329.63, 392, 523.25].forEach((fr, i) => {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(freqShift(fr * 0.98), t); o.frequency.linearRampToValueAtTime(freqShift(fr), t + 0.15);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime([0.15, 0.12, 0.1, 0.08][i] * globalVol, t + 0.04 + i * 0.03);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.6 + i * 0.1);
      o.connect(g); g.connect(masterGain); o.start(t); o.stop(t + 1);
    });
  },
  'sparkle': () => {
    initAudio(); const t = now();
    [2093, 2637, 3136, 3520, 4186].forEach((fr, i) => {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(freqShift(fr), t + i * 0.04);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.1 * globalVol * (1 - i * 0.15), t + i * 0.04 + 0.005);
      g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.04 + 0.2);
      o.connect(g); g.connect(masterGain); o.start(t + i * 0.04); o.stop(t + i * 0.04 + 0.3);
    });
  },

  // Interaction
  'hover': () => {
    initAudio(); const t = now(); const o = ctx.createOscillator(); const g = ctx.createGain(); const f = ctx.createBiquadFilter();
    o.type = 'triangle'; o.frequency.setValueAtTime(freqShift(800), t); o.frequency.exponentialRampToValueAtTime(freqShift(1200), t + 0.02);
    f.type = 'highpass'; f.frequency.setValueAtTime(600, t);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.12 * globalVol, t + 0.005); g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    o.connect(f); f.connect(g); g.connect(masterGain); o.start(t); o.stop(t + 0.08);
  },
  'hover-soft': () => playTone(600, 'sine', 0.06, 0.008, 0.02, 0.2, 0.08, 0.03),
  'hover-sharp': () => playTone(1500, 'square', 0.04, 0.002, 0.01, 0.1, 0.03, 0.01),
  'click': () => {
    initAudio(); const t = now(); const len = ctx.sampleRate * 0.015;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate); const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.08));
    const src = ctx.createBufferSource(); const g = ctx.createGain(); const f = ctx.createBiquadFilter();
    f.type = 'bandpass'; f.frequency.setValueAtTime(2500, t); f.Q.value = 2;
    g.gain.setValueAtTime(0.35 * globalVol, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.015);
    src.buffer = buf; src.connect(f); f.connect(g); g.connect(masterGain); src.start(t);
  },
  'click-soft': () => playTone(800, 'sine', 0.08, 0.003, 0.01, 0.1, 0.05, 0.02),
  'click-mech': () => { playBandNoise(0.3, 0.02, 3000, 8); setTimeout(() => playBandNoise(0.15, 0.015, 1500, 6), 10); },
  'pop': () => playTone(400, 'sine', 0.3, 0.003, 0.01, 0.1, 0.05, 0.02),
  'pop-soft': () => playTone(350, 'sine', 0.15, 0.005, 0.015, 0.15, 0.08, 0.03),
  'toggle-on': () => playTone(600, 'sine', 0.2, 0.005, 0.02, 0.3, 0.1, 0.05),
  'toggle-off': () => playTone(450, 'sine', 0.15, 0.005, 0.02, 0.2, 0.08, 0.03),
  'press': () => sounds['click'](),
  'release': () => sounds['pop'](),
  'scroll': () => playSweepNoise(0.15, 0.08, 4000, 800),
  'scroll-up': () => playSweepNoise(0.12, 0.08, 800, 4000),
  'swipe': () => playSweepNoise(0.18, 0.1, 6000, 500),
  'swipe-back': () => playSweepNoise(0.15, 0.1, 500, 6000),
  'whoosh': () => playNoise(0.2, 0.12, 3000),
  'pluck': () => {
    const notes = [220, 293.66, 329.63, 440]; const fr = notes[Math.floor(Math.random() * notes.length)];
    initAudio(); const t = now(); const o = ctx.createOscillator(); const g = ctx.createGain(); const f = ctx.createBiquadFilter();
    o.type = 'triangle'; o.frequency.setValueAtTime(freqShift(fr), t);
    g.gain.setValueAtTime(0.22 * globalVol, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    f.type = 'lowpass'; f.frequency.setValueAtTime(3000, t); f.frequency.exponentialRampToValueAtTime(500, t + 0.25);
    o.connect(f); f.connect(g); g.connect(masterGain); o.start(t); o.stop(t + 0.3);
  },

  // Notification
  'notification': () => {
    initAudio(); const t = now(); const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(freqShift(587.33), t);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.18 * globalVol, t + 0.015);
    g.gain.setValueAtTime(0.18 * globalVol, t + 0.12); g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    o.connect(g); g.connect(masterGain); o.start(t); o.stop(t + 0.4);
  },
  'notify-soft': () => playTone(523, 'sine', 0.1, 0.01, 0.03, 0.4, 0.2, 0.1),
  'bell': () => {
    initAudio(); const t = now();
    [1, 2.7, 5.4, 8.1].forEach((h, i) => {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(freqShift(880 * h), t);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime([0.4, 0.2, 0.1, 0.05][i] * globalVol, t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.001, t + 1.2 + i * 0.25);
      o.connect(g); g.connect(masterGain); o.start(t); o.stop(t + 2.5);
    });
  },
  'chime': () => sounds['bell'](),
  'ping': () => playTone(1760, 'sine', 0.5, 0.003, 0.015, 0.1, 0.08, 0.02),
  'ping-soft': () => playTone(1200, 'sine', 0.2, 0.005, 0.02, 0.2, 0.15, 0.05),
  'message': () => { playTone(587, 'sine', 0.15, 0.008, 0.02, 0.3, 0.15, 0.06); setTimeout(() => playTone(784, 'sine', 0.12, 0.008, 0.02, 0.2, 0.15, 0.06), 80); },
  'mention': () => { playTone(880, 'sine', 0.12, 0.005, 0.015, 0.2, 0.1, 0.04); setTimeout(() => playTone(1108, 'sine', 0.1, 0.005, 0.015, 0.15, 0.1, 0.04), 60); setTimeout(() => playTone(1320, 'sine', 0.08, 0.005, 0.015, 0.1, 0.1, 0.04), 120); },
  'alert': () => sounds['warning'](),
  'call': () => { [0, 400, 800].forEach(d => setTimeout(() => playTone(800, 'sine', 0.25, 0.01, 0.04, 0.3, 0.1, 0.1), d)); },
  'hangup': () => playTone(400, 'sine', 0.15, 0.01, 0.04, 0.3, 0.2, 0.1),
  'reminder': () => playTone(523, 'sine', 0.1, 0.01, 0.03, 0.4, 0.2, 0.15),

  // System
  'unlock': () => { [392, 523.25, 659.25, 783.99].forEach((f, i) => setTimeout(() => playTone(f, 'sine', 0.12, 0.008, 0.015, 0.3, 0.15, 0.04), i * 35)); },
  'lock': () => { playTone(783.99, 'sine', 0.1, 0.008, 0.015, 0.2, 0.15, 0.04); setTimeout(() => playTone(659.25, 'sine', 0.08, 0.008, 0.015, 0.15, 0.15, 0.04), 50); setTimeout(() => playTone(523.25, 'sine', 0.06, 0.008, 0.015, 0.1, 0.15, 0.04), 100); },
  'open': () => playTone(400, 'sine', 0.35, 0.01, 0.02, 0.5, 0.1, 0.05),
  'close': () => playTone(500, 'sine', 0.25, 0.01, 0.02, 0.3, 0.08, 0.03),
  'save': () => { playTone(440, 'sine', 0.25, 0.005, 0.02, 0.3, 0.1, 0.02); setTimeout(() => playTone(554, 'sine', 0.25, 0.005, 0.02, 0.3, 0.1, 0.02), 60); setTimeout(() => playTone(659, 'sine', 0.25, 0.01, 0.02, 0.3, 0.1, 0.05), 120); },
  'delete': () => { playTone(200, 'sawtooth', 0.2, 0.005, 0.02, 0.2, 0.1, 0.02); setTimeout(() => playTone(150, 'sawtooth', 0.15, 0.01, 0.02, 0.15, 0.1, 0.05), 60); },
  'trash': () => { playNoise(0.15, 0.15, 600); setTimeout(() => playNoise(0.1, 0.1, 300), 80); },
  'refresh': () => playSweepNoise(0.2, 0.1, 5000, 800),
  'load': () => playNoise(0.15, 0.1, 2500),
  'loading': () => { [0, 100, 200].forEach((d, i) => setTimeout(() => playTone(600 + i * 100, 'sine', 0.06, 0.005, 0.01, 0.1, 0.05, 0.02), d)); },
  'search': () => sounds['typing'](),
  'send': () => { playTone(600, 'sine', 0.15, 0.01, 0.02, 0.3, 0.1, 0.05); setTimeout(() => playTone(900, 'sine', 0.1, 0.005, 0.02, 0.2, 0.1, 0.03), 60); },
  'receive': () => { playTone(900, 'sine', 0.1, 0.005, 0.02, 0.2, 0.1, 0.03); setTimeout(() => playTone(600, 'sine', 0.15, 0.01, 0.02, 0.3, 0.1, 0.05), 60); },
  'download': () => { playTone(400, 'sine', 0.1, 0.01, 0.02, 0.3, 0.1, 0.05); setTimeout(() => playTone(500, 'sine', 0.1, 0.01, 0.02, 0.3, 0.1, 0.05), 80); setTimeout(() => playTone(600, 'sine', 0.12, 0.01, 0.02, 0.3, 0.1, 0.08), 160); },

  // Form
  'typing': () => { const fr = [800, 1000, 1200, 900, 1100][Math.floor(Math.random() * 5)]; playTone(fr, 'sine', 0.08, 0.002, 0.008, 0.1, 0.02, 0.01); },
  'backspace': () => playTone(300, 'sawtooth', 0.06, 0.003, 0.01, 0.1, 0.03, 0.02),
  'enter': () => playTone(500, 'sine', 0.15, 0.005, 0.015, 0.3, 0.08, 0.03),
  'tab': () => playTone(700, 'sine', 0.08, 0.003, 0.01, 0.2, 0.05, 0.02),
  'select-all': () => { playTone(600, 'sine', 0.1, 0.005, 0.01, 0.15, 0.05, 0.02); setTimeout(() => playTone(800, 'sine', 0.08, 0.005, 0.01, 0.1, 0.05, 0.02), 40); },
  'copy': () => playTone(880, 'sine', 0.1, 0.003, 0.01, 0.2, 0.05, 0.02),
  'paste': () => { playTone(660, 'sine', 0.1, 0.003, 0.01, 0.2, 0.05, 0.02); setTimeout(() => playTone(880, 'sine', 0.08, 0.003, 0.01, 0.15, 0.05, 0.02), 50); },
  'focus': () => playTone(1000, 'sine', 0.06, 0.005, 0.01, 0.15, 0.05, 0.02),
  'blur': () => playTone(800, 'sine', 0.04, 0.005, 0.01, 0.1, 0.05, 0.02),
  'validate': () => { playTone(440, 'sine', 0.08, 0.003, 0.01, 0.2, 0.05, 0.02); setTimeout(() => playTone(554, 'sine', 0.06, 0.003, 0.01, 0.15, 0.05, 0.02), 40); },

  // Media
  'play': () => playTone(600, 'sine', 0.3, 0.005, 0.02, 0.3, 0.08, 0.02),
  'pause': () => playTone(500, 'sine', 0.25, 0.005, 0.02, 0.2, 0.05, 0.02),
  'stop': () => playTone(400, 'square', 0.2, 0.005, 0.02, 0.2, 0.05, 0.02),
  'skip': () => playSweepNoise(0.25, 0.08, 6000, 1000),
  'skip-back': () => playSweepNoise(0.2, 0.08, 1000, 6000),
  'vol-up': () => { playTone(800, 'sine', 0.12, 0.005, 0.01, 0.2, 0.05, 0.02); setTimeout(() => playTone(1000, 'sine', 0.1, 0.005, 0.01, 0.15, 0.05, 0.02), 50); },
  'vol-down': () => { playTone(1000, 'sine', 0.1, 0.005, 0.01, 0.15, 0.05, 0.02); setTimeout(() => playTone(800, 'sine', 0.08, 0.005, 0.01, 0.1, 0.05, 0.02), 50); },
  'mute': () => playTone(600, 'sine', 0.1, 0.005, 0.01, 0.1, 0.05, 0.02),
  'unmute': () => playTone(600, 'sine', 0.15, 0.005, 0.02, 0.3, 0.08, 0.03),
  'record': () => playTone(1000, 'sine', 0.3, 0.005, 0.02, 0.2, 0.1, 0.05),

  // Gesture
  'pinch': () => { playTone(400, 'sine', 0.08, 0.005, 0.01, 0.1, 0.03, 0.02); setTimeout(() => playTone(300, 'sine', 0.06, 0.005, 0.01, 0.08, 0.03, 0.02), 60); },
  'zoom': () => { playTone(300, 'sine', 0.06, 0.005, 0.01, 0.08, 0.03, 0.02); setTimeout(() => playTone(400, 'sine', 0.08, 0.005, 0.01, 0.1, 0.03, 0.02), 60); },
  'pull': () => playSweepNoise(0.15, 0.12, 2000, 4000),
  'drop': () => playTone(200, 'sine', 0.2, 0.01, 0.02, 0.3, 0.1, 0.05),
  'drag': () => playNoise(0.08, 0.15, 1500),
  'drop-zone': () => { playTone(350, 'sine', 0.15, 0.01, 0.02, 0.3, 0.1, 0.05); setTimeout(() => playTone(500, 'sine', 0.12, 0.01, 0.02, 0.2, 0.1, 0.05), 80); },
};

// ===== PUBLIC API =====

/**
 * Play a sound by name.
 * @param {string} name - Sound name (e.g. "success", "click", "hover")
 * @param {object} [options] - { volume?: number }
 */
export function play(name, options) {
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const fn = sounds[name];
  if (!fn) { console.warn(`[sonic-flow] Unknown sound: "${name}"`); return; }
  const prevVol = globalVol;
  if (options && typeof options.volume === 'number') {
    globalVol = options.volume;
  }
  fn();
  if (options && typeof options.volume === 'number') {
    globalVol = prevVol;
  }
}

/**
 * Set the global master volume.
 * @param {number} value - 0 to 1
 */
export function setVolume(value) {
  globalVol = Math.max(0, Math.min(1, value));
  if (masterGain) masterGain.gain.setTargetAtTime(globalVol, ctx.currentTime, 0.05);
}

/**
 * Shift all sounds up or down in pitch.
 * @param {number} semitones - Positive = up, negative = down
 */
export function setPitch(semitones) {
  globalPitch = semitones;
}

/**
 * Set global reverb amount (0–1). Currently a placeholder for future enhancement.
 * @param {number} amount - 0 to 1
 */
export function setReverb(amount) {
  globalReverb = Math.max(0, Math.min(1, amount));
}

/**
 * Get list of all available sound names.
 * @returns {string[]}
 */
export function getSounds() {
  return Object.keys(sounds);
}

/**
 * Auto-wire all elements with data-sf-* attributes.
 * @param {object} [options] - { volume?: number, hover?: boolean }
 */
export function bind(options) {
  if (options && typeof options.volume === 'number') setVolume(options.volume);

  // data-sf-hover
  document.querySelectorAll('[data-sf-hover]').forEach(el => {
    const soundName = el.getAttribute('data-sf-hover') || 'hover';
    el.addEventListener('mouseenter', () => play(soundName));
    el.addEventListener('touchstart', () => play(soundName), { passive: true });
  });

  // data-sf-press
  document.querySelectorAll('[data-sf-press]').forEach(el => {
    const soundName = el.getAttribute('data-sf-press') || 'press';
    el.addEventListener('mousedown', () => play(soundName));
    el.addEventListener('touchstart', () => play(soundName), { passive: true });
  });

  // data-sf-release
  document.querySelectorAll('[data-sf-release]').forEach(el => {
    const soundName = el.getAttribute('data-sf-release') || 'release';
    el.addEventListener('mouseup', () => play(soundName));
    el.addEventListener('touchend', () => play(soundName), { passive: true });
  });

  // data-sf-toggle
  document.querySelectorAll('[data-sf-toggle]').forEach(el => {
    let state = false;
    el.addEventListener('click', () => {
      state = !state;
      play(state ? 'toggle-on' : 'toggle-off');
    });
  });

  // data-sf-focus
  document.querySelectorAll('[data-sf-focus]').forEach(el => {
    el.addEventListener('focus', () => play('focus'));
  });

  // data-sf-blur
  document.querySelectorAll('[data-sf-blur]').forEach(el => {
    el.addEventListener('blur', () => play('blur'));
  });

  // data-sf (generic click-to-play)
  document.querySelectorAll('[data-sf]').forEach(el => {
    const soundName = el.getAttribute('data-sf');
    if (soundName) el.addEventListener('click', () => play(soundName));
  });
}

// UMD / global fallback for script tag usage
if (typeof window !== 'undefined') {
  window.SonicFlow = { play, bind, setVolume, setPitch, setReverb, getSounds };
}

export default { play, bind, setVolume, setPitch, setReverb, getSounds };
