/**
 * SonicFlow — Sound design, shipped as code.
 * 210 interaction sounds synthesized live with Web Audio.
 * https://github.com/uxasim-rgb/sonic-flow
 * MIT License
 */

let ctx, masterGain, globalVol = 0.7, globalPitch = 0;

function initAudio() {
  if (ctx) return;
  ctx = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = ctx.createGain();
  masterGain.gain.value = globalVol;
  masterGain.connect(ctx.destination);
}
function now() { return ctx ? ctx.currentTime : 0; }
function fs(f) { return f * Math.pow(2, globalPitch / 12); }

// ===== CORE SYNTHESIS HELPERS =====
function tone(freq, type, peak, atk, dcy, sus, rel, dur) {
  initAudio(); const f = fs(freq), t = now(), o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(f, t);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(peak * globalVol, t + atk);
  g.gain.linearRampToValueAtTime(peak * globalVol * sus, t + atk + dcy);
  g.gain.linearRampToValueAtTime(0, t + atk + dcy + dur + rel);
  o.connect(g); g.connect(masterGain); o.start(t); o.stop(t + atk + dcy + dur + rel + .05);
}
function noise(peak, dur, lp) {
  initAudio(); const len = ctx.sampleRate * dur, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const s = ctx.createBufferSource(), g = ctx.createGain(), f = ctx.createBiquadFilter();
  f.type = 'lowpass'; f.frequency.setValueAtTime(lp, now());
  g.gain.setValueAtTime(peak * globalVol, now()); g.gain.exponentialRampToValueAtTime(.001, now() + dur);
  s.buffer = buf; s.connect(f); f.connect(g); g.connect(masterGain); s.start(now());
}
function bandNoise(peak, dur, freq, Q) {
  initAudio(); const len = ctx.sampleRate * dur, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const s = ctx.createBufferSource(), g = ctx.createGain(), f = ctx.createBiquadFilter();
  f.type = 'bandpass'; f.frequency.setValueAtTime(freq, now()); f.Q.value = Q || 5;
  g.gain.setValueAtTime(peak * globalVol, now()); g.gain.exponentialRampToValueAtTime(.001, now() + dur);
  s.buffer = buf; s.connect(f); f.connect(g); g.connect(masterGain); s.start(now());
}
function sweep(peak, dur, sf, ef) {
  initAudio(); const len = ctx.sampleRate * dur, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const s = ctx.createBufferSource(), g = ctx.createGain(), f = ctx.createBiquadFilter();
  f.type = 'lowpass'; f.frequency.setValueAtTime(sf, now()); f.frequency.linearRampToValueAtTime(ef, now() + dur);
  g.gain.setValueAtTime(0, now()); g.gain.linearRampToValueAtTime(peak * globalVol, now() + dur * .2);
  g.gain.linearRampToValueAtTime(0, now() + dur);
  s.buffer = buf; s.connect(f); f.connect(g); g.connect(masterGain); s.start(now());
}
function chord(notes, type, peak, atk, dcy, sus, rel, dur, gap) {
  notes.forEach((f, i) => setTimeout(() => tone(f, type, peak * (1 - i * .04), atk, dcy, sus, rel, dur), i * (gap || 50)));
}
function descend(notes, type, peak, atk, dcy, sus, rel, dur, gap) {
  notes.forEach((f, i) => setTimeout(() => tone(f, type, peak * (1 - i * .06), atk, dcy, sus, rel, dur), i * (gap || 50)));
}
function click() {
  initAudio(); const t = now(), len = ctx.sampleRate * .015, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * .08));
  const s = ctx.createBufferSource(), g = ctx.createGain(), f = ctx.createBiquadFilter();
  f.type = 'bandpass'; f.frequency.setValueAtTime(2500, t); f.Q.value = 2;
  g.gain.setValueAtTime(.35 * globalVol, t); g.gain.exponentialRampToValueAtTime(.001, t + .015);
  s.buffer = buf; s.connect(f); f.connect(g); g.connect(masterGain); s.start(t);
}

// ===== 210 SOUND DEFINITIONS =====
const sounds = {

  // ── FEEDBACK (20) ──
  'success':         () => chord([523.25, 659.25, 783.99], 'sine', .18, .008, .04, .3, .15, .08, 55),
  'success-soft':    () => chord([523.25, 659.25], 'sine', .1, .015, .06, .4, .2, .12, 70),
  'success-bright':  () => chord([880, 1108.73, 1318.51], 'sine', .15, .005, .03, .2, .1, .06, 45),
  'error':           () => { initAudio(); const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),f=ctx.createBiquadFilter();o.type='sawtooth';o.frequency.setValueAtTime(180,t);o.frequency.linearRampToValueAtTime(126,t+.12);f.type='lowpass';f.frequency.setValueAtTime(800,t);f.frequency.linearRampToValueAtTime(200,t+.18);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.12*globalVol,t+.008);g.gain.exponentialRampToValueAtTime(.001,t+.2);o.connect(f);f.connect(g);g.connect(masterGain);o.start(t);o.stop(t+.25); },
  'error-soft':      () => { tone(200,'sine',.08,.01,.04,.3,.15,.1); setTimeout(()=>tone(180,'sine',.06,.01,.04,.2,.15,.1),120); },
  'error-shake':     () => [200,180,160,180].forEach((f,i)=>setTimeout(()=>tone(f,'sine',.06,.005,.02,.2,.05,.03),i*40)),
  'warning':         () => { [0,150].forEach(d=>setTimeout(()=>{initAudio();const o=ctx.createOscillator(),g=ctx.createGain(),f=ctx.createBiquadFilter();o.type='square';o.frequency.setValueAtTime(440,now());f.type='lowpass';f.frequency.setValueAtTime(2000,now());g.gain.setValueAtTime(0,now());g.gain.linearRampToValueAtTime(.08*globalVol,now()+.01);g.gain.exponentialRampToValueAtTime(.001,now()+.15);o.connect(f);f.connect(g);g.connect(masterGain);o.start(now());o.stop(now()+.2)},d)); },
  'confirm':         () => { tone(523,'sine',.22,.008,.02,.3,.08,.04); setTimeout(()=>tone(659,'sine',.22,.008,.02,.3,.1,.06),70); },
  'deny':            () => { tone(300,'sawtooth',.15,.01,.02,.2,.1,.05); setTimeout(()=>tone(250,'sawtooth',.12,.01,.02,.2,.1,.08),100); },
  'complete':        () => chord([392,523.25,659.25,783.99,1046.5],'sine',.12,.006,.03,.3,.15,.06,45),
  'cancel':          () => { tone(350,'triangle',.1,.01,.03,.2,.12,.08); setTimeout(()=>tone(280,'triangle',.08,.01,.03,.15,.12,.1),100); },
  'undo':            () => descend([600,500,400],'sine',.1,.01,.02,.3,.1,.05,80),
  'bloom':           () => { initAudio();const t=now();[261.63,329.63,392,523.25].forEach((fr,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(fs(fr*.98),t);o.frequency.linearRampToValueAtTime(fs(fr),t+.15);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime([.15,.12,.1,.08][i]*globalVol,t+.04+i*.03);g.gain.exponentialRampToValueAtTime(.001,t+.6+i*.1);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+1)}); },
  'sparkle':         () => { initAudio();const t=now();[2093,2637,3136,3520,4186].forEach((fr,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(fs(fr),t+i*.04);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.1*globalVol*(1-i*.15),t+i*.04+.005);g.gain.exponentialRampToValueAtTime(.001,t+i*.04+.2);o.connect(g);g.connect(masterGain);o.start(t+i*.04);o.stop(t+i*.04+.3)}); },
  'info':            () => tone(880,'sine',.1,.01,.03,.3,.12,.06),
  'tip':             () => { tone(1200,'sine',.08,.005,.02,.2,.1,.04); setTimeout(()=>tone(1400,'sine',.06,.005,.02,.15,.1,.04),50); },
  'celebrate':       () => chord([523,659,784,1047,1319],'sine',.14,.005,.025,.25,.12,.05,40),
  'milestone':       () => chord([392,523,659,784],'sine',.16,.008,.04,.35,.2,.1,60),
  'progress':        () => tone(700,'sine',.1,.005,.015,.2,.08,.03),
  'achievement':     () => chord([523,659,784,1047],'sine',.18,.006,.03,.3,.18,.08,50),

  // ── INTERACTION (24) ──
  'hover':           () => { initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),f=ctx.createBiquadFilter();o.type='triangle';o.frequency.setValueAtTime(fs(800),t);o.frequency.exponentialRampToValueAtTime(fs(1200),t+.02);f.type='highpass';f.frequency.setValueAtTime(600,t);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.12*globalVol,t+.005);g.gain.exponentialRampToValueAtTime(.001,t+.05);o.connect(f);f.connect(g);g.connect(masterGain);o.start(t);o.stop(t+.08); },
  'hover-soft':      () => tone(600,'sine',.06,.008,.02,.2,.08,.03),
  'hover-sharp':     () => tone(1500,'square',.04,.002,.01,.1,.03,.01),
  'click':           click,
  'click-soft':      () => tone(800,'sine',.08,.003,.01,.1,.05,.02),
  'click-mech':      () => { bandNoise(.3,.02,3000,8); setTimeout(()=>bandNoise(.15,.015,1500,6),10); },
  'pop':             () => tone(400,'sine',.3,.003,.01,.1,.05,.02),
  'pop-soft':        () => tone(350,'sine',.15,.005,.015,.15,.08,.03),
  'toggle-on':       () => tone(600,'sine',.2,.005,.02,.3,.1,.05),
  'toggle-off':      () => tone(450,'sine',.15,.005,.02,.2,.08,.03),
  'press':           click,
  'release':         () => tone(400,'sine',.3,.003,.01,.1,.05,.02),
  'scroll':          () => sweep(.15,.08,4000,800),
  'scroll-up':       () => sweep(.12,.08,800,4000),
  'swipe':           () => sweep(.18,.1,6000,500),
  'swipe-back':      () => sweep(.15,.1,500,6000),
  'whoosh':          () => noise(.2,.12,3000),
  'pluck':           () => { const ns=[220,293.66,329.63,440],fr=ns[Math.floor(Math.random()*ns.length)];initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),f=ctx.createBiquadFilter();o.type='triangle';o.frequency.setValueAtTime(fs(fr),t);g.gain.setValueAtTime(.22*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+.25);f.type='lowpass';f.frequency.setValueAtTime(3000,t);f.frequency.exponentialRampToValueAtTime(500,t+.25);o.connect(f);f.connect(g);g.connect(masterGain);o.start(t);o.stop(t+.3); },
  'long-press':      () => { click(); setTimeout(()=>tone(500,'sine',.12,.01,.02,.3,.1,.08),100); },
  'double-tap':      () => { click(); setTimeout(click,80); },
  'ripple':          () => { tone(800,'sine',.08,.003,.01,.1,.06,.03); setTimeout(()=>tone(600,'sine',.06,.005,.02,.15,.08,.04),40); setTimeout(()=>tone(400,'sine',.04,.008,.03,.2,.1,.05),100); },
  'bounce':          () => { tone(300,'sine',.2,.003,.01,.1,.04,.02); setTimeout(()=>tone(400,'sine',.12,.003,.01,.08,.04,.02),60); setTimeout(()=>tone(350,'sine',.06,.003,.01,.06,.04,.02),100); },
  'snap':            () => bandNoise(.4,.01,4000,12),
  'slide':           () => sweep(.12,.15,800,2000),

  // ── NOTIFICATION (16) ──
  'notification':    () => { initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(fs(587.33),t);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.18*globalVol,t+.015);g.gain.setValueAtTime(.18*globalVol,t+.12);g.gain.exponentialRampToValueAtTime(.001,t+.35);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+.4); },
  'notify-soft':     () => tone(523,'sine',.1,.01,.03,.4,.2,.1),
  'bell':            () => { initAudio();const t=now();[1,2.7,5.4,8.1].forEach((h,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(fs(880*h),t);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime([.4,.2,.1,.05][i]*globalVol,t+.008);g.gain.exponentialRampToValueAtTime(.001,t+1.2+i*.25);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+2.5)}); },
  'chime':           () => sounds['bell'](),
  'ping':            () => tone(1760,'sine',.5,.003,.015,.1,.08,.02),
  'ping-soft':       () => tone(1200,'sine',.2,.005,.02,.2,.15,.05),
  'message':         () => { tone(587,'sine',.15,.008,.02,.3,.15,.06); setTimeout(()=>tone(784,'sine',.12,.008,.02,.2,.15,.06),80); },
  'mention':         () => chord([880,1108,1320],'sine',.12,.005,.015,.2,.1,.04,60),
  'alert':           () => sounds['warning'](),
  'call':            () => [0,400,800].forEach(d=>setTimeout(()=>tone(800,'sine',.25,.01,.04,.3,.1,.1),d)),
  'hangup':          () => tone(400,'sine',.15,.01,.04,.3,.2,.1),
  'reminder':        () => tone(523,'sine',.1,.01,.03,.4,.2,.15),
  'email':           () => { tone(698,'sine',.12,.008,.02,.3,.12,.06); setTimeout(()=>tone(880,'sine',.1,.008,.02,.2,.12,.06),70); },
  'sms':             () => { tone(1047,'sine',.15,.005,.015,.2,.08,.03); setTimeout(()=>tone(1319,'sine',.12,.005,.015,.15,.08,.03),50); },
  'badge':           () => tone(1500,'sine',.08,.003,.01,.15,.06,.02),
  'toast':           () => { tone(600,'sine',.1,.008,.02,.25,.1,.05); setTimeout(()=>tone(750,'sine',.08,.008,.02,.2,.1,.05),60); },

  // ── SYSTEM (18) ──
  'unlock':          () => chord([392,523.25,659.25,783.99],'sine',.12,.008,.015,.3,.15,.04,35),
  'lock':            () => descend([783.99,659.25,523.25],'sine',.1,.008,.015,.2,.15,.04,50),
  'open':            () => tone(400,'sine',.35,.01,.02,.5,.1,.05),
  'close':           () => tone(500,'sine',.25,.01,.02,.3,.08,.03),
  'save':            () => chord([440,554,659],'sine',.25,.005,.02,.3,.1,.02,60),
  'delete':          () => { tone(200,'sawtooth',.2,.005,.02,.2,.1,.02); setTimeout(()=>tone(150,'sawtooth',.15,.01,.02,.15,.1,.05),60); },
  'trash':           () => { noise(.15,.15,600); setTimeout(()=>noise(.1,.1,300),80); },
  'refresh':         () => sweep(.2,.1,5000,800),
  'load':            () => noise(.15,.1,2500),
  'loading':         () => [0,100,200].forEach((d,i)=>setTimeout(()=>tone(600+i*100,'sine',.06,.005,.01,.1,.05,.02),d)),
  'search':          () => sounds['typing'](),
  'send':            () => { tone(600,'sine',.15,.01,.02,.3,.1,.05); setTimeout(()=>tone(900,'sine',.1,.005,.02,.2,.1,.03),60); },
  'receive':         () => { tone(900,'sine',.1,.005,.02,.2,.1,.03); setTimeout(()=>tone(600,'sine',.15,.01,.02,.3,.1,.05),60); },
  'download':        () => chord([400,500,600],'sine',.1,.01,.02,.3,.1,.05,80),
  'upload':          () => chord([600,700,800],'sine',.1,.01,.02,.3,.1,.05,80),
  'boot':            () => chord([200,400,600,800],'sine',.1,.01,.03,.3,.15,.06,80),
  'shutdown':        () => descend([800,600,400,200],'sine',.1,.01,.03,.3,.15,.06,80),
  'sync':            () => { tone(500,'sine',.1,.005,.01,.2,.05,.02); setTimeout(()=>tone(700,'sine',.08,.005,.01,.15,.05,.02),100); setTimeout(()=>tone(500,'sine',.06,.005,.01,.1,.05,.02),200); },

  // ── FORM (16) ──
  'typing':          () => { const f=[800,1e3,1200,900,1100][Math.floor(Math.random()*5)]; tone(f,'sine',.08,.002,.008,.1,.02,.01); },
  'backspace':       () => tone(300,'sawtooth',.06,.003,.01,.1,.03,.02),
  'enter':           () => tone(500,'sine',.15,.005,.015,.3,.08,.03),
  'tab':             () => tone(700,'sine',.08,.003,.01,.2,.05,.02),
  'select-all':      () => { tone(600,'sine',.1,.005,.01,.15,.05,.02); setTimeout(()=>tone(800,'sine',.08,.005,.01,.1,.05,.02),40); },
  'copy':            () => tone(880,'sine',.1,.003,.01,.2,.05,.02),
  'paste':           () => { tone(660,'sine',.1,.003,.01,.2,.05,.02); setTimeout(()=>tone(880,'sine',.08,.003,.01,.15,.05,.02),50); },
  'focus':           () => tone(1000,'sine',.06,.005,.01,.15,.05,.02),
  'blur':            () => tone(800,'sine',.04,.005,.01,.1,.05,.02),
  'validate':        () => { tone(440,'sine',.08,.003,.01,.2,.05,.02); setTimeout(()=>tone(554,'sine',.06,.003,.01,.15,.05,.02),40); },
  'autocomplete':    () => chord([800,1000,1200],'sine',.06,.003,.01,.1,.04,.02,30),
  'dropdown-open':   () => tone(600,'sine',.1,.005,.02,.2,.08,.03),
  'dropdown-close':  () => tone(500,'sine',.08,.005,.02,.15,.06,.03),
  'slider-tick':     () => tone(1200,'sine',.04,.002,.005,.1,.02,.01),
  'clear':           () => sweep(.12,.06,3000,500),
  'submit':          () => chord([523,659,784],'sine',.2,.008,.03,.3,.12,.06,50),

  // ── MEDIA (14) ──
  'play':            () => tone(600,'sine',.3,.005,.02,.3,.08,.02),
  'pause':           () => tone(500,'sine',.25,.005,.02,.2,.05,.02),
  'stop':            () => tone(400,'square',.2,.005,.02,.2,.05,.02),
  'skip':            () => sweep(.25,.08,6000,1000),
  'skip-back':       () => sweep(.2,.08,1000,6000),
  'vol-up':          () => { tone(800,'sine',.12,.005,.01,.2,.05,.02); setTimeout(()=>tone(1000,'sine',.1,.005,.01,.15,.05,.02),50); },
  'vol-down':        () => { tone(1000,'sine',.1,.005,.01,.15,.05,.02); setTimeout(()=>tone(800,'sine',.08,.005,.01,.1,.05,.02),50); },
  'mute':            () => tone(600,'sine',.1,.005,.01,.1,.05,.02),
  'unmute':          () => tone(600,'sine',.15,.005,.02,.3,.08,.03),
  'record':          () => tone(1000,'sine',.3,.005,.02,.2,.1,.05),
  'rewind':          () => sweep(.15,.1,1000,4000),
  'fast-forward':    () => sweep(.15,.1,4000,1000),
  'shuffle':         () => { const r=()=>tone(600+Math.random()*600,'sine',.06,.003,.01,.1,.03,.02); r();setTimeout(r,40);setTimeout(r,80); },
  'seek':            () => sweep(.1,.06,2000,3000),

  // ── GESTURE (12) ──
  'pinch':           () => { tone(400,'sine',.08,.005,.01,.1,.03,.02); setTimeout(()=>tone(300,'sine',.06,.005,.01,.08,.03,.02),60); },
  'zoom':            () => { tone(300,'sine',.06,.005,.01,.08,.03,.02); setTimeout(()=>tone(400,'sine',.08,.005,.01,.1,.03,.02),60); },
  'pull':            () => sweep(.15,.12,2000,4000),
  'drop':            () => tone(200,'sine',.2,.01,.02,.3,.1,.05),
  'drag':            () => noise(.08,.15,1500),
  'drop-zone':       () => { tone(350,'sine',.15,.01,.02,.3,.1,.05); setTimeout(()=>tone(500,'sine',.12,.01,.02,.2,.1,.05),80); },
  'spread':          () => { tone(300,'sine',.06,.005,.01,.08,.04,.02); setTimeout(()=>tone(500,'sine',.08,.005,.01,.12,.04,.02),40); setTimeout(()=>tone(700,'sine',.06,.005,.01,.08,.04,.02),80); },
  'rotate':          () => { for(let i=0;i<5;i++) setTimeout(()=>tone(400+i*50,'sine',.04,.003,.008,.1,.03,.01),i*30); },
  'flick':           () => sweep(.2,.06,6000,800),
  'shake':           () => [0,40,80,120].forEach((d,i)=>setTimeout(()=>tone(i%2?250:200,'sine',.06,.003,.01,.1,.03,.02),d)),
  'force-touch':     () => { tone(200,'sine',.15,.01,.02,.3,.08,.04); setTimeout(()=>tone(300,'sine',.2,.01,.02,.4,.1,.06),80); },
  'edge-swipe':      () => sweep(.18,.12,500,5000),

  // ── NAVIGATION (14) ──
  'page-in':         () => { tone(400,'sine',.12,.01,.02,.3,.1,.05); setTimeout(()=>tone(600,'sine',.1,.01,.02,.25,.1,.05),60); },
  'page-out':        () => { tone(600,'sine',.1,.01,.02,.25,.1,.05); setTimeout(()=>tone(400,'sine',.08,.01,.02,.2,.1,.05),60); },
  'tab-switch':      () => tone(800,'sine',.08,.003,.01,.15,.05,.02),
  'tab-next':        () => { tone(700,'sine',.07,.003,.01,.15,.05,.02); setTimeout(()=>tone(900,'sine',.06,.003,.01,.1,.05,.02),40); },
  'tab-prev':        () => { tone(900,'sine',.06,.003,.01,.1,.05,.02); setTimeout(()=>tone(700,'sine',.07,.003,.01,.15,.05,.02),40); },
  'sidebar-open':    () => tone(350,'sine',.12,.01,.02,.3,.1,.06),
  'sidebar-close':   () => tone(450,'sine',.1,.01,.02,.2,.08,.04),
  'breadcrumb':      () => tone(1000,'sine',.05,.003,.01,.1,.04,.02),
  'back':            () => { tone(500,'sine',.1,.005,.015,.2,.08,.03); setTimeout(()=>tone(400,'sine',.08,.005,.015,.15,.08,.03),50); },
  'forward':         () => { tone(400,'sine',.08,.005,.015,.15,.08,.03); setTimeout(()=>tone(500,'sine',.1,.005,.015,.2,.08,.03),50); },
  'home':            () => chord([523,659,784],'sine',.1,.008,.02,.3,.1,.05,40),
  'menu':            () => { tone(600,'sine',.08,.005,.01,.15,.05,.02); setTimeout(()=>tone(700,'sine',.06,.005,.01,.1,.05,.02),30); setTimeout(()=>tone(800,'sine',.04,.005,.01,.08,.05,.02),60); },
  'modal-open':      () => { tone(400,'sine',.15,.01,.03,.35,.12,.06); setTimeout(()=>tone(600,'sine',.12,.01,.02,.25,.1,.05),80); },
  'modal-close':     () => { tone(500,'sine',.1,.01,.02,.2,.08,.04); setTimeout(()=>tone(350,'sine',.08,.01,.02,.15,.08,.04),60); },

  // ── COMMERCE (12) ──
  'cart-add':        () => chord([523,659,784],'sine',.15,.006,.025,.3,.1,.05,45),
  'cart-remove':     () => descend([784,659,523],'sine',.1,.006,.025,.2,.1,.05,45),
  'checkout':        () => chord([523,659,784,1047],'sine',.18,.008,.035,.3,.15,.08,50),
  'payment':         () => chord([440,554,659,880],'sine',.2,.006,.03,.35,.15,.08,40),
  'price-up':        () => { tone(600,'sine',.08,.005,.01,.15,.05,.02); setTimeout(()=>tone(800,'sine',.06,.005,.01,.1,.05,.02),40); },
  'price-down':      () => { tone(800,'sine',.06,.005,.01,.1,.05,.02); setTimeout(()=>tone(600,'sine',.08,.005,.01,.15,.05,.02),40); },
  'coupon':          () => chord([1047,1319,1568],'sine',.1,.004,.015,.15,.08,.03,35),
  'receipt':         () => { noise(.08,.06,2000); setTimeout(()=>tone(800,'sine',.06,.003,.01,.1,.04,.02),60); },
  'refund':          () => descend([659,523,440],'sine',.1,.008,.02,.25,.1,.05,50),
  'wishlist':        () => { tone(880,'sine',.1,.005,.015,.2,.1,.04); setTimeout(()=>tone(1108,'sine',.08,.005,.015,.15,.1,.04),60); },
  'shipping':        () => chord([400,500,600,700],'sine',.08,.008,.02,.2,.1,.04,60),
  'order-complete':  () => chord([523,659,784,1047,1319],'sine',.16,.006,.03,.3,.15,.08,45),

  // ── SOCIAL (12) ──
  'like':            () => { tone(880,'sine',.15,.005,.02,.25,.1,.04); setTimeout(()=>tone(1108,'sine',.12,.005,.02,.2,.1,.04),50); },
  'unlike':          () => { tone(1108,'sine',.08,.005,.02,.15,.08,.03); setTimeout(()=>tone(880,'sine',.06,.005,.02,.1,.08,.03),50); },
  'follow':          () => chord([659,784,1047],'sine',.12,.006,.02,.25,.1,.04,45),
  'unfollow':        () => descend([1047,784,659],'sine',.08,.006,.02,.15,.08,.04,45),
  'share':           () => { tone(700,'sine',.1,.005,.015,.2,.08,.04); setTimeout(()=>tone(900,'sine',.12,.005,.015,.25,.1,.04),50); setTimeout(()=>tone(1100,'sine',.08,.005,.015,.15,.08,.04),100); },
  'comment':         () => { tone(600,'sine',.08,.005,.015,.2,.08,.03); setTimeout(()=>tone(750,'sine',.06,.005,.015,.15,.08,.03),50); },
  'react':           () => tone(1200,'sine',.12,.003,.01,.15,.06,.03),
  'bookmark':        () => { tone(500,'sine',.1,.005,.02,.25,.1,.05); setTimeout(()=>tone(700,'sine',.12,.005,.02,.3,.1,.05),60); },
  'repost':          () => { sweep(.1,.08,800,3000); setTimeout(()=>tone(800,'sine',.08,.005,.015,.15,.06,.03),100); },
  'block':           () => { tone(200,'square',.1,.005,.02,.15,.08,.03); setTimeout(()=>tone(150,'square',.08,.005,.02,.1,.08,.03),80); },
  'emoji':           () => tone(1400,'sine',.08,.003,.01,.1,.04,.02),
  'clap':            () => { bandNoise(.25,.03,3000,6); setTimeout(()=>bandNoise(.2,.025,2500,5),70); setTimeout(()=>bandNoise(.15,.02,2000,4),130); },

  // ── AI (12) ──
  'ai-thinking':     () => [0,120,240].forEach((d,i)=>setTimeout(()=>tone(500+i*80,'sine',.05,.008,.015,.15,.08,.03),d)),
  'ai-streaming':    () => { for(let i=0;i<6;i++) setTimeout(()=>tone(600+Math.random()*200,'sine',.03,.002,.006,.08,.02,.01),i*50); },
  'ai-generating':   () => { tone(400,'sine',.06,.01,.02,.2,.08,.04); setTimeout(()=>tone(500,'sine',.05,.01,.02,.15,.08,.04),80); setTimeout(()=>tone(600,'sine',.04,.01,.02,.1,.08,.04),160); },
  'ai-complete':     () => chord([523,659,784,1047],'sine',.12,.006,.025,.3,.12,.06,45),
  'ai-error':        () => { tone(300,'sine',.08,.01,.03,.2,.1,.06); setTimeout(()=>tone(250,'sine',.06,.01,.03,.15,.1,.06),100); },
  'ai-typing':       () => tone(900+Math.random()*200,'sine',.04,.002,.005,.08,.02,.01),
  'ai-response':     () => { tone(600,'sine',.08,.008,.02,.25,.1,.05); setTimeout(()=>tone(800,'sine',.06,.008,.02,.2,.1,.05),70); },
  'ai-cancel':       () => { tone(400,'triangle',.08,.005,.02,.15,.08,.04); setTimeout(()=>tone(300,'triangle',.06,.005,.02,.1,.08,.04),60); },
  'ai-suggest':      () => tone(1100,'sine',.06,.005,.015,.15,.08,.03),
  'ai-accept':       () => { tone(700,'sine',.1,.005,.02,.25,.1,.04); setTimeout(()=>tone(900,'sine',.08,.005,.02,.2,.1,.04),50); },
  'ai-reject':       () => descend([600,450],'sine',.08,.005,.02,.15,.08,.04,60),
  'ai-retry':        () => { sweep(.1,.06,1000,3000); setTimeout(()=>tone(700,'sine',.06,.005,.01,.15,.06,.03),80); },

  // ── GAMING (14) ──
  'score':           () => chord([659,784,1047],'sine',.15,.005,.02,.25,.1,.04,40),
  'level-up':        () => chord([392,523,659,784,1047,1319],'sine',.14,.005,.02,.25,.12,.05,40),
  'coin':            () => { tone(1319,'sine',.2,.003,.01,.1,.06,.02); setTimeout(()=>tone(1760,'sine',.15,.003,.01,.08,.06,.02),50); },
  'powerup':         () => { for(let i=0;i<6;i++) setTimeout(()=>tone(400+i*100,'sine',.12-i*.015,.005,.01,.15,.06,.02),i*35); },
  'damage':          () => { bandNoise(.3,.04,1500,3); setTimeout(()=>tone(150,'sawtooth',.1,.005,.02,.15,.08,.04),20); },
  'heal':            () => chord([523,659,784],'sine',.1,.01,.03,.35,.15,.08,60),
  'countdown':       () => tone(800,'square',.12,.003,.01,.1,.04,.02),
  'game-over':       () => descend([400,350,300,250,200],'sine',.12,.01,.03,.25,.15,.08,100),
  'victory':         () => chord([523,659,784,1047,1319,1568],'sine',.15,.005,.025,.3,.15,.06,45),
  'bonus':           () => { chord([1047,1319,1568],'sine',.12,.004,.015,.15,.08,.03,30); },
  'combo':           () => { for(let i=0;i<4;i++) setTimeout(()=>tone(800+i*200,'sine',.1-i*.02,.003,.01,.1,.04,.02),i*40); },
  'shield':          () => tone(300,'sine',.15,.01,.03,.4,.15,.08),
  'xp':              () => { tone(1000,'sine',.08,.003,.01,.1,.05,.02); setTimeout(()=>tone(1200,'sine',.06,.003,.01,.08,.05,.02),40); },
  'jump':            () => { initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(fs(200),t);o.frequency.exponentialRampToValueAtTime(fs(800),t+.1);g.gain.setValueAtTime(.15*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+.15);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+.2); },

  // ── STATUS (10) ──
  'online':          () => chord([523,659,784],'sine',.1,.008,.02,.3,.1,.05,50),
  'offline':         () => descend([784,659,523],'sine',.08,.008,.02,.2,.1,.05,50),
  'away':            () => tone(600,'sine',.06,.01,.03,.2,.12,.06),
  'busy':            () => { tone(400,'square',.06,.005,.01,.1,.05,.02); setTimeout(()=>tone(400,'square',.05,.005,.01,.08,.05,.02),120); },
  'connecting':      () => [0,150,300].forEach((d,i)=>setTimeout(()=>tone(500+i*50,'sine',.05,.005,.01,.1,.04,.02),d)),
  'connected':       () => chord([523,784],'sine',.12,.005,.02,.25,.1,.04,40),
  'disconnected':    () => descend([784,523],'sine',.1,.005,.02,.2,.08,.04,60),
  'syncing':         () => { const step=()=>{tone(700,'sine',.04,.003,.008,.08,.03,.01);setTimeout(()=>tone(900,'sine',.03,.003,.008,.06,.03,.01),40)};step();setTimeout(step,200);setTimeout(step,400); },
  'permission':      () => tone(880,'sine',.1,.005,.02,.25,.1,.05),
  'clipboard':       () => { bandNoise(.15,.02,3000,8); setTimeout(()=>tone(1000,'sine',.06,.003,.01,.1,.04,.02),20); },

  // ── AMBIENT (12) ──
  'ambient-hum':     () => { initAudio();const t=now();[100,200,300].forEach(f=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(fs(f),t);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.03*globalVol,t+.1);g.gain.setValueAtTime(.03*globalVol,t+.4);g.gain.linearRampToValueAtTime(0,t+.6);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+.7)}); },
  'ambient-drone':   () => { initAudio();const t=now();const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(fs(80),t);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.06*globalVol,t+.15);g.gain.setValueAtTime(.06*globalVol,t+.5);g.gain.linearRampToValueAtTime(0,t+.8);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+.9); },
  'ambient-pulse':   () => [0,200,400].forEach(d=>setTimeout(()=>tone(200,'sine',.04,.02,.04,.3,.1,.04),d)),
  'ambient-breath':  () => sweep(.06,.4,200,800),
  'ambient-static':  () => noise(.04,.3,1500),
  'ambient-wind':    () => sweep(.05,.5,300,1200),
  'ambient-rain':    () => { for(let i=0;i<8;i++) setTimeout(()=>bandNoise(.03,.08,2000+Math.random()*2000,2),i*40+Math.random()*30); },
  'ambient-ocean':   () => { sweep(.04,.8,200,600); setTimeout(()=>sweep(.03,.6,400,200),400); },
  'ambient-crickets':() => { for(let i=0;i<5;i++) setTimeout(()=>tone(4000+Math.random()*1000,'sine',.02,.001,.005,.05,.02,.01),i*60+Math.random()*40); },
  'ambient-chatter': () => { for(let i=0;i<6;i++) setTimeout(()=>bandNoise(.02,.06,800+Math.random()*600,3),i*50+Math.random()*30); },
  'ambient-tick':    () => bandNoise(.08,.008,4000,15),
  'ambient-glow':    () => { initAudio();const t=now();[440,554,659].forEach((f,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(fs(f),t);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.04*globalVol,t+.1+i*.05);g.gain.setValueAtTime(.04*globalVol,t+.3);g.gain.linearRampToValueAtTime(0,t+.5+i*.05);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+.6+i*.05)}); },
};

// ===== PUBLIC API =====
export function play(name, options) {
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const fn = sounds[name];
  if (!fn) { console.warn(`[sonic-flow] Unknown sound: "${name}"`); return; }
  const prev = globalVol;
  if (options && typeof options.volume === 'number') globalVol = options.volume;
  fn();
  if (options && typeof options.volume === 'number') globalVol = prev;
}

export function setVolume(v) { globalVol = Math.max(0, Math.min(1, v)); if (masterGain) masterGain.gain.setTargetAtTime(globalVol, ctx.currentTime, .05); }
export function setPitch(s) { globalPitch = s; }
export function getSounds() { return Object.keys(sounds); }

export function bind(opts) {
  if (opts && typeof opts.volume === 'number') setVolume(opts.volume);
  document.querySelectorAll('[data-sf-hover]').forEach(el => { const s = el.getAttribute('data-sf-hover') || 'hover'; el.addEventListener('mouseenter', () => play(s)); el.addEventListener('touchstart', () => play(s), { passive: true }); });
  document.querySelectorAll('[data-sf-press]').forEach(el => { const s = el.getAttribute('data-sf-press') || 'press'; el.addEventListener('mousedown', () => play(s)); el.addEventListener('touchstart', () => play(s), { passive: true }); });
  document.querySelectorAll('[data-sf-release]').forEach(el => { const s = el.getAttribute('data-sf-release') || 'release'; el.addEventListener('mouseup', () => play(s)); el.addEventListener('touchend', () => play(s), { passive: true }); });
  document.querySelectorAll('[data-sf-toggle]').forEach(el => { let st = false; el.addEventListener('click', () => { st = !st; play(st ? 'toggle-on' : 'toggle-off'); }); });
  document.querySelectorAll('[data-sf-focus]').forEach(el => el.addEventListener('focus', () => play('focus')));
  document.querySelectorAll('[data-sf-blur]').forEach(el => el.addEventListener('blur', () => play('blur')));
  document.querySelectorAll('[data-sf]').forEach(el => { const s = el.getAttribute('data-sf'); if (s) el.addEventListener('click', () => play(s)); });
}

if (typeof window !== 'undefined') window.SonicFlow = { play, bind, setVolume, setPitch, getSounds };
export default { play, bind, setVolume, setPitch, getSounds };
