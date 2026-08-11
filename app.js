let ctx,masterGain,analyser,globalVol=0.7,currentCueIndex=0,pageMuted=false;
function initAudio(){if(ctx)return;ctx=new(window.AudioContext||window.webkitAudioContext)();masterGain=ctx.createGain();masterGain.gain.value=globalVol;analyser=ctx.createAnalyser();analyser.fftSize=2048;masterGain.connect(analyser);analyser.connect(ctx.destination)}
function now(){return ctx?ctx.currentTime:0}
function playTone(f,type,peak,atk,dcy,sus,rel,dur){if(pageMuted)return;initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(peak*globalVol,t+atk);g.gain.linearRampToValueAtTime(peak*globalVol*sus,t+atk+dcy);g.gain.linearRampToValueAtTime(0,t+atk+dcy+dur+rel);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+atk+dcy+dur+rel+.05)}
function playNoise(peak,dur,lp){if(pageMuted)return;initAudio();const len=ctx.sampleRate*dur,buf=ctx.createBuffer(1,len,ctx.sampleRate),d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;const s=ctx.createBufferSource(),g=ctx.createGain(),f=ctx.createBiquadFilter();f.type='lowpass';f.frequency.setValueAtTime(lp,now());g.gain.setValueAtTime(peak*globalVol,now());g.gain.exponentialRampToValueAtTime(.001,now()+dur);s.buffer=buf;s.connect(f);f.connect(g);g.connect(masterGain);s.start(now())}
function playBandNoise(peak,dur,freq,Q){if(pageMuted)return;initAudio();const len=ctx.sampleRate*dur,buf=ctx.createBuffer(1,len,ctx.sampleRate),d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;const s=ctx.createBufferSource(),g=ctx.createGain(),f=ctx.createBiquadFilter();f.type='bandpass';f.frequency.setValueAtTime(freq,now());f.Q.value=Q||5;g.gain.setValueAtTime(peak*globalVol,now());g.gain.exponentialRampToValueAtTime(.001,now()+dur);s.buffer=buf;s.connect(f);f.connect(g);g.connect(masterGain);s.start(now())}
function playSweepNoise(peak,dur,sf,ef){if(pageMuted)return;initAudio();const len=ctx.sampleRate*dur,buf=ctx.createBuffer(1,len,ctx.sampleRate),d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;const s=ctx.createBufferSource(),g=ctx.createGain(),f=ctx.createBiquadFilter();f.type='lowpass';f.frequency.setValueAtTime(sf,now());f.frequency.linearRampToValueAtTime(ef,now()+dur);g.gain.setValueAtTime(0,now());g.gain.linearRampToValueAtTime(peak*globalVol,now()+dur*.2);g.gain.linearRampToValueAtTime(0,now()+dur);s.buffer=buf;s.connect(f);f.connect(g);g.connect(masterGain);s.start(now())}

// All sound functions
function playSuccess(){[523.25,659.25,783.99].forEach((f,i)=>setTimeout(()=>playTone(f,'sine',.18,.008,.04,.3,.15,.08),i*55))}
function playSuccessSoft(){[523.25,659.25].forEach((f,i)=>setTimeout(()=>playTone(f,'sine',.1,.015,.06,.4,.2,.12),i*70))}
function playSuccessBright(){[880,1108.73,1318.51].forEach((f,i)=>setTimeout(()=>playTone(f,'sine',.15,.005,.03,.2,.1,.06),i*45))}
function playError(){if(pageMuted)return;initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),f=ctx.createBiquadFilter();o.type='sawtooth';o.frequency.setValueAtTime(180,t);o.frequency.linearRampToValueAtTime(126,t+.12);f.type='lowpass';f.frequency.setValueAtTime(800,t);f.frequency.linearRampToValueAtTime(200,t+.18);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.12*globalVol,t+.008);g.gain.exponentialRampToValueAtTime(.001,t+.2);o.connect(f);f.connect(g);g.connect(masterGain);o.start(t);o.stop(t+.25)}
function playErrorSoft(){playTone(200,'sine',.08,.01,.04,.3,.15,.1);setTimeout(()=>playTone(180,'sine',.06,.01,.04,.2,.15,.1),120)}
function playErrorShake(){[200,180,160,180].forEach((f,i)=>setTimeout(()=>playTone(f,'sine',.06,.005,.02,.2,.05,.03),i*40))}
function playWarning(){[0,150].forEach(d=>setTimeout(()=>{if(pageMuted)return;initAudio();const o=ctx.createOscillator(),g=ctx.createGain(),f=ctx.createBiquadFilter();o.type='square';o.frequency.setValueAtTime(440,now());f.type='lowpass';f.frequency.setValueAtTime(2000,now());g.gain.setValueAtTime(0,now());g.gain.linearRampToValueAtTime(.08*globalVol,now()+.01);g.gain.exponentialRampToValueAtTime(.001,now()+.15);o.connect(f);f.connect(g);g.connect(masterGain);o.start(now());o.stop(now()+.2)},d))}
function playConfirm(){playTone(523,'sine',.22,.008,.02,.3,.08,.04);setTimeout(()=>playTone(659,'sine',.22,.008,.02,.3,.1,.06),70)}
function playDeny(){playTone(300,'sawtooth',.15,.01,.02,.2,.1,.05);setTimeout(()=>playTone(250,'sawtooth',.12,.01,.02,.2,.1,.08),100)}
function playComplete(){[392,523.25,659.25,783.99,1046.5].forEach((f,i)=>setTimeout(()=>playTone(f,'sine',.12,.006,.03,.3,.15,.06),i*45))}
function playCancel(){playTone(350,'triangle',.1,.01,.03,.2,.12,.08);setTimeout(()=>playTone(280,'triangle',.08,.01,.03,.15,.12,.1),100)}
function playUndo(){playTone(600,'sine',.1,.01,.02,.3,.1,.05);setTimeout(()=>playTone(500,'sine',.08,.01,.02,.2,.1,.05),80);setTimeout(()=>playTone(400,'sine',.06,.01,.02,.15,.1,.05),160)}
function playBloom(){if(pageMuted)return;initAudio();const t=now();[261.63,329.63,392,523.25].forEach((fr,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(fr*.98,t);o.frequency.linearRampToValueAtTime(fr,t+.15);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime([.15,.12,.1,.08][i]*globalVol,t+.04+i*.03);g.gain.exponentialRampToValueAtTime(.001,t+.6+i*.1);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+1)})}
function playSparkle(){if(pageMuted)return;initAudio();const t=now();[2093,2637,3136,3520,4186].forEach((fr,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(fr,t+i*.04);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.1*globalVol*(1-i*.15),t+i*.04+.005);g.gain.exponentialRampToValueAtTime(.001,t+i*.04+.2);o.connect(g);g.connect(masterGain);o.start(t+i*.04);o.stop(t+i*.04+.3)})}
function playHover(){if(pageMuted)return;initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),f=ctx.createBiquadFilter();o.type='triangle';o.frequency.setValueAtTime(800,t);o.frequency.exponentialRampToValueAtTime(1200,t+.02);f.type='highpass';f.frequency.setValueAtTime(600,t);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.12*globalVol,t+.005);g.gain.exponentialRampToValueAtTime(.001,t+.05);o.connect(f);f.connect(g);g.connect(masterGain);o.start(t);o.stop(t+.08)}
function playHoverSoft(){playTone(600,'sine',.06,.008,.02,.2,.08,.03)}
function playHoverSharp(){playTone(1500,'square',.04,.002,.01,.1,.03,.01)}
function playClick(){if(pageMuted)return;initAudio();const t=now(),len=ctx.sampleRate*.015,buf=ctx.createBuffer(1,len,ctx.sampleRate),d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.exp(-i/(len*.08));const s=ctx.createBufferSource(),g=ctx.createGain(),f=ctx.createBiquadFilter();f.type='bandpass';f.frequency.setValueAtTime(2500,t);f.Q.value=2;g.gain.setValueAtTime(.35*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+.015);s.buffer=buf;s.connect(f);f.connect(g);g.connect(masterGain);s.start(t)}
function playClickSoft(){playTone(800,'sine',.08,.003,.01,.1,.05,.02)}
function playClickMech(){playBandNoise(.3,.02,3000,8);setTimeout(()=>playBandNoise(.15,.015,1500,6),10)}
function playPop(){playTone(400,'sine',.3,.003,.01,.1,.05,.02)}
function playPopSoft(){playTone(350,'sine',.15,.005,.015,.15,.08,.03)}
function playToggleOn(){playTone(600,'sine',.2,.005,.02,.3,.1,.05)}
function playToggleOff(){playTone(450,'sine',.15,.005,.02,.2,.08,.03)}
function playPress(){playClick()}
function playRelease(){playPop()}
function playScroll(){playSweepNoise(.15,.08,4000,800)}
function playScrollUp(){playSweepNoise(.12,.08,800,4000)}
function playSwipe(){playSweepNoise(.18,.1,6000,500)}
function playSwipeBack(){playSweepNoise(.15,.1,500,6000)}
function playWhoosh(){playNoise(.2,.12,3000)}
function playPluck(){const ns=[220,293.66,329.63,440],fr=ns[Math.floor(Math.random()*ns.length)];if(pageMuted)return;initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),f=ctx.createBiquadFilter();o.type='triangle';o.frequency.setValueAtTime(fr,t);g.gain.setValueAtTime(.22*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+.25);f.type='lowpass';f.frequency.setValueAtTime(3000,t);f.frequency.exponentialRampToValueAtTime(500,t+.25);o.connect(f);f.connect(g);g.connect(masterGain);o.start(t);o.stop(t+.3)}
function playNotification(){if(pageMuted)return;initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(587.33,t);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.18*globalVol,t+.015);g.gain.setValueAtTime(.18*globalVol,t+.12);g.gain.exponentialRampToValueAtTime(.001,t+.35);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+.4)}
function playNotifySoft(){playTone(523,'sine',.1,.01,.03,.4,.2,.1)}
function playBell(){if(pageMuted)return;initAudio();const t=now();[1,2.7,5.4,8.1].forEach((h,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(880*h,t);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime([.4,.2,.1,.05][i]*globalVol,t+.008);g.gain.exponentialRampToValueAtTime(.001,t+1.2+i*.25);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+2.5)})}
function playChime(){playBell()}
function playPing(){playTone(1760,'sine',.5,.003,.015,.1,.08,.02)}
function playPingSoft(){playTone(1200,'sine',.2,.005,.02,.2,.15,.05)}
function playMessage(){playTone(587,'sine',.15,.008,.02,.3,.15,.06);setTimeout(()=>playTone(784,'sine',.12,.008,.02,.2,.15,.06),80)}
function playMention(){playTone(880,'sine',.12,.005,.015,.2,.1,.04);setTimeout(()=>playTone(1108,'sine',.1,.005,.015,.15,.1,.04),60);setTimeout(()=>playTone(1320,'sine',.08,.005,.015,.1,.1,.04),120)}
function playAlert(){playWarning()}
function playCall(){[0,400,800].forEach(d=>setTimeout(()=>playTone(800,'sine',.25,.01,.04,.3,.1,.1),d))}
function playHangup(){playTone(400,'sine',.15,.01,.04,.3,.2,.1)}
function playReminder(){playTone(523,'sine',.1,.01,.03,.4,.2,.15)}
function playUnlock(){[392,523.25,659.25,783.99].forEach((f,i)=>setTimeout(()=>playTone(f,'sine',.12,.008,.015,.3,.15,.04),i*35))}
function playLock(){playTone(783.99,'sine',.1,.008,.015,.2,.15,.04);setTimeout(()=>playTone(659.25,'sine',.08,.008,.015,.15,.15,.04),50);setTimeout(()=>playTone(523.25,'sine',.06,.008,.015,.1,.15,.04),100)}
function playOpen(){playTone(400,'sine',.35,.01,.02,.5,.1,.05)}
function playClose(){playTone(500,'sine',.25,.01,.02,.3,.08,.03)}
function playSave(){playTone(440,'sine',.25,.005,.02,.3,.1,.02);setTimeout(()=>playTone(554,'sine',.25,.005,.02,.3,.1,.02),60);setTimeout(()=>playTone(659,'sine',.25,.01,.02,.3,.1,.05),120)}
function playDelete(){playTone(200,'sawtooth',.2,.005,.02,.2,.1,.02);setTimeout(()=>playTone(150,'sawtooth',.15,.01,.02,.15,.1,.05),60)}
function playTrash(){playNoise(.15,.15,600);setTimeout(()=>playNoise(.1,.1,300),80)}
function playRefresh(){playSweepNoise(.2,.1,5000,800)}
function playLoad(){playNoise(.15,.1,2500)}
function playLoading(){[0,100,200].forEach((d,i)=>setTimeout(()=>playTone(600+i*100,'sine',.06,.005,.01,.1,.05,.02),d))}
function playSearch(){playTyping()}
function playSend(){playTone(600,'sine',.15,.01,.02,.3,.1,.05);setTimeout(()=>playTone(900,'sine',.1,.005,.02,.2,.1,.03),60)}
function playReceive(){playTone(900,'sine',.1,.005,.02,.2,.1,.03);setTimeout(()=>playTone(600,'sine',.15,.01,.02,.3,.1,.05),60)}
function playDownload(){playTone(400,'sine',.1,.01,.02,.3,.1,.05);setTimeout(()=>playTone(500,'sine',.1,.01,.02,.3,.1,.05),80);setTimeout(()=>playTone(600,'sine',.12,.01,.02,.3,.1,.08),160)}
function playTyping(){const f=[800,1e3,1200,900,1100][Math.floor(Math.random()*5)];playTone(f,'sine',.08,.002,.008,.1,.02,.01)}
function playBackspace(){playTone(300,'sawtooth',.06,.003,.01,.1,.03,.02)}
function playEnter(){playTone(500,'sine',.15,.005,.015,.3,.08,.03)}
function playTab(){playTone(700,'sine',.08,.003,.01,.2,.05,.02)}
function playSelectAll(){playTone(600,'sine',.1,.005,.01,.15,.05,.02);setTimeout(()=>playTone(800,'sine',.08,.005,.01,.1,.05,.02),40)}
function playCopy(){playTone(880,'sine',.1,.003,.01,.2,.05,.02)}
function playPaste(){playTone(660,'sine',.1,.003,.01,.2,.05,.02);setTimeout(()=>playTone(880,'sine',.08,.003,.01,.15,.05,.02),50)}
function playFocus(){playTone(1e3,'sine',.06,.005,.01,.15,.05,.02)}
function playBlur(){playTone(800,'sine',.04,.005,.01,.1,.05,.02)}
function playValidate(){playTone(440,'sine',.08,.003,.01,.2,.05,.02);setTimeout(()=>playTone(554,'sine',.06,.003,.01,.15,.05,.02),40)}
function playPlay(){playTone(600,'sine',.3,.005,.02,.3,.08,.02)}
function playPause(){playTone(500,'sine',.25,.005,.02,.2,.05,.02)}
function playStop(){playTone(400,'square',.2,.005,.02,.2,.05,.02)}
function playSkip(){playSweepNoise(.25,.08,6000,1e3)}
function playSkipBack(){playSweepNoise(.2,.08,1e3,6000)}
function playVolUp(){playTone(800,'sine',.12,.005,.01,.2,.05,.02);setTimeout(()=>playTone(1e3,'sine',.1,.005,.01,.15,.05,.02),50)}
function playVolDown(){playTone(1e3,'sine',.1,.005,.01,.15,.05,.02);setTimeout(()=>playTone(800,'sine',.08,.005,.01,.1,.05,.02),50)}
function playMute(){playTone(600,'sine',.1,.005,.01,.1,.05,.02)}
function playUnmute(){playTone(600,'sine',.15,.005,.02,.3,.08,.03)}
function playRecord(){playTone(1e3,'sine',.3,.005,.02,.2,.1,.05)}
function playPinch(){playTone(400,'sine',.08,.005,.01,.1,.03,.02);setTimeout(()=>playTone(300,'sine',.06,.005,.01,.08,.03,.02),60)}
function playZoom(){playTone(300,'sine',.06,.005,.01,.08,.03,.02);setTimeout(()=>playTone(400,'sine',.08,.005,.01,.1,.03,.02),60)}
function playPull(){playSweepNoise(.15,.12,2000,4000)}
function playDrop(){playTone(200,'sine',.2,.01,.02,.3,.1,.05)}
function playDrag(){playNoise(.08,.15,1500)}
function playDropZone(){playTone(350,'sine',.15,.01,.02,.3,.1,.05);setTimeout(()=>playTone(500,'sine',.12,.01,.02,.2,.1,.05),80)}

function tone(f,type,peak,atk,dcy,sus,rel,dur){playTone(f,type,peak,atk,dcy,sus,rel,dur)}
function chord(freqs,type,peak,atk,dcy,sus,rel,dur,stagger){freqs.forEach((f,i)=>setTimeout(()=>playTone(f,type,peak,atk,dcy,sus,rel,dur),i*(stagger||50)))}

const SD=[
{id:'success',n:'success',cat:'feedback',fn:playSuccess,c:'#00c978',d:'Warm three-note confirmation'},
{id:'success-soft',n:'success-soft',cat:'feedback',fn:playSuccessSoft,c:'#4f8cff',d:'Gentler success'},
{id:'success-bright',n:'success-bright',cat:'feedback',fn:playSuccessBright,c:'#23ad91',d:'Bright high success'},
{id:'error',n:'error',cat:'feedback',fn:playError,c:'#ff6b5f',d:'Descending sawtooth refusal'},
{id:'error-soft',n:'error-soft',cat:'feedback',fn:playErrorSoft,c:'#ff58ae',d:'Gentle error tone'},
{id:'error-shake',n:'error-shake',cat:'feedback',fn:playErrorShake,c:'#d48f00',d:'Shaking head no'},
{id:'warning',n:'warning',cat:'feedback',fn:playWarning,c:'#d9a066',d:'Alert beep pair'},
{id:'confirm',n:'confirm',cat:'feedback',fn:playConfirm,c:'#00ca48',d:'Two-note yes'},
{id:'deny',n:'deny',cat:'feedback',fn:playDeny,c:'#ff6b5f',d:'Low refusal buzz'},
{id:'complete',n:'complete',cat:'feedback',fn:playComplete,c:'#00c978',d:'Five-note fanfare'},
{id:'cancel',n:'cancel',cat:'feedback',fn:playCancel,c:'#7e7e7d',d:'Descending dismiss'},
{id:'undo',n:'undo',cat:'feedback',fn:playUndo,c:'#9f4fff',d:'Rewind glissando'},
{id:'bloom',n:'bloom',cat:'feedback',fn:playBloom,c:'#4f8cff',d:'Rising harmonic expansion'},
{id:'sparkle',n:'sparkle',cat:'feedback',fn:playSparkle,c:'#ffbb26',d:'Shimmering cascading highs'},
{id:'hover',n:'hover',cat:'interaction',fn:playHover,c:'#64c6ff',d:'Crisp instant tick'},
{id:'hover-soft',n:'hover-soft',cat:'interaction',fn:playHoverSoft,c:'#00b2ff',d:'Soft hover breath'},
{id:'hover-sharp',n:'hover-sharp',cat:'interaction',fn:playHoverSharp,c:'#4f8cff',d:'Sharp digital tick'},
{id:'click',n:'click',cat:'interaction',fn:playClick,c:'#111',d:'Mechanical button click'},
{id:'click-soft',n:'click-soft',cat:'interaction',fn:playClickSoft,c:'#7e7e7d',d:'Muted soft click'},
{id:'click-mech',n:'click-mech',cat:'interaction',fn:playClickMech,c:'#999',d:'Keyboard mechanical'},
{id:'pop',n:'pop',cat:'interaction',fn:playPop,c:'#ffbb26',d:'Bubble pop'},
{id:'pop-soft',n:'pop-soft',cat:'interaction',fn:playPopSoft,c:'#d9a066',d:'Gentle pop'},
{id:'toggle-on',n:'toggle-on',cat:'interaction',fn:playToggleOn,c:'#00ca48',d:'Switch on'},
{id:'toggle-off',n:'toggle-off',cat:'interaction',fn:playToggleOff,c:'#ff6b5f',d:'Switch off'},
{id:'press',n:'press',cat:'interaction',fn:playPress,c:'#111',d:'Mouse down'},
{id:'release',n:'release',cat:'interaction',fn:playRelease,c:'#ffbb26',d:'Mouse up'},
{id:'scroll',n:'scroll',cat:'interaction',fn:playScroll,c:'#64c6ff',d:'Scroll down sweep'},
{id:'scroll-up',n:'scroll-up',cat:'interaction',fn:playScrollUp,c:'#00b2ff',d:'Scroll up sweep'},
{id:'swipe',n:'swipe',cat:'interaction',fn:playSwipe,c:'#9f4fff',d:'Swipe forward'},
{id:'swipe-back',n:'swipe-back',cat:'interaction',fn:playSwipeBack,c:'#ff58ae',d:'Swipe back'},
{id:'whoosh',n:'whoosh',cat:'interaction',fn:playWhoosh,c:'#7e7e7d',d:'Air whoosh'},
{id:'pluck',n:'pluck',cat:'interaction',fn:playPluck,c:'#d48f00',d:'String pluck'},
{id:'notification',n:'notification',cat:'notification',fn:playNotification,c:'#64c6ff',d:'Standard notification'},
{id:'notify-soft',n:'notify-soft',cat:'notification',fn:playNotifySoft,c:'#00b2ff',d:'Soft notification'},
{id:'bell',n:'bell',cat:'notification',fn:playBell,c:'#ffbb26',d:'Rich harmonic bell'},
{id:'chime',n:'chime',cat:'notification',fn:playChime,c:'#d9a066',d:'Door chime'},
{id:'ping',n:'ping',cat:'notification',fn:playPing,c:'#00ca48',d:'High ping'},
{id:'ping-soft',n:'ping-soft',cat:'notification',fn:playPingSoft,c:'#23ad91',d:'Soft ping'},
{id:'message',n:'message',cat:'notification',fn:playMessage,c:'#4f8cff',d:'Message received'},
{id:'mention',n:'mention',cat:'notification',fn:playMention,c:'#9f4fff',d:'Mention alert'},
{id:'alert',n:'alert',cat:'notification',fn:playAlert,c:'#ff6b5f',d:'Urgent alert'},
{id:'call',n:'call',cat:'notification',fn:playCall,c:'#00c978',d:'Phone ringing'},
{id:'hangup',n:'hangup',cat:'notification',fn:playHangup,c:'#7e7e7d',d:'Call ended'},
{id:'reminder',n:'reminder',cat:'notification',fn:playReminder,c:'#d9a066',d:'Gentle reminder'},
{id:'unlock',n:'unlock',cat:'system',fn:playUnlock,c:'#00ca48',d:'Unlock ascending'},
{id:'lock',n:'lock',cat:'system',fn:playLock,c:'#ff6b5f',d:'Lock descending'},
{id:'open',n:'open',cat:'system',fn:playOpen,c:'#64c6ff',d:'Drawer open'},
{id:'close',n:'close',cat:'system',fn:playClose,c:'#7e7e7d',d:'Drawer close'},
{id:'save',n:'save',cat:'system',fn:playSave,c:'#00c978',d:'File saved'},
{id:'delete',n:'delete',cat:'system',fn:playDelete,c:'#ff6b5f',d:'File deleted'},
{id:'trash',n:'trash',cat:'system',fn:playTrash,c:'#999',d:'Trash crumple'},
{id:'refresh',n:'refresh',cat:'system',fn:playRefresh,c:'#4f8cff',d:'Page refresh'},
{id:'load',n:'load',cat:'system',fn:playLoad,c:'#7e7e7d',d:'Content load'},
{id:'loading',n:'loading',cat:'system',fn:playLoading,c:'#00b2ff',d:'Loading spinner'},
{id:'search',n:'search',cat:'system',fn:playSearch,c:'#64c6ff',d:'Search typing'},
{id:'send',n:'send',cat:'system',fn:playSend,c:'#00ca48',d:'Message sent'},
{id:'receive',n:'receive',cat:'system',fn:playReceive,c:'#23ad91',d:'Message received'},
{id:'download',n:'download',cat:'system',fn:playDownload,c:'#4f8cff',d:'Download complete'},
{id:'typing',n:'typing',cat:'form',fn:playTyping,c:'#7e7e7d',d:'Key press'},
{id:'backspace',n:'backspace',cat:'form',fn:playBackspace,c:'#ff6b5f',d:'Delete key'},
{id:'enter',n:'enter',cat:'form',fn:playEnter,c:'#111',d:'Return key'},
{id:'tab',n:'tab',cat:'form',fn:playTab,c:'#999',d:'Tab key'},
{id:'select-all',n:'select-all',cat:'form',fn:playSelectAll,c:'#4f8cff',d:'Select all'},
{id:'copy',n:'copy',cat:'form',fn:playCopy,c:'#00b2ff',d:'Copy'},
{id:'paste',n:'paste',cat:'form',fn:playPaste,c:'#23ad91',d:'Paste'},
{id:'focus',n:'focus',cat:'form',fn:playFocus,c:'#64c6ff',d:'Input focus'},
{id:'blur',n:'blur',cat:'form',fn:playBlur,c:'#bbb',d:'Input blur'},
{id:'validate',n:'validate',cat:'form',fn:playValidate,c:'#00ca48',d:'Valid input'},
{id:'play',n:'play',cat:'media',fn:playPlay,c:'#00ca48',d:'Media play'},
{id:'pause',n:'pause',cat:'media',fn:playPause,c:'#ffbb26',d:'Media pause'},
{id:'stop',n:'stop',cat:'media',fn:playStop,c:'#ff6b5f',d:'Media stop'},
{id:'skip',n:'skip',cat:'media',fn:playSkip,c:'#4f8cff',d:'Skip forward'},
{id:'skip-back',n:'skip-back',cat:'media',fn:playSkipBack,c:'#9f4fff',d:'Skip back'},
{id:'vol-up',n:'vol-up',cat:'media',fn:playVolUp,c:'#00c978',d:'Volume increase'},
{id:'vol-down',n:'vol-down',cat:'media',fn:playVolDown,c:'#23ad91',d:'Volume decrease'},
{id:'mute',n:'mute',cat:'media',fn:playMute,c:'#7e7e7d',d:'Mute on'},
{id:'unmute',n:'unmute',cat:'media',fn:playUnmute,c:'#64c6ff',d:'Mute off'},
{id:'record',n:'record',cat:'media',fn:playRecord,c:'#ff6b5f',d:'Recording start'},
{id:'pinch',n:'pinch',cat:'gesture',fn:playPinch,c:'#7e7e7d',d:'Pinch gesture'},
{id:'zoom',n:'zoom',cat:'gesture',fn:playZoom,c:'#999',d:'Zoom gesture'},
{id:'pull',n:'pull',cat:'gesture',fn:playPull,c:'#4f8cff',d:'Pull to refresh'},
{id:'drop',n:'drop',cat:'gesture',fn:playDrop,c:'#ff6b5f',d:'Item drop'},
{id:'drag',n:'drag',cat:'gesture',fn:playDrag,c:'#d9a066',d:'Item drag'},
{id:'drop-zone',n:'drop-zone',cat:'gesture',fn:playDropZone,c:'#00ca48',d:'Drop zone enter'},
// Expanded feedback
{id:'info',n:'info',cat:'feedback',fn:()=>tone(880,'sine',.1,.01,.03,.3,.12,.06),c:'#4f8cff',d:'Info tone'},
{id:'tip',n:'tip',cat:'feedback',fn:()=>{tone(1200,'sine',.08,.005,.02,.2,.1,.04);setTimeout(()=>tone(1400,'sine',.06,.005,.02,.15,.1,.04),50)},c:'#23ad91',d:'Helpful tip'},
{id:'celebrate',n:'celebrate',cat:'feedback',fn:()=>chord([523,659,784,1047,1319],'sine',.14,.005,.025,.25,.12,.05,40),c:'#ffbb26',d:'Celebration fanfare'},
{id:'milestone',n:'milestone',cat:'feedback',fn:()=>chord([392,523,659,784],'sine',.16,.008,.04,.35,.2,.1,60),c:'#00c978',d:'Milestone reached'},
{id:'progress',n:'progress',cat:'feedback',fn:()=>tone(700,'sine',.1,.005,.015,.2,.08,.03),c:'#64c6ff',d:'Progress step'},
{id:'achievement',n:'achievement',cat:'feedback',fn:()=>chord([523,659,784,1047],'sine',.18,.006,.03,.3,.18,.08,50),c:'#d48f00',d:'Achievement unlocked'},
// Expanded interaction
{id:'long-press',n:'long-press',cat:'interaction',fn:()=>{playClick();setTimeout(()=>tone(500,'sine',.12,.01,.02,.3,.1,.08),100)},c:'#7e7e7d',d:'Long press hold'},
{id:'double-tap',n:'double-tap',cat:'interaction',fn:()=>{playClick();setTimeout(playClick,80)},c:'#111',d:'Double tap'},
{id:'ripple',n:'ripple',cat:'interaction',fn:()=>{tone(800,'sine',.08,.003,.01,.1,.06,.03);setTimeout(()=>tone(600,'sine',.06,.005,.02,.15,.08,.04),40);setTimeout(()=>tone(400,'sine',.04,.008,.03,.2,.1,.05),100)},c:'#4f8cff',d:'Ripple expand'},
{id:'bounce',n:'bounce',cat:'interaction',fn:()=>{tone(300,'sine',.2,.003,.01,.1,.04,.02);setTimeout(()=>tone(400,'sine',.12,.003,.01,.08,.04,.02),60);setTimeout(()=>tone(350,'sine',.06,.003,.01,.06,.04,.02),100)},c:'#ffbb26',d:'Elastic bounce'},
{id:'snap',n:'snap',cat:'interaction',fn:()=>playBandNoise(.4,.01,4000,12),c:'#ff6b5f',d:'Finger snap'},
{id:'slide',n:'slide',cat:'interaction',fn:()=>playSweepNoise(.12,.15,800,2000),c:'#9f4fff',d:'Slide gesture'},
// Expanded notification
{id:'email',n:'email',cat:'notification',fn:()=>{tone(698,'sine',.12,.008,.02,.3,.12,.06);setTimeout(()=>tone(880,'sine',.1,.008,.02,.2,.12,.06),70)},c:'#4f8cff',d:'Email received'},
{id:'sms',n:'sms',cat:'notification',fn:()=>{tone(1047,'sine',.15,.005,.015,.2,.08,.03);setTimeout(()=>tone(1319,'sine',.12,.005,.015,.15,.08,.03),50)},c:'#00ca48',d:'Text message'},
{id:'badge',n:'badge',cat:'notification',fn:()=>tone(1500,'sine',.08,.003,.01,.15,.06,.02),c:'#ff6b5f',d:'Badge count'},
{id:'toast',n:'toast',cat:'notification',fn:()=>{tone(600,'sine',.1,.008,.02,.25,.1,.05);setTimeout(()=>tone(750,'sine',.08,.008,.02,.2,.1,.05),60)},c:'#d9a066',d:'Toast popup'},
// Expanded system
{id:'upload',n:'upload',cat:'system',fn:()=>chord([600,700,800],'sine',.1,.01,.02,.3,.1,.05,80),c:'#23ad91',d:'Upload start'},
{id:'boot',n:'boot',cat:'system',fn:()=>chord([200,400,600,800],'sine',.1,.01,.03,.3,.15,.06,80),c:'#64c6ff',d:'System boot'},
{id:'shutdown',n:'shutdown',cat:'system',fn:()=>{[800,600,400,200].forEach((f,i)=>setTimeout(()=>tone(f,'sine',.1*(1-i*.06),.01,.03,.3,.15,.06),i*80))},c:'#7e7e7d',d:'System shutdown'},
{id:'sync',n:'sync',cat:'system',fn:()=>{tone(500,'sine',.1,.005,.01,.2,.05,.02);setTimeout(()=>tone(700,'sine',.08,.005,.01,.15,.05,.02),100);setTimeout(()=>tone(500,'sine',.06,.005,.01,.1,.05,.02),200)},c:'#00b2ff',d:'Sync pulse'},
// Expanded form
{id:'autocomplete',n:'autocomplete',cat:'form',fn:()=>chord([800,1000,1200],'sine',.06,.003,.01,.1,.04,.02,30),c:'#4f8cff',d:'Autocomplete match'},
{id:'dropdown-open',n:'dropdown-open',cat:'form',fn:()=>tone(600,'sine',.1,.005,.02,.2,.08,.03),c:'#64c6ff',d:'Dropdown open'},
{id:'dropdown-close',n:'dropdown-close',cat:'form',fn:()=>tone(500,'sine',.08,.005,.02,.15,.06,.03),c:'#7e7e7d',d:'Dropdown close'},
{id:'slider-tick',n:'slider-tick',cat:'form',fn:()=>tone(1200,'sine',.04,.002,.005,.1,.02,.01),c:'#00ca48',d:'Slider increment'},
{id:'clear',n:'clear',cat:'form',fn:()=>playSweepNoise(.12,.06,3000,500),c:'#ff6b5f',d:'Clear field'},
{id:'submit',n:'submit',cat:'form',fn:()=>chord([523,659,784],'sine',.2,.008,.03,.3,.12,.06,50),c:'#00c978',d:'Form submit'},
// Expanded media
{id:'rewind',n:'rewind',cat:'media',fn:()=>playSweepNoise(.15,.1,1000,4000),c:'#9f4fff',d:'Rewind'},
{id:'fast-forward',n:'fast-forward',cat:'media',fn:()=>playSweepNoise(.15,.1,4000,1000),c:'#4f8cff',d:'Fast forward'},
{id:'shuffle',n:'shuffle',cat:'media',fn:()=>{const r=()=>tone(600+Math.random()*600,'sine',.06,.003,.01,.1,.03,.02);r();setTimeout(r,40);setTimeout(r,80)},c:'#ffbb26',d:'Shuffle toggle'},
{id:'seek',n:'seek',cat:'media',fn:()=>playSweepNoise(.1,.06,2000,3000),c:'#64c6ff',d:'Seek position'},
// Expanded gesture
{id:'spread',n:'spread',cat:'gesture',fn:()=>{tone(300,'sine',.06,.005,.01,.08,.04,.02);setTimeout(()=>tone(500,'sine',.08,.005,.01,.12,.04,.02),40);setTimeout(()=>tone(700,'sine',.06,.005,.01,.08,.04,.02),80)},c:'#00b2ff',d:'Spread apart'},
{id:'rotate',n:'rotate',cat:'gesture',fn:()=>{for(let i=0;i<5;i++)setTimeout(()=>tone(400+i*50,'sine',.04,.003,.008,.1,.03,.01),i*30)},c:'#d48f00',d:'Rotate gesture'},
{id:'flick',n:'flick',cat:'gesture',fn:()=>playSweepNoise(.2,.06,6000,800),c:'#ff58ae',d:'Quick flick'},
{id:'shake',n:'shake',cat:'gesture',fn:()=>[0,40,80,120].forEach((d,i)=>setTimeout(()=>tone(i%2?250:200,'sine',.06,.003,.01,.1,.03,.02),d)),c:'#ff6b5f',d:'Device shake'},
{id:'force-touch',n:'force-touch',cat:'gesture',fn:()=>{tone(200,'sine',.15,.01,.02,.3,.08,.04);setTimeout(()=>tone(300,'sine',.2,.01,.02,.4,.1,.06),80)},c:'#111',d:'Force press'},
{id:'edge-swipe',n:'edge-swipe',cat:'gesture',fn:()=>playSweepNoise(.18,.12,500,5000),c:'#9f4fff',d:'Edge swipe'},
// ── NAVIGATION (14) ──
{id:'page-in',n:'page-in',cat:'navigation',fn:()=>{tone(400,'sine',.12,.01,.02,.3,.1,.05);setTimeout(()=>tone(600,'sine',.1,.01,.02,.25,.1,.05),60)},c:'#4f8cff',d:'Page transition in'},
{id:'page-out',n:'page-out',cat:'navigation',fn:()=>{tone(600,'sine',.1,.01,.02,.25,.1,.05);setTimeout(()=>tone(400,'sine',.08,.01,.02,.2,.1,.05),60)},c:'#7e7e7d',d:'Page transition out'},
{id:'tab-switch',n:'tab-switch',cat:'navigation',fn:()=>tone(800,'sine',.08,.003,.01,.15,.05,.02),c:'#64c6ff',d:'Tab switch'},
{id:'tab-next',n:'tab-next',cat:'navigation',fn:()=>{tone(700,'sine',.07,.003,.01,.15,.05,.02);setTimeout(()=>tone(900,'sine',.06,.003,.01,.1,.05,.02),40)},c:'#00b2ff',d:'Next tab'},
{id:'tab-prev',n:'tab-prev',cat:'navigation',fn:()=>{tone(900,'sine',.06,.003,.01,.1,.05,.02);setTimeout(()=>tone(700,'sine',.07,.003,.01,.15,.05,.02),40)},c:'#9f4fff',d:'Previous tab'},
{id:'sidebar-open',n:'sidebar-open',cat:'navigation',fn:()=>tone(350,'sine',.12,.01,.02,.3,.1,.06),c:'#00c978',d:'Sidebar open'},
{id:'sidebar-close',n:'sidebar-close',cat:'navigation',fn:()=>tone(450,'sine',.1,.01,.02,.2,.08,.04),c:'#7e7e7d',d:'Sidebar close'},
{id:'breadcrumb',n:'breadcrumb',cat:'navigation',fn:()=>tone(1000,'sine',.05,.003,.01,.1,.04,.02),c:'#d9a066',d:'Breadcrumb click'},
{id:'back',n:'back',cat:'navigation',fn:()=>{tone(500,'sine',.1,.005,.015,.2,.08,.03);setTimeout(()=>tone(400,'sine',.08,.005,.015,.15,.08,.03),50)},c:'#ff6b5f',d:'Navigate back'},
{id:'forward',n:'forward',cat:'navigation',fn:()=>{tone(400,'sine',.08,.005,.015,.15,.08,.03);setTimeout(()=>tone(500,'sine',.1,.005,.015,.2,.08,.03),50)},c:'#00ca48',d:'Navigate forward'},
{id:'home',n:'home',cat:'navigation',fn:()=>chord([523,659,784],'sine',.1,.008,.02,.3,.1,.05,40),c:'#ffbb26',d:'Home'},
{id:'menu',n:'menu',cat:'navigation',fn:()=>{tone(600,'sine',.08,.005,.01,.15,.05,.02);setTimeout(()=>tone(700,'sine',.06,.005,.01,.1,.05,.02),30);setTimeout(()=>tone(800,'sine',.04,.005,.01,.08,.05,.02),60)},c:'#4f8cff',d:'Menu open'},
{id:'modal-open',n:'modal-open',cat:'navigation',fn:()=>{tone(400,'sine',.15,.01,.03,.35,.12,.06);setTimeout(()=>tone(600,'sine',.12,.01,.02,.25,.1,.05),80)},c:'#64c6ff',d:'Modal open'},
{id:'modal-close',n:'modal-close',cat:'navigation',fn:()=>{tone(500,'sine',.1,.01,.02,.2,.08,.04);setTimeout(()=>tone(350,'sine',.08,.01,.02,.15,.08,.04),60)},c:'#999',d:'Modal close'},
// ── COMMERCE (12) ──
{id:'cart-add',n:'cart-add',cat:'commerce',fn:()=>chord([523,659,784],'sine',.15,.006,.025,.3,.1,.05,45),c:'#00c978',d:'Add to cart'},
{id:'cart-remove',n:'cart-remove',cat:'commerce',fn:()=>{[784,659,523].forEach((f,i)=>setTimeout(()=>tone(f,'sine',.1*(1-i*.06),.006,.025,.2,.1,.05),i*45))},c:'#ff6b5f',d:'Remove from cart'},
{id:'checkout',n:'checkout',cat:'commerce',fn:()=>chord([523,659,784,1047],'sine',.18,.008,.035,.3,.15,.08,50),c:'#00ca48',d:'Checkout'},
{id:'payment',n:'payment',cat:'commerce',fn:()=>chord([440,554,659,880],'sine',.2,.006,.03,.35,.15,.08,40),c:'#4f8cff',d:'Payment processed'},
{id:'coupon',n:'coupon',cat:'commerce',fn:()=>chord([1047,1319,1568],'sine',.1,.004,.015,.15,.08,.03,35),c:'#ffbb26',d:'Coupon applied'},
{id:'receipt',n:'receipt',cat:'commerce',fn:()=>{playNoise(.08,.06,2000);setTimeout(()=>tone(800,'sine',.06,.003,.01,.1,.04,.02),60)},c:'#d9a066',d:'Receipt print'},
{id:'refund',n:'refund',cat:'commerce',fn:()=>{[659,523,440].forEach((f,i)=>setTimeout(()=>tone(f,'sine',.1*(1-i*.06),.008,.02,.25,.1,.05),i*50))},c:'#9f4fff',d:'Refund issued'},
{id:'wishlist',n:'wishlist',cat:'commerce',fn:()=>{tone(880,'sine',.1,.005,.015,.2,.1,.04);setTimeout(()=>tone(1108,'sine',.08,.005,.015,.15,.1,.04),60)},c:'#ff58ae',d:'Add to wishlist'},
{id:'shipping',n:'shipping',cat:'commerce',fn:()=>chord([400,500,600,700],'sine',.08,.008,.02,.2,.1,.04,60),c:'#23ad91',d:'Shipping update'},
{id:'order-complete',n:'order-complete',cat:'commerce',fn:()=>chord([523,659,784,1047,1319],'sine',.16,.006,.03,.3,.15,.08,45),c:'#00c978',d:'Order complete'},
{id:'price-up',n:'price-up',cat:'commerce',fn:()=>{tone(600,'sine',.08,.005,.01,.15,.05,.02);setTimeout(()=>tone(800,'sine',.06,.005,.01,.1,.05,.02),40)},c:'#d48f00',d:'Price increase'},
{id:'price-down',n:'price-down',cat:'commerce',fn:()=>{tone(800,'sine',.06,.005,.01,.1,.05,.02);setTimeout(()=>tone(600,'sine',.08,.005,.01,.15,.05,.02),40)},c:'#00ca48',d:'Price decrease'},
// ── SOCIAL (12) ──
{id:'like',n:'like',cat:'social',fn:()=>{tone(880,'sine',.15,.005,.02,.25,.1,.04);setTimeout(()=>tone(1108,'sine',.12,.005,.02,.2,.1,.04),50)},c:'#ff6b5f',d:'Like'},
{id:'unlike',n:'unlike',cat:'social',fn:()=>{tone(1108,'sine',.08,.005,.02,.15,.08,.03);setTimeout(()=>tone(880,'sine',.06,.005,.02,.1,.08,.03),50)},c:'#999',d:'Unlike'},
{id:'follow',n:'follow',cat:'social',fn:()=>chord([659,784,1047],'sine',.12,.006,.02,.25,.1,.04,45),c:'#4f8cff',d:'Follow'},
{id:'unfollow',n:'unfollow',cat:'social',fn:()=>{[1047,784,659].forEach((f,i)=>setTimeout(()=>tone(f,'sine',.08*(1-i*.06),.006,.02,.15,.08,.04),i*45))},c:'#7e7e7d',d:'Unfollow'},
{id:'share',n:'share',cat:'social',fn:()=>{tone(700,'sine',.1,.005,.015,.2,.08,.04);setTimeout(()=>tone(900,'sine',.12,.005,.015,.25,.1,.04),50);setTimeout(()=>tone(1100,'sine',.08,.005,.015,.15,.08,.04),100)},c:'#00b2ff',d:'Share'},
{id:'comment',n:'comment',cat:'social',fn:()=>{tone(600,'sine',.08,.005,.015,.2,.08,.03);setTimeout(()=>tone(750,'sine',.06,.005,.015,.15,.08,.03),50)},c:'#ffbb26',d:'New comment'},
{id:'react',n:'react',cat:'social',fn:()=>tone(1200,'sine',.12,.003,.01,.15,.06,.03),c:'#ff58ae',d:'Reaction'},
{id:'bookmark',n:'bookmark',cat:'social',fn:()=>{tone(500,'sine',.1,.005,.02,.25,.1,.05);setTimeout(()=>tone(700,'sine',.12,.005,.02,.3,.1,.05),60)},c:'#d48f00',d:'Bookmark saved'},
{id:'repost',n:'repost',cat:'social',fn:()=>{playSweepNoise(.1,.08,800,3000);setTimeout(()=>tone(800,'sine',.08,.005,.015,.15,.06,.03),100)},c:'#00c978',d:'Repost'},
{id:'block',n:'block',cat:'social',fn:()=>{tone(200,'square',.1,.005,.02,.15,.08,.03);setTimeout(()=>tone(150,'square',.08,.005,.02,.1,.08,.03),80)},c:'#ff6b5f',d:'Block user'},
{id:'emoji',n:'emoji',cat:'social',fn:()=>tone(1400,'sine',.08,.003,.01,.1,.04,.02),c:'#ffbb26',d:'Emoji picker'},
{id:'clap',n:'clap',cat:'social',fn:()=>{playBandNoise(.25,.03,3000,6);setTimeout(()=>playBandNoise(.2,.025,2500,5),70);setTimeout(()=>playBandNoise(.15,.02,2000,4),130)},c:'#d9a066',d:'Clap reaction'},
// ── AI (12) ──
{id:'ai-thinking',n:'ai-thinking',cat:'ai',fn:()=>[0,120,240].forEach((d,i)=>setTimeout(()=>tone(500+i*80,'sine',.05,.008,.015,.15,.08,.03),d)),c:'#9f4fff',d:'AI thinking'},
{id:'ai-streaming',n:'ai-streaming',cat:'ai',fn:()=>{for(let i=0;i<6;i++)setTimeout(()=>tone(600+Math.random()*200,'sine',.03,.002,.006,.08,.02,.01),i*50)},c:'#4f8cff',d:'Token streaming'},
{id:'ai-generating',n:'ai-generating',cat:'ai',fn:()=>{tone(400,'sine',.06,.01,.02,.2,.08,.04);setTimeout(()=>tone(500,'sine',.05,.01,.02,.15,.08,.04),80);setTimeout(()=>tone(600,'sine',.04,.01,.02,.1,.08,.04),160)},c:'#00b2ff',d:'Generating'},
{id:'ai-complete',n:'ai-complete',cat:'ai',fn:()=>chord([523,659,784,1047],'sine',.12,.006,.025,.3,.12,.06,45),c:'#00c978',d:'Generation complete'},
{id:'ai-error',n:'ai-error',cat:'ai',fn:()=>{tone(300,'sine',.08,.01,.03,.2,.1,.06);setTimeout(()=>tone(250,'sine',.06,.01,.03,.15,.1,.06),100)},c:'#ff6b5f',d:'AI error'},
{id:'ai-typing',n:'ai-typing',cat:'ai',fn:()=>tone(900+Math.random()*200,'sine',.04,.002,.005,.08,.02,.01),c:'#64c6ff',d:'AI typing indicator'},
{id:'ai-response',n:'ai-response',cat:'ai',fn:()=>{tone(600,'sine',.08,.008,.02,.25,.1,.05);setTimeout(()=>tone(800,'sine',.06,.008,.02,.2,.1,.05),70)},c:'#23ad91',d:'AI response ready'},
{id:'ai-cancel',n:'ai-cancel',cat:'ai',fn:()=>{tone(400,'triangle',.08,.005,.02,.15,.08,.04);setTimeout(()=>tone(300,'triangle',.06,.005,.02,.1,.08,.04),60)},c:'#7e7e7d',d:'Cancel generation'},
{id:'ai-suggest',n:'ai-suggest',cat:'ai',fn:()=>tone(1100,'sine',.06,.005,.015,.15,.08,.03),c:'#ffbb26',d:'AI suggestion'},
{id:'ai-accept',n:'ai-accept',cat:'ai',fn:()=>{tone(700,'sine',.1,.005,.02,.25,.1,.04);setTimeout(()=>tone(900,'sine',.08,.005,.02,.2,.1,.04),50)},c:'#00ca48',d:'Accept suggestion'},
{id:'ai-reject',n:'ai-reject',cat:'ai',fn:()=>{[600,450].forEach((f,i)=>setTimeout(()=>tone(f,'sine',.08*(1-i*.06),.005,.02,.15,.08,.04),i*60))},c:'#ff58ae',d:'Reject suggestion'},
{id:'ai-retry',n:'ai-retry',cat:'ai',fn:()=>{playSweepNoise(.1,.06,1000,3000);setTimeout(()=>tone(700,'sine',.06,.005,.01,.15,.06,.03),80)},c:'#d48f00',d:'Retry generation'},
// ── GAMING (14) ──
{id:'score',n:'score',cat:'gaming',fn:()=>chord([659,784,1047],'sine',.15,.005,.02,.25,.1,.04,40),c:'#ffbb26',d:'Score point'},
{id:'level-up',n:'level-up',cat:'gaming',fn:()=>chord([392,523,659,784,1047,1319],'sine',.14,.005,.02,.25,.12,.05,40),c:'#00c978',d:'Level up'},
{id:'coin',n:'coin',cat:'gaming',fn:()=>{tone(1319,'sine',.2,.003,.01,.1,.06,.02);setTimeout(()=>tone(1760,'sine',.15,.003,.01,.08,.06,.02),50)},c:'#d48f00',d:'Coin collected'},
{id:'powerup',n:'powerup',cat:'gaming',fn:()=>{for(let i=0;i<6;i++)setTimeout(()=>tone(400+i*100,'sine',.12-i*.015,.005,.01,.15,.06,.02),i*35)},c:'#9f4fff',d:'Power up'},
{id:'damage',n:'damage',cat:'gaming',fn:()=>{playBandNoise(.3,.04,1500,3);setTimeout(()=>tone(150,'sawtooth',.1,.005,.02,.15,.08,.04),20)},c:'#ff6b5f',d:'Take damage'},
{id:'heal',n:'heal',cat:'gaming',fn:()=>chord([523,659,784],'sine',.1,.01,.03,.35,.15,.08,60),c:'#00ca48',d:'Heal'},
{id:'countdown',n:'countdown',cat:'gaming',fn:()=>tone(800,'square',.12,.003,.01,.1,.04,.02),c:'#ff6b5f',d:'Countdown tick'},
{id:'game-over',n:'game-over',cat:'gaming',fn:()=>{[400,350,300,250,200].forEach((f,i)=>setTimeout(()=>tone(f,'sine',.12*(1-i*.06),.01,.03,.25,.15,.08),i*100))},c:'#999',d:'Game over'},
{id:'victory',n:'victory',cat:'gaming',fn:()=>chord([523,659,784,1047,1319,1568],'sine',.15,.005,.025,.3,.15,.06,45),c:'#00c978',d:'Victory'},
{id:'bonus',n:'bonus',cat:'gaming',fn:()=>chord([1047,1319,1568],'sine',.12,.004,.015,.15,.08,.03,30),c:'#ffbb26',d:'Bonus item'},
{id:'combo',n:'combo',cat:'gaming',fn:()=>{for(let i=0;i<4;i++)setTimeout(()=>tone(800+i*200,'sine',.1-i*.02,.003,.01,.1,.04,.02),i*40)},c:'#4f8cff',d:'Combo chain'},
{id:'shield',n:'shield',cat:'gaming',fn:()=>tone(300,'sine',.15,.01,.03,.4,.15,.08),c:'#64c6ff',d:'Shield active'},
{id:'xp',n:'xp',cat:'gaming',fn:()=>{tone(1000,'sine',.08,.003,.01,.1,.05,.02);setTimeout(()=>tone(1200,'sine',.06,.003,.01,.08,.05,.02),40)},c:'#23ad91',d:'XP gained'},
{id:'jump',n:'jump',cat:'gaming',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(200,t);o.frequency.exponentialRampToValueAtTime(800,t+.1);g.gain.setValueAtTime(.15*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+.15);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+.2)},c:'#ff58ae',d:'Jump'},
// ── STATUS (10) ──
{id:'online',n:'online',cat:'status',fn:()=>chord([523,659,784],'sine',.1,.008,.02,.3,.1,.05,50),c:'#00c978',d:'Online'},
{id:'offline',n:'offline',cat:'status',fn:()=>{[784,659,523].forEach((f,i)=>setTimeout(()=>tone(f,'sine',.08*(1-i*.06),.008,.02,.2,.1,.05),i*50))},c:'#ff6b5f',d:'Offline'},
{id:'away',n:'away',cat:'status',fn:()=>tone(600,'sine',.06,.01,.03,.2,.12,.06),c:'#d9a066',d:'Away'},
{id:'busy',n:'busy',cat:'status',fn:()=>{tone(400,'square',.06,.005,.01,.1,.05,.02);setTimeout(()=>tone(400,'square',.05,.005,.01,.08,.05,.02),120)},c:'#ff6b5f',d:'Busy'},
{id:'connecting',n:'connecting',cat:'status',fn:()=>[0,150,300].forEach((d,i)=>setTimeout(()=>tone(500+i*50,'sine',.05,.005,.01,.1,.04,.02),d)),c:'#4f8cff',d:'Connecting'},
{id:'connected',n:'connected',cat:'status',fn:()=>chord([523,784],'sine',.12,.005,.02,.25,.1,.04,40),c:'#00ca48',d:'Connected'},
{id:'disconnected',n:'disconnected',cat:'status',fn:()=>{[784,523].forEach((f,i)=>setTimeout(()=>tone(f,'sine',.1*(1-i*.06),.005,.02,.2,.08,.04),i*60))},c:'#999',d:'Disconnected'},
{id:'syncing',n:'syncing',cat:'status',fn:()=>{const s=()=>{tone(700,'sine',.04,.003,.008,.08,.03,.01);setTimeout(()=>tone(900,'sine',.03,.003,.008,.06,.03,.01),40)};s();setTimeout(s,200);setTimeout(s,400)},c:'#00b2ff',d:'Syncing'},
{id:'permission',n:'permission',cat:'status',fn:()=>tone(880,'sine',.1,.005,.02,.25,.1,.05),c:'#ffbb26',d:'Permission request'},
{id:'clipboard',n:'clipboard',cat:'status',fn:()=>{playBandNoise(.15,.02,3000,8);setTimeout(()=>tone(1000,'sine',.06,.003,.01,.1,.04,.02),20)},c:'#64c6ff',d:'Clipboard action'},
// ── AMBIENT (12) ──
{id:'ambient-hum',n:'ambient-hum',cat:'ambient',fn:()=>{initAudio();const t=now();[100,200,300].forEach(f=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.03*globalVol,t+.1);g.gain.setValueAtTime(.03*globalVol,t+.4);g.gain.linearRampToValueAtTime(0,t+.6);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+.7)})},c:'#7e7e7d',d:'Low hum'},
{id:'ambient-drone',n:'ambient-drone',cat:'ambient',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(80,t);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.06*globalVol,t+.15);g.gain.setValueAtTime(.06*globalVol,t+.5);g.gain.linearRampToValueAtTime(0,t+.8);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+.9)},c:'#999',d:'Deep drone'},
{id:'ambient-pulse',n:'ambient-pulse',cat:'ambient',fn:()=>[0,200,400].forEach(d=>setTimeout(()=>tone(200,'sine',.04,.02,.04,.3,.1,.04),d)),c:'#4f8cff',d:'Rhythmic pulse'},
{id:'ambient-breath',n:'ambient-breath',cat:'ambient',fn:()=>playSweepNoise(.06,.4,200,800),c:'#23ad91',d:'Soft breath'},
{id:'ambient-static',n:'ambient-static',cat:'ambient',fn:()=>playNoise(.04,.3,1500),c:'#d9a066',d:'White static'},
{id:'ambient-wind',n:'ambient-wind',cat:'ambient',fn:()=>playSweepNoise(.05,.5,300,1200),c:'#64c6ff',d:'Wind gust'},
{id:'ambient-rain',n:'ambient-rain',cat:'ambient',fn:()=>{for(let i=0;i<8;i++)setTimeout(()=>playBandNoise(.03,.08,2000+Math.random()*2000,2),i*40+Math.random()*30)},c:'#00b2ff',d:'Rain drops'},
{id:'ambient-ocean',n:'ambient-ocean',cat:'ambient',fn:()=>{playSweepNoise(.04,.8,200,600);setTimeout(()=>playSweepNoise(.03,.6,400,200),400)},c:'#4f8cff',d:'Ocean wave'},
{id:'ambient-crickets',n:'ambient-crickets',cat:'ambient',fn:()=>{for(let i=0;i<5;i++)setTimeout(()=>tone(4000+Math.random()*1000,'sine',.02,.001,.005,.05,.02,.01),i*60+Math.random()*40)},c:'#00ca48',d:'Night crickets'},
{id:'ambient-chatter',n:'ambient-chatter',cat:'ambient',fn:()=>{for(let i=0;i<6;i++)setTimeout(()=>playBandNoise(.02,.06,800+Math.random()*600,3),i*50+Math.random()*30)},c:'#d48f00',d:'Distant chatter'},
{id:'ambient-tick',n:'ambient-tick',cat:'ambient',fn:()=>playBandNoise(.08,.008,4000,15),c:'#111',d:'Clock tick'},
{id:'ambient-glow',n:'ambient-glow',cat:'ambient',fn:()=>{initAudio();const t=now();[440,554,659].forEach((f,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.04*globalVol,t+.1+i*.05);g.gain.setValueAtTime(.04*globalVol,t+.3);g.gain.linearRampToValueAtTime(0,t+.5+i*.05);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+.6+i*.05)})},c:'#ffbb26',d:'Warm glow'}
,
{id:'ok-soft-tone',n:'ok-soft-tone',cat:'feedback',fn:()=>tone(523,'sine',0.05,0.002,0.01,0.1,0.03,0.02),c:'#00c978',d:'ok soft tone'},
{id:'done-soft-ping',n:'done-soft-ping',cat:'feedback',fn:()=>{tone(659,'triangle',0.07,0.005,0.015,0.15,0.05,0.04);setTimeout(()=>tone(784,'square',0.06,0.005,0.015,0.12,0.05,0.04),41)},c:'#00c978',d:'done soft duo'},
{id:'ready-soft-chime',n:'ready-soft-chime',cat:'feedback',fn:()=>{[784,1047,880].forEach((f,i)=>setTimeout(()=>tone(f,'square',0.06,0.008,0.02,0.2,0.07,0.06),i*37))},c:'#00c978',d:'ready soft arpeggio'},
{id:'wait-soft-bloop',n:'wait-soft-bloop',cat:'feedback',fn:()=>chord([1047,880,440,392],'sawtooth',0.11,0.011,0.025,0.25,0.09,0.08,48),c:'#00c978',d:'wait soft chord'},
{id:'hold-soft-tick',n:'hold-soft-tick',cat:'feedback',fn:()=>playNoise(0.13,0.13,3000),c:'#00c978',d:'hold soft noise'},
{id:'go-soft-tap',n:'go-soft-tap',cat:'feedback',fn:()=>playBandNoise(0.15,0.08,2000,7),c:'#00c978',d:'go soft filtered'},
{id:'stop-soft-pulse',n:'stop-soft-pulse',cat:'feedback',fn:()=>playSweepNoise(0.17,0.08,2900,5900),c:'#00c978',d:'stop soft sweep up'},
{id:'retry-soft-drone',n:'retry-soft-drone',cat:'feedback',fn:()=>playSweepNoise(0.19,0.1,6500,900),c:'#00c978',d:'retry soft sweep down'},
{id:'skip-soft-sweep',n:'skip-soft-sweep',cat:'feedback',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(1000,t);o.frequency.exponentialRampToValueAtTime(1200,t+0.25);g.gain.setValueAtTime(0.21*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+0.3);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.35)},c:'#00c978',d:'skip soft glide'},
{id:'pass-soft-swell',n:'pass-soft-swell',cat:'feedback',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),m=ctx.createOscillator(),mg=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(1200,t);m.type='sine';m.frequency.setValueAtTime(3000.0,t);mg.gain.setValueAtTime(3600,t);m.connect(mg);mg.connect(o.frequency);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.23*globalVol,t+0.014);g.gain.exponentialRampToValueAtTime(.001,t+0.7);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.75);m.start(t);m.stop(t+0.75)},c:'#00c978',d:'pass soft bell'},
{id:'fail-soft-fade',n:'fail-soft-fade',cat:'feedback',fn:()=>{for(let i=0;i<5;i++)setTimeout(()=>tone(1023,'square',0.0,0.002,0.02,0.1,0.11,0.06),i*60)},c:'#00c978',d:'fail soft rhythm'},
{id:'check-soft-rise',n:'check-soft-rise',cat:'feedback',fn:()=>{const f=659+Math.random()*211;tone(f,'sawtooth',0.07,0.005,0.025,0.15,0.13,0.08)},c:'#00c978',d:'check soft random'},
{id:'cross-soft-drop',n:'cross-soft-drop',cat:'feedback',fn:()=>tone(784,'sine',0.09,0.008,0.03,0.2,0.03,0.02),c:'#00c978',d:'cross soft drop'},
{id:'star-soft-hit',n:'star-soft-hit',cat:'feedback',fn:()=>{tone(1047,'triangle',0.11,0.011,0.035,0.25,0.05,0.04);setTimeout(()=>tone(880,'square',0.09,0.011,0.035,0.2,0.05,0.04),53)},c:'#00c978',d:'star soft duo'},
{id:'heart-soft-knock',n:'heart-soft-knock',cat:'feedback',fn:()=>{[880,440,392].forEach((f,i)=>setTimeout(()=>tone(f,'square',-0.14,0.014,0.04,0.3,0.07,0.06),i*49))},c:'#00c978',d:'heart soft arpeggio'},
{id:'flag-soft-ring',n:'flag-soft-ring',cat:'feedback',fn:()=>chord([440,392,698,1000],'sawtooth',0.15,0.002,0.045,0.1,0.09,0.08,60),c:'#00c978',d:'flag soft chord'},
{id:'pin-soft-hum',n:'pin-soft-hum',cat:'feedback',fn:()=>playNoise(0.17,0.17,4000),c:'#00c978',d:'pin soft noise'},
{id:'clip-soft-buzz',n:'clip-soft-buzz',cat:'feedback',fn:()=>playBandNoise(0.19,0.04,1100,3),c:'#00c978',d:'clip soft filtered'},
{id:'lock-soft-whir',n:'lock-soft-whir',cat:'feedback',fn:()=>playSweepNoise(0.21,0.08,3700,8700),c:'#00c978',d:'lock soft sweep up'},
{id:'key-soft-fizz',n:'key-soft-fizz',cat:'feedback',fn:()=>playSweepNoise(0.23,0.1,4500,1300),c:'#00c978',d:'key soft sweep down'},
{id:'shield-soft-snap',n:'shield-soft-snap',cat:'feedback',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(523,t);o.frequency.exponentialRampToValueAtTime(659,t+0.1);g.gain.setValueAtTime(0.05*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+0.15);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.2)},c:'#00c978',d:'shield soft glide'},
{id:'award-soft-crackle',n:'award-soft-crackle',cat:'feedback',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),m=ctx.createOscillator(),mg=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(659,t);m.type='sine';m.frequency.setValueAtTime(1648.0,t);mg.gain.setValueAtTime(1977,t);m.connect(mg);mg.connect(o.frequency);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.07*globalVol,t+0.005);g.gain.exponentialRampToValueAtTime(.001,t+0.4);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.45);m.start(t);m.stop(t+0.45)},c:'#00c978',d:'award soft bell'},
{id:'trophy-soft-pop',n:'trophy-soft-pop',cat:'feedback',fn:()=>{for(let i=0;i<5;i++)setTimeout(()=>tone(1884,'square',-0.11,0.008,0.04,0.2,0.11,0.06),i*72)},c:'#00c978',d:'trophy soft rhythm'},
{id:'medal-soft-click',n:'medal-soft-click',cat:'feedback',fn:()=>{const f=1047+Math.random()*223;tone(f,'sawtooth',0.11,0.011,0.045,0.25,0.13,0.08)},c:'#00c978',d:'medal soft random'},
{id:'crown-soft-beep',n:'crown-soft-beep',cat:'feedback',fn:()=>tone(880,'sine',0.13,0.014,0.01,0.3,0.03,0.02),c:'#00c978',d:'crown soft beep'},
{id:'gem-soft-boop',n:'gem-soft-boop',cat:'feedback',fn:()=>{tone(440,'triangle',0.15,0.002,0.015,0.1,0.05,0.04);setTimeout(()=>tone(392,'square',0.12,0.002,0.015,0.08,0.05,0.04),65)},c:'#00c978',d:'gem soft duo'},
{id:'bolt-soft-blip',n:'bolt-soft-blip',cat:'feedback',fn:()=>{[392,698,1000].forEach((f,i)=>setTimeout(()=>tone(f,'square',-0.49,0.005,0.02,0.15,0.07,0.06),i*41))},c:'#00c978',d:'bolt soft arpeggio'},
{id:'fire-soft-bleep',n:'fire-soft-bleep',cat:'feedback',fn:()=>chord([698,1000,1200,523],'sawtooth',0.19,0.008,0.025,0.2,0.09,0.08,72),c:'#00c978',d:'fire soft chord'},
{id:'ice-soft-warble',n:'ice-soft-warble',cat:'feedback',fn:()=>playNoise(0.21,0.21,5000),c:'#00c978',d:'ice soft noise'},
{id:'wave-soft-trill',n:'wave-soft-trill',cat:'feedback',fn:()=>playBandNoise(0.23,0.08,4700,7),c:'#00c978',d:'wave soft filtered'},
{id:'tap-soft-ping',n:'tap-soft-ping',cat:'interaction',fn:()=>tone(800,'sine',0.05,0.002,0.01,0.1,0.03,0.02),c:'#64c6ff',d:'tap soft ping'},
{id:'press-soft-chime',n:'press-soft-chime',cat:'interaction',fn:()=>{tone(1000,'triangle',0.07,0.005,0.015,0.15,0.05,0.04);setTimeout(()=>tone(1200,'square',0.06,0.005,0.015,0.12,0.05,0.04),41)},c:'#64c6ff',d:'press soft duo'},
{id:'hold-soft-bloop',n:'hold-soft-bloop',cat:'interaction',fn:()=>{[1200,600,400].forEach((f,i)=>setTimeout(()=>tone(f,'square',0.06,0.008,0.02,0.2,0.07,0.06),i*37))},c:'#64c6ff',d:'hold soft arpeggio'},
{id:'release-soft-tick',n:'release-soft-tick',cat:'interaction',fn:()=>chord([600,400,1500,2000],'sawtooth',0.11,0.011,0.025,0.25,0.09,0.08,48),c:'#64c6ff',d:'release soft chord'},
{id:'drag-soft-tap',n:'drag-soft-tap',cat:'interaction',fn:()=>playNoise(0.13,0.13,3000),c:'#64c6ff',d:'drag soft noise'},
{id:'flick-soft-pulse',n:'flick-soft-pulse',cat:'interaction',fn:()=>playBandNoise(0.15,0.08,2000,7),c:'#64c6ff',d:'flick soft filtered'},
{id:'swipe-soft-drone',n:'swipe-soft-drone',cat:'interaction',fn:()=>playSweepNoise(0.17,0.08,2900,5900),c:'#64c6ff',d:'swipe soft sweep up'},
{id:'pinch-soft-sweep',n:'pinch-soft-sweep',cat:'interaction',fn:()=>playSweepNoise(0.19,0.1,6500,900),c:'#64c6ff',d:'pinch soft sweep down'},
{id:'spread-soft-swell',n:'spread-soft-swell',cat:'interaction',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(900,t);o.frequency.exponentialRampToValueAtTime(1100,t+0.25);g.gain.setValueAtTime(0.21*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+0.3);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.35)},c:'#64c6ff',d:'spread soft glide'},
{id:'twist-soft-fade',n:'twist-soft-fade',cat:'interaction',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),m=ctx.createOscillator(),mg=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(1100,t);m.type='sine';m.frequency.setValueAtTime(2750.0,t);mg.gain.setValueAtTime(3300,t);m.connect(mg);mg.connect(o.frequency);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.23*globalVol,t+0.014);g.gain.exponentialRampToValueAtTime(.001,t+0.7);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.75);m.start(t);m.stop(t+0.75)},c:'#64c6ff',d:'twist soft bell'},
{id:'tilt-soft-rise',n:'tilt-soft-rise',cat:'interaction',fn:()=>{for(let i=0;i<5;i++)setTimeout(()=>tone(1300,'square',0.0,0.002,0.02,0.1,0.11,0.06),i*60)},c:'#64c6ff',d:'tilt soft rhythm'},
{id:'shake-soft-drop',n:'shake-soft-drop',cat:'interaction',fn:()=>{const f=1000+Math.random()*211;tone(f,'sawtooth',0.07,0.005,0.025,0.15,0.13,0.08)},c:'#64c6ff',d:'shake soft random'},
{id:'rotate-soft-hit',n:'rotate-soft-hit',cat:'interaction',fn:()=>tone(1200,'sine',0.09,0.008,0.03,0.2,0.03,0.02),c:'#64c6ff',d:'rotate soft hit'},
{id:'orbit-soft-knock',n:'orbit-soft-knock',cat:'interaction',fn:()=>{tone(600,'triangle',0.11,0.011,0.035,0.25,0.05,0.04);setTimeout(()=>tone(400,'square',0.09,0.011,0.035,0.2,0.05,0.04),53)},c:'#64c6ff',d:'orbit soft duo'},
{id:'pan-soft-ring',n:'pan-soft-ring',cat:'interaction',fn:()=>{[400,1500,2000].forEach((f,i)=>setTimeout(()=>tone(f,'square',-0.14,0.014,0.04,0.3,0.07,0.06),i*49))},c:'#64c6ff',d:'pan soft arpeggio'},
{id:'scan-soft-hum',n:'scan-soft-hum',cat:'interaction',fn:()=>chord([1500,2000,300,900],'sawtooth',0.15,0.002,0.045,0.1,0.09,0.08,60),c:'#64c6ff',d:'scan soft chord'},
{id:'poke-soft-buzz',n:'poke-soft-buzz',cat:'interaction',fn:()=>playNoise(0.17,0.17,4000),c:'#64c6ff',d:'poke soft noise'},
{id:'prod-soft-whir',n:'prod-soft-whir',cat:'interaction',fn:()=>playBandNoise(0.19,0.04,1100,3),c:'#64c6ff',d:'prod soft filtered'},
{id:'nudge-soft-fizz',n:'nudge-soft-fizz',cat:'interaction',fn:()=>playSweepNoise(0.21,0.08,3700,8700),c:'#64c6ff',d:'nudge soft sweep up'},
{id:'bump-soft-snap',n:'bump-soft-snap',cat:'interaction',fn:()=>playSweepNoise(0.23,0.1,4500,1300),c:'#64c6ff',d:'bump soft sweep down'},
{id:'tickle-soft-crackle',n:'tickle-soft-crackle',cat:'interaction',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(800,t);o.frequency.exponentialRampToValueAtTime(1000,t+0.1);g.gain.setValueAtTime(0.05*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+0.15);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.2)},c:'#64c6ff',d:'tickle soft glide'},
{id:'stroke-soft-pop',n:'stroke-soft-pop',cat:'interaction',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),m=ctx.createOscillator(),mg=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(1000,t);m.type='sine';m.frequency.setValueAtTime(2500.0,t);mg.gain.setValueAtTime(3000,t);m.connect(mg);mg.connect(o.frequency);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.07*globalVol,t+0.005);g.gain.exponentialRampToValueAtTime(.001,t+0.4);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.45);m.start(t);m.stop(t+0.45)},c:'#64c6ff',d:'stroke soft bell'},
{id:'rub-soft-click',n:'rub-soft-click',cat:'interaction',fn:()=>{for(let i=0;i<5;i++)setTimeout(()=>tone(2300,'square',-0.11,0.008,0.04,0.2,0.11,0.06),i*72)},c:'#64c6ff',d:'rub soft rhythm'},
{id:'pat-soft-beep',n:'pat-soft-beep',cat:'interaction',fn:()=>{const f=600+Math.random()*223;tone(f,'sawtooth',0.11,0.011,0.045,0.25,0.13,0.08)},c:'#64c6ff',d:'pat soft random'},
{id:'slap-soft-boop',n:'slap-soft-boop',cat:'interaction',fn:()=>tone(400,'sine',0.13,0.014,0.01,0.3,0.03,0.02),c:'#64c6ff',d:'slap soft boop'},
{id:'jab-soft-blip',n:'jab-soft-blip',cat:'interaction',fn:()=>{tone(1500,'triangle',0.15,0.002,0.015,0.1,0.05,0.04);setTimeout(()=>tone(2000,'square',0.12,0.002,0.015,0.08,0.05,0.04),65)},c:'#64c6ff',d:'jab soft duo'},
{id:'alert-soft-chime',n:'alert-soft-chime',cat:'notification',fn:()=>tone(587,'sine',0.05,0.002,0.01,0.1,0.03,0.02),c:'#ffbb26',d:'alert soft chime'},
{id:'warn-soft-bloop',n:'warn-soft-bloop',cat:'notification',fn:()=>{tone(784,'triangle',0.07,0.005,0.015,0.15,0.05,0.04);setTimeout(()=>tone(880,'square',0.06,0.005,0.015,0.12,0.05,0.04),41)},c:'#ffbb26',d:'warn soft duo'},
{id:'info-soft-tick',n:'info-soft-tick',cat:'notification',fn:()=>{[880,1047,1319].forEach((f,i)=>setTimeout(()=>tone(f,'square',0.06,0.008,0.02,0.2,0.07,0.06),i*37))},c:'#ffbb26',d:'info soft arpeggio'},
{id:'news-soft-tap',n:'news-soft-tap',cat:'notification',fn:()=>chord([1047,1319,1760,523],'sawtooth',0.11,0.011,0.025,0.25,0.09,0.08,48),c:'#ffbb26',d:'news soft chord'},
{id:'update-soft-pulse',n:'update-soft-pulse',cat:'notification',fn:()=>playNoise(0.13,0.13,3000),c:'#ffbb26',d:'update soft noise'},
{id:'event-soft-drone',n:'event-soft-drone',cat:'notification',fn:()=>playBandNoise(0.15,0.08,2000,7),c:'#ffbb26',d:'event soft filtered'},
{id:'remind-soft-sweep',n:'remind-soft-sweep',cat:'notification',fn:()=>playSweepNoise(0.17,0.08,2900,5900),c:'#ffbb26',d:'remind soft sweep up'},
{id:'schedule-soft-swell',n:'schedule-soft-swell',cat:'notification',fn:()=>playSweepNoise(0.19,0.1,6500,900),c:'#ffbb26',d:'schedule soft sweep down'},
{id:'alarm-soft-fade',n:'alarm-soft-fade',cat:'notification',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(1500,t);o.frequency.exponentialRampToValueAtTime(1800,t+0.25);g.gain.setValueAtTime(0.21*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+0.3);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.35)},c:'#ffbb26',d:'alarm soft glide'},
{id:'timer-soft-rise',n:'timer-soft-rise',cat:'notification',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),m=ctx.createOscillator(),mg=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(1800,t);m.type='sine';m.frequency.setValueAtTime(4500.0,t);mg.gain.setValueAtTime(5400,t);m.connect(mg);mg.connect(o.frequency);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.23*globalVol,t+0.014);g.gain.exponentialRampToValueAtTime(.001,t+0.7);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.75);m.start(t);m.stop(t+0.75)},c:'#ffbb26',d:'timer soft bell'},
{id:'clock-soft-drop',n:'clock-soft-drop',cat:'notification',fn:()=>{for(let i=0;i<5;i++)setTimeout(()=>tone(1087,'square',0.0,0.002,0.02,0.1,0.11,0.06),i*60)},c:'#ffbb26',d:'clock soft rhythm'},
{id:'bell-soft-hit',n:'bell-soft-hit',cat:'notification',fn:()=>{const f=784+Math.random()*211;tone(f,'sawtooth',0.07,0.005,0.025,0.15,0.13,0.08)},c:'#ffbb26',d:'bell soft random'},
{id:'horn-soft-knock',n:'horn-soft-knock',cat:'notification',fn:()=>tone(880,'sine',0.09,0.008,0.03,0.2,0.03,0.02),c:'#ffbb26',d:'horn soft knock'},
{id:'siren-soft-ring',n:'siren-soft-ring',cat:'notification',fn:()=>{tone(1047,'triangle',0.11,0.011,0.035,0.25,0.05,0.04);setTimeout(()=>tone(1319,'square',0.09,0.011,0.035,0.2,0.05,0.04),53)},c:'#ffbb26',d:'siren soft duo'},
{id:'buzzer-soft-hum',n:'buzzer-soft-hum',cat:'notification',fn:()=>{[1319,1760,523].forEach((f,i)=>setTimeout(()=>tone(f,'square',-0.14,0.014,0.04,0.3,0.07,0.06),i*49))},c:'#ffbb26',d:'buzzer soft arpeggio'},
{id:'chirp-soft-buzz',n:'chirp-soft-buzz',cat:'notification',fn:()=>chord([1760,523,659,1500],'sawtooth',0.15,0.002,0.045,0.1,0.09,0.08,60),c:'#ffbb26',d:'chirp soft chord'},
{id:'tweet-soft-whir',n:'tweet-soft-whir',cat:'notification',fn:()=>playNoise(0.17,0.17,4000),c:'#ffbb26',d:'tweet soft noise'},
{id:'hoot-soft-fizz',n:'hoot-soft-fizz',cat:'notification',fn:()=>playBandNoise(0.19,0.04,1100,3),c:'#ffbb26',d:'hoot soft filtered'},
{id:'howl-soft-snap',n:'howl-soft-snap',cat:'notification',fn:()=>playSweepNoise(0.21,0.08,3700,8700),c:'#ffbb26',d:'howl soft sweep up'},
{id:'bark-soft-crackle',n:'bark-soft-crackle',cat:'notification',fn:()=>playSweepNoise(0.23,0.1,4500,1300),c:'#ffbb26',d:'bark soft sweep down'},
{id:'meow-soft-pop',n:'meow-soft-pop',cat:'notification',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(587,t);o.frequency.exponentialRampToValueAtTime(784,t+0.1);g.gain.setValueAtTime(0.05*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+0.15);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.2)},c:'#ffbb26',d:'meow soft glide'},
{id:'moo-soft-click',n:'moo-soft-click',cat:'notification',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),m=ctx.createOscillator(),mg=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(784,t);m.type='sine';m.frequency.setValueAtTime(1960.0,t);mg.gain.setValueAtTime(2352,t);m.connect(mg);mg.connect(o.frequency);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.07*globalVol,t+0.005);g.gain.exponentialRampToValueAtTime(.001,t+0.4);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.45);m.start(t);m.stop(t+0.45)},c:'#ffbb26',d:'moo soft bell'},
{id:'baa-soft-beep',n:'baa-soft-beep',cat:'notification',fn:()=>{for(let i=0;i<5;i++)setTimeout(()=>tone(1980,'square',-0.11,0.008,0.04,0.2,0.11,0.06),i*72)},c:'#ffbb26',d:'baa soft rhythm'},
{id:'oink-soft-boop',n:'oink-soft-boop',cat:'notification',fn:()=>{const f=1047+Math.random()*223;tone(f,'sawtooth',0.11,0.011,0.045,0.25,0.13,0.08)},c:'#ffbb26',d:'oink soft random'},
{id:'quack-soft-blip',n:'quack-soft-blip',cat:'notification',fn:()=>tone(1319,'sine',0.13,0.014,0.01,0.3,0.03,0.02),c:'#ffbb26',d:'quack soft blip'},
{id:'croak-soft-bleep',n:'croak-soft-bleep',cat:'notification',fn:()=>{tone(1760,'triangle',0.15,0.002,0.015,0.1,0.05,0.04);setTimeout(()=>tone(523,'square',0.12,0.002,0.015,0.08,0.05,0.04),65)},c:'#ffbb26',d:'croak soft duo'},
{id:'buzz-soft-warble',n:'buzz-soft-warble',cat:'notification',fn:()=>{[523,659,1500].forEach((f,i)=>setTimeout(()=>tone(f,'square',-0.49,0.005,0.02,0.15,0.07,0.06),i*41))},c:'#ffbb26',d:'buzz soft arpeggio'},
{id:'hum-soft-trill',n:'hum-soft-trill',cat:'notification',fn:()=>chord([659,1500,1800,587],'sawtooth',0.19,0.008,0.025,0.2,0.09,0.08,72),c:'#ffbb26',d:'hum soft chord'},
{id:'whine-soft-roll',n:'whine-soft-roll',cat:'notification',fn:()=>playNoise(0.21,0.21,5000),c:'#ffbb26',d:'whine soft noise'},
{id:'alert-hard-rush',n:'alert-hard-rush',cat:'notification',fn:()=>playBandNoise(0.23,0.08,4700,7),c:'#ffbb26',d:'alert hard filtered'},
{id:'warn-hard-whoosh',n:'warn-hard-whoosh',cat:'notification',fn:()=>playSweepNoise(0.05,0.08,500,2500),c:'#ffbb26',d:'warn hard sweep up'},
{id:'info-hard-swish',n:'info-hard-swish',cat:'notification',fn:()=>playSweepNoise(0.07,0.1,6500,700),c:'#ffbb26',d:'info hard sweep down'},
{id:'news-hard-swoosh',n:'news-hard-swoosh',cat:'notification',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(880,t);o.frequency.exponentialRampToValueAtTime(1047,t+0.2);g.gain.setValueAtTime(0.09*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+0.25);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.3)},c:'#ffbb26',d:'news hard glide'},
{id:'update-hard-thwip',n:'update-hard-thwip',cat:'notification',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),m=ctx.createOscillator(),mg=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(1047,t);m.type='sine';m.frequency.setValueAtTime(2618.0,t);mg.gain.setValueAtTime(3141,t);m.connect(mg);mg.connect(o.frequency);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.11*globalVol,t+0.011);g.gain.exponentialRampToValueAtTime(.001,t+0.6);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.65);m.start(t);m.stop(t+0.65)},c:'#ffbb26',d:'update hard bell'},
{id:'boot-soft-bloop',n:'boot-soft-bloop',cat:'system',fn:()=>tone(440,'sine',0.05,0.002,0.01,0.1,0.03,0.02),c:'#4f8cff',d:'boot soft bloop'},
{id:'reboot-soft-tick',n:'reboot-soft-tick',cat:'system',fn:()=>{tone(554,'triangle',0.07,0.005,0.015,0.15,0.05,0.04);setTimeout(()=>tone(659,'square',0.06,0.005,0.015,0.12,0.05,0.04),41)},c:'#4f8cff',d:'reboot soft duo'},
{id:'sleep-soft-tap',n:'sleep-soft-tap',cat:'system',fn:()=>{[659,523,392].forEach((f,i)=>setTimeout(()=>tone(f,'square',0.06,0.008,0.02,0.2,0.07,0.06),i*37))},c:'#4f8cff',d:'sleep soft arpeggio'},
{id:'wake-soft-pulse',n:'wake-soft-pulse',cat:'system',fn:()=>chord([523,392,784,350],'sawtooth',0.11,0.011,0.025,0.25,0.09,0.08,48),c:'#4f8cff',d:'wake soft chord'},
{id:'hibernate-soft-drone',n:'hibernate-soft-drone',cat:'system',fn:()=>playNoise(0.13,0.13,3000),c:'#4f8cff',d:'hibernate soft noise'},
{id:'crash-soft-sweep',n:'crash-soft-sweep',cat:'system',fn:()=>playBandNoise(0.15,0.08,2000,7),c:'#4f8cff',d:'crash soft filtered'},
{id:'recover-soft-swell',n:'recover-soft-swell',cat:'system',fn:()=>playSweepNoise(0.17,0.08,2900,5900),c:'#4f8cff',d:'recover soft sweep up'},
{id:'backup-soft-fade',n:'backup-soft-fade',cat:'system',fn:()=>playSweepNoise(0.19,0.1,6500,900),c:'#4f8cff',d:'backup soft sweep down'},
{id:'restore-soft-rise',n:'restore-soft-rise',cat:'system',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(600,t);o.frequency.exponentialRampToValueAtTime(800,t+0.25);g.gain.setValueAtTime(0.21*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+0.3);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.35)},c:'#4f8cff',d:'restore soft glide'},
{id:'sync-soft-drop',n:'sync-soft-drop',cat:'system',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),m=ctx.createOscillator(),mg=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(800,t);m.type='sine';m.frequency.setValueAtTime(2000.0,t);mg.gain.setValueAtTime(2400,t);m.connect(mg);mg.connect(o.frequency);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.23*globalVol,t+0.014);g.gain.exponentialRampToValueAtTime(.001,t+0.7);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.75);m.start(t);m.stop(t+0.75)},c:'#4f8cff',d:'sync soft bell'},
{id:'update-soft-hit',n:'update-soft-hit',cat:'system',fn:()=>{for(let i=0;i<5;i++)setTimeout(()=>tone(940,'square',0.0,0.002,0.02,0.1,0.11,0.06),i*60)},c:'#4f8cff',d:'update soft rhythm'},
{id:'install-soft-knock',n:'install-soft-knock',cat:'system',fn:()=>{const f=554+Math.random()*211;tone(f,'sawtooth',0.07,0.005,0.025,0.15,0.13,0.08)},c:'#4f8cff',d:'install soft random'},
{id:'uninstall-soft-ring',n:'uninstall-soft-ring',cat:'system',fn:()=>tone(659,'sine',0.09,0.008,0.03,0.2,0.03,0.02),c:'#4f8cff',d:'uninstall soft ring'},
{id:'extract-soft-hum',n:'extract-soft-hum',cat:'system',fn:()=>{tone(523,'triangle',0.11,0.011,0.035,0.25,0.05,0.04);setTimeout(()=>tone(392,'square',0.09,0.011,0.035,0.2,0.05,0.04),53)},c:'#4f8cff',d:'extract soft duo'},
{id:'compress-soft-buzz',n:'compress-soft-buzz',cat:'system',fn:()=>{[392,784,350].forEach((f,i)=>setTimeout(()=>tone(f,'square',-0.14,0.014,0.04,0.3,0.07,0.06),i*49))},c:'#4f8cff',d:'compress soft arpeggio'},
{id:'encrypt-soft-whir',n:'encrypt-soft-whir',cat:'system',fn:()=>chord([784,350,500,600],'sawtooth',0.15,0.002,0.045,0.1,0.09,0.08,60),c:'#4f8cff',d:'encrypt soft chord'},
{id:'decrypt-soft-fizz',n:'decrypt-soft-fizz',cat:'system',fn:()=>playNoise(0.17,0.17,4000),c:'#4f8cff',d:'decrypt soft noise'},
{id:'scan-soft-snap',n:'scan-soft-snap',cat:'system',fn:()=>playBandNoise(0.19,0.04,1100,3),c:'#4f8cff',d:'scan soft filtered'},
{id:'detect-soft-crackle',n:'detect-soft-crackle',cat:'system',fn:()=>playSweepNoise(0.21,0.08,3700,8700),c:'#4f8cff',d:'detect soft sweep up'},
{id:'protect-soft-pop',n:'protect-soft-pop',cat:'system',fn:()=>playSweepNoise(0.23,0.1,4500,1300),c:'#4f8cff',d:'protect soft sweep down'},
{id:'quarantine-soft-click',n:'quarantine-soft-click',cat:'system',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(440,t);o.frequency.exponentialRampToValueAtTime(554,t+0.1);g.gain.setValueAtTime(0.05*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+0.15);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.2)},c:'#4f8cff',d:'quarantine soft glide'},
{id:'repair-soft-beep',n:'repair-soft-beep',cat:'system',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),m=ctx.createOscillator(),mg=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(554,t);m.type='sine';m.frequency.setValueAtTime(1385.0,t);mg.gain.setValueAtTime(1662,t);m.connect(mg);mg.connect(o.frequency);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.07*globalVol,t+0.005);g.gain.exponentialRampToValueAtTime(.001,t+0.4);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.45);m.start(t);m.stop(t+0.45)},c:'#4f8cff',d:'repair soft bell'},
{id:'defrag-soft-boop',n:'defrag-soft-boop',cat:'system',fn:()=>{for(let i=0;i<5;i++)setTimeout(()=>tone(1759,'square',-0.11,0.008,0.04,0.2,0.11,0.06),i*72)},c:'#4f8cff',d:'defrag soft rhythm'},
{id:'optimize-soft-blip',n:'optimize-soft-blip',cat:'system',fn:()=>{const f=523+Math.random()*223;tone(f,'sawtooth',0.11,0.011,0.045,0.25,0.13,0.08)},c:'#4f8cff',d:'optimize soft random'},
{id:'clean-soft-bleep',n:'clean-soft-bleep',cat:'system',fn:()=>tone(392,'sine',0.13,0.014,0.01,0.3,0.03,0.02),c:'#4f8cff',d:'clean soft bleep'},
{id:'purge-soft-warble',n:'purge-soft-warble',cat:'system',fn:()=>{tone(784,'triangle',0.15,0.002,0.015,0.1,0.05,0.04);setTimeout(()=>tone(350,'square',0.12,0.002,0.015,0.08,0.05,0.04),65)},c:'#4f8cff',d:'purge soft duo'},
{id:'flush-soft-trill',n:'flush-soft-trill',cat:'system',fn:()=>{[350,500,600].forEach((f,i)=>setTimeout(()=>tone(f,'square',-0.49,0.005,0.02,0.15,0.07,0.06),i*41))},c:'#4f8cff',d:'flush soft arpeggio'},
{id:'reset-soft-roll',n:'reset-soft-roll',cat:'system',fn:()=>chord([500,600,800,440],'sawtooth',0.19,0.008,0.025,0.2,0.09,0.08,72),c:'#4f8cff',d:'reset soft chord'},
{id:'restart-soft-rush',n:'restart-soft-rush',cat:'system',fn:()=>playNoise(0.21,0.21,5000),c:'#4f8cff',d:'restart soft noise'},
{id:'boot-hard-whoosh',n:'boot-hard-whoosh',cat:'system',fn:()=>playBandNoise(0.23,0.08,4700,7),c:'#4f8cff',d:'boot hard filtered'},
{id:'reboot-hard-swish',n:'reboot-hard-swish',cat:'system',fn:()=>playSweepNoise(0.05,0.08,500,2500),c:'#4f8cff',d:'reboot hard sweep up'},
{id:'sleep-hard-swoosh',n:'sleep-hard-swoosh',cat:'system',fn:()=>playSweepNoise(0.07,0.1,6500,700),c:'#4f8cff',d:'sleep hard sweep down'},
{id:'input-soft-tick',n:'input-soft-tick',cat:'form',fn:()=>tone(600,'sine',0.05,0.002,0.01,0.1,0.03,0.02),c:'#9f4fff',d:'input soft tick'},
{id:'output-soft-tap',n:'output-soft-tap',cat:'form',fn:()=>{tone(800,'triangle',0.07,0.005,0.015,0.15,0.05,0.04);setTimeout(()=>tone(1000,'square',0.06,0.005,0.015,0.12,0.05,0.04),41)},c:'#9f4fff',d:'output soft duo'},
{id:'edit-soft-pulse',n:'edit-soft-pulse',cat:'form',fn:()=>{[1000,1200,400].forEach((f,i)=>setTimeout(()=>tone(f,'square',0.06,0.008,0.02,0.2,0.07,0.06),i*37))},c:'#9f4fff',d:'edit soft arpeggio'},
{id:'delete-soft-drone',n:'delete-soft-drone',cat:'form',fn:()=>chord([1200,400,700,900],'sawtooth',0.11,0.011,0.025,0.25,0.09,0.08,48),c:'#9f4fff',d:'delete soft chord'},
{id:'insert-soft-sweep',n:'insert-soft-sweep',cat:'form',fn:()=>playNoise(0.13,0.13,3000),c:'#9f4fff',d:'insert soft noise'},
{id:'replace-soft-swell',n:'replace-soft-swell',cat:'form',fn:()=>playBandNoise(0.15,0.08,2000,7),c:'#9f4fff',d:'replace soft filtered'},
{id:'find-soft-fade',n:'find-soft-fade',cat:'form',fn:()=>playSweepNoise(0.17,0.08,2900,5900),c:'#9f4fff',d:'find soft sweep up'},
{id:'replace-soft-rise',n:'replace-soft-rise',cat:'form',fn:()=>playSweepNoise(0.19,0.1,6500,900),c:'#9f4fff',d:'replace soft sweep down'},
{id:'format-soft-drop',n:'format-soft-drop',cat:'form',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(500,t);o.frequency.exponentialRampToValueAtTime(1300,t+0.25);g.gain.setValueAtTime(0.21*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+0.3);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.35)},c:'#9f4fff',d:'format soft glide'},
{id:'parse-soft-hit',n:'parse-soft-hit',cat:'form',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),m=ctx.createOscillator(),mg=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(1300,t);m.type='sine';m.frequency.setValueAtTime(3250.0,t);mg.gain.setValueAtTime(3900,t);m.connect(mg);mg.connect(o.frequency);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.23*globalVol,t+0.014);g.gain.exponentialRampToValueAtTime(.001,t+0.7);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.75);m.start(t);m.stop(t+0.75)},c:'#9f4fff',d:'parse soft bell'},
{id:'encode-soft-knock',n:'encode-soft-knock',cat:'form',fn:()=>{for(let i=0;i<5;i++)setTimeout(()=>tone(1100,'square',0.0,0.002,0.02,0.1,0.11,0.06),i*60)},c:'#9f4fff',d:'encode soft rhythm'},
{id:'decode-soft-ring',n:'decode-soft-ring',cat:'form',fn:()=>{const f=800+Math.random()*211;tone(f,'sawtooth',0.07,0.005,0.025,0.15,0.13,0.08)},c:'#9f4fff',d:'decode soft random'},
{id:'encrypt-soft-hum',n:'encrypt-soft-hum',cat:'form',fn:()=>tone(1000,'sine',0.09,0.008,0.03,0.2,0.03,0.02),c:'#9f4fff',d:'encrypt soft hum'},
{id:'hash-soft-buzz',n:'hash-soft-buzz',cat:'form',fn:()=>{tone(1200,'triangle',0.11,0.011,0.035,0.25,0.05,0.04);setTimeout(()=>tone(400,'square',0.09,0.011,0.035,0.2,0.05,0.04),53)},c:'#9f4fff',d:'hash soft duo'},
{id:'sign-soft-whir',n:'sign-soft-whir',cat:'form',fn:()=>{[400,700,900].forEach((f,i)=>setTimeout(()=>tone(f,'square',-0.14,0.014,0.04,0.3,0.07,0.06),i*49))},c:'#9f4fff',d:'sign soft arpeggio'},
{id:'verify-soft-fizz',n:'verify-soft-fizz',cat:'form',fn:()=>chord([700,900,1100,500],'sawtooth',0.15,0.002,0.045,0.1,0.09,0.08,60),c:'#9f4fff',d:'verify soft chord'},
{id:'compress-soft-snap',n:'compress-soft-snap',cat:'form',fn:()=>playNoise(0.17,0.17,4000),c:'#9f4fff',d:'compress soft noise'},
{id:'expand-soft-crackle',n:'expand-soft-crackle',cat:'form',fn:()=>playBandNoise(0.19,0.04,1100,3),c:'#9f4fff',d:'expand soft filtered'},
{id:'wrap-soft-pop',n:'wrap-soft-pop',cat:'form',fn:()=>playSweepNoise(0.21,0.08,3700,8700),c:'#9f4fff',d:'wrap soft sweep up'},
{id:'unwrap-soft-click',n:'unwrap-soft-click',cat:'form',fn:()=>playSweepNoise(0.23,0.1,4500,1300),c:'#9f4fff',d:'unwrap soft sweep down'},
{id:'indent-soft-beep',n:'indent-soft-beep',cat:'form',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(600,t);o.frequency.exponentialRampToValueAtTime(800,t+0.1);g.gain.setValueAtTime(0.05*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+0.15);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.2)},c:'#9f4fff',d:'indent soft glide'},
{id:'align-soft-boop',n:'align-soft-boop',cat:'form',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),m=ctx.createOscillator(),mg=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(800,t);m.type='sine';m.frequency.setValueAtTime(2000.0,t);mg.gain.setValueAtTime(2400,t);m.connect(mg);mg.connect(o.frequency);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.07*globalVol,t+0.005);g.gain.exponentialRampToValueAtTime(.001,t+0.4);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.45);m.start(t);m.stop(t+0.45)},c:'#9f4fff',d:'align soft bell'},
{id:'sort-soft-blip',n:'sort-soft-blip',cat:'form',fn:()=>{for(let i=0;i<5;i++)setTimeout(()=>tone(2100,'square',-0.11,0.008,0.04,0.2,0.11,0.06),i*72)},c:'#9f4fff',d:'sort soft rhythm'},
{id:'filter-soft-bleep',n:'filter-soft-bleep',cat:'form',fn:()=>{const f=1200+Math.random()*223;tone(f,'sawtooth',0.11,0.011,0.045,0.25,0.13,0.08)},c:'#9f4fff',d:'filter soft random'},
{id:'group-soft-warble',n:'group-soft-warble',cat:'form',fn:()=>tone(400,'sine',0.13,0.014,0.01,0.3,0.03,0.02),c:'#9f4fff',d:'group soft warble'},
{id:'split-soft-trill',n:'split-soft-trill',cat:'form',fn:()=>{tone(700,'triangle',0.15,0.002,0.015,0.1,0.05,0.04);setTimeout(()=>tone(900,'square',0.12,0.002,0.015,0.08,0.05,0.04),65)},c:'#9f4fff',d:'split soft duo'},
{id:'merge-soft-roll',n:'merge-soft-roll',cat:'form',fn:()=>{[900,1100,500].forEach((f,i)=>setTimeout(()=>tone(f,'square',-0.49,0.005,0.02,0.15,0.07,0.06),i*41))},c:'#9f4fff',d:'merge soft arpeggio'},
{id:'join-soft-rush',n:'join-soft-rush',cat:'form',fn:()=>chord([1100,500,1300,600],'sawtooth',0.19,0.008,0.025,0.2,0.09,0.08,72),c:'#9f4fff',d:'join soft chord'},
{id:'clip-soft-whoosh',n:'clip-soft-whoosh',cat:'form',fn:()=>playNoise(0.21,0.21,5000),c:'#9f4fff',d:'clip soft noise'},
{id:'input-hard-swish',n:'input-hard-swish',cat:'form',fn:()=>playBandNoise(0.23,0.08,4700,7),c:'#9f4fff',d:'input hard filtered'},
{id:'output-hard-swoosh',n:'output-hard-swoosh',cat:'form',fn:()=>playSweepNoise(0.05,0.08,500,2500),c:'#9f4fff',d:'output hard sweep up'},
{id:'edit-hard-thwip',n:'edit-hard-thwip',cat:'form',fn:()=>playSweepNoise(0.07,0.1,6500,700),c:'#9f4fff',d:'edit hard sweep down'},
{id:'delete-hard-zip',n:'delete-hard-zip',cat:'form',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(1000,t);o.frequency.exponentialRampToValueAtTime(1200,t+0.2);g.gain.setValueAtTime(0.09*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+0.25);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.3)},c:'#9f4fff',d:'delete hard glide'},
{id:'insert-hard-zap',n:'insert-hard-zap',cat:'form',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),m=ctx.createOscillator(),mg=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(1200,t);m.type='sine';m.frequency.setValueAtTime(3000.0,t);mg.gain.setValueAtTime(3600,t);m.connect(mg);mg.connect(o.frequency);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.11*globalVol,t+0.011);g.gain.exponentialRampToValueAtTime(.001,t+0.6);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.65);m.start(t);m.stop(t+0.65)},c:'#9f4fff',d:'insert hard bell'},
{id:'play-soft-tap',n:'play-soft-tap',cat:'media',fn:()=>tone(500,'sine',0.05,0.002,0.01,0.1,0.03,0.02),c:'#ff6b5f',d:'play soft tap'},
{id:'pause-soft-pulse',n:'pause-soft-pulse',cat:'media',fn:()=>{tone(600,'triangle',0.07,0.005,0.015,0.15,0.05,0.04);setTimeout(()=>tone(800,'square',0.06,0.005,0.015,0.12,0.05,0.04),41)},c:'#ff6b5f',d:'pause soft duo'},
{id:'stop-soft-drone',n:'stop-soft-drone',cat:'media',fn:()=>{[800,1000,400].forEach((f,i)=>setTimeout(()=>tone(f,'square',0.06,0.008,0.02,0.2,0.07,0.06),i*37))},c:'#ff6b5f',d:'stop soft arpeggio'},
{id:'record-soft-sweep',n:'record-soft-sweep',cat:'media',fn:()=>chord([1000,400,700,900],'sawtooth',0.11,0.011,0.025,0.25,0.09,0.08,48),c:'#ff6b5f',d:'record soft chord'},
{id:'capture-soft-swell',n:'capture-soft-swell',cat:'media',fn:()=>playNoise(0.13,0.13,3000),c:'#ff6b5f',d:'capture soft noise'},
{id:'stream-soft-fade',n:'stream-soft-fade',cat:'media',fn:()=>playBandNoise(0.15,0.08,2000,7),c:'#ff6b5f',d:'stream soft filtered'},
{id:'buffer-soft-rise',n:'buffer-soft-rise',cat:'media',fn:()=>playSweepNoise(0.17,0.08,2900,5900),c:'#ff6b5f',d:'buffer soft sweep up'},
{id:'cache-soft-drop',n:'cache-soft-drop',cat:'media',fn:()=>playSweepNoise(0.19,0.1,6500,900),c:'#ff6b5f',d:'cache soft sweep down'},
{id:'render-soft-hit',n:'render-soft-hit',cat:'media',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(300,t);o.frequency.exponentialRampToValueAtTime(1200,t+0.25);g.gain.setValueAtTime(0.21*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+0.3);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.35)},c:'#ff6b5f',d:'render soft glide'},
{id:'export-soft-knock',n:'export-soft-knock',cat:'media',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),m=ctx.createOscillator(),mg=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(1200,t);m.type='sine';m.frequency.setValueAtTime(3000.0,t);mg.gain.setValueAtTime(3600,t);m.connect(mg);mg.connect(o.frequency);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.23*globalVol,t+0.014);g.gain.exponentialRampToValueAtTime(.001,t+0.7);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.75);m.start(t);m.stop(t+0.75)},c:'#ff6b5f',d:'export soft bell'},
{id:'import-soft-ring',n:'import-soft-ring',cat:'media',fn:()=>{for(let i=0;i<5;i++)setTimeout(()=>tone(1000,'square',0.0,0.002,0.02,0.1,0.11,0.06),i*60)},c:'#ff6b5f',d:'import soft rhythm'},
{id:'convert-soft-hum',n:'convert-soft-hum',cat:'media',fn:()=>{const f=600+Math.random()*211;tone(f,'sawtooth',0.07,0.005,0.025,0.15,0.13,0.08)},c:'#ff6b5f',d:'convert soft random'},
{id:'trim-soft-buzz',n:'trim-soft-buzz',cat:'media',fn:()=>tone(800,'sine',0.09,0.008,0.03,0.2,0.03,0.02),c:'#ff6b5f',d:'trim soft buzz'},
{id:'crop-soft-whir',n:'crop-soft-whir',cat:'media',fn:()=>{tone(1000,'triangle',0.11,0.011,0.035,0.25,0.05,0.04);setTimeout(()=>tone(400,'square',0.09,0.011,0.035,0.2,0.05,0.04),53)},c:'#ff6b5f',d:'crop soft duo'},
{id:'resize-soft-fizz',n:'resize-soft-fizz',cat:'media',fn:()=>{[400,700,900].forEach((f,i)=>setTimeout(()=>tone(f,'square',-0.14,0.014,0.04,0.3,0.07,0.06),i*49))},c:'#ff6b5f',d:'resize soft arpeggio'},
{id:'rotate-soft-snap',n:'rotate-soft-snap',cat:'media',fn:()=>chord([700,900,1100,300],'sawtooth',0.15,0.002,0.045,0.1,0.09,0.08,60),c:'#ff6b5f',d:'rotate soft chord'},
{id:'flip-soft-crackle',n:'flip-soft-crackle',cat:'media',fn:()=>playNoise(0.17,0.17,4000),c:'#ff6b5f',d:'flip soft noise'},
{id:'mirror-soft-pop',n:'mirror-soft-pop',cat:'media',fn:()=>playBandNoise(0.19,0.04,1100,3),c:'#ff6b5f',d:'mirror soft filtered'},
{id:'blend-soft-click',n:'blend-soft-click',cat:'media',fn:()=>playSweepNoise(0.21,0.08,3700,8700),c:'#ff6b5f',d:'blend soft sweep up'},
{id:'fade-soft-beep',n:'fade-soft-beep',cat:'media',fn:()=>playSweepNoise(0.23,0.1,4500,1300),c:'#ff6b5f',d:'fade soft sweep down'},
{id:'dissolve-soft-boop',n:'dissolve-soft-boop',cat:'media',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(500,t);o.frequency.exponentialRampToValueAtTime(600,t+0.1);g.gain.setValueAtTime(0.05*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+0.15);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.2)},c:'#ff6b5f',d:'dissolve soft glide'},
{id:'wipe-soft-blip',n:'wipe-soft-blip',cat:'media',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),m=ctx.createOscillator(),mg=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(600,t);m.type='sine';m.frequency.setValueAtTime(1500.0,t);mg.gain.setValueAtTime(1800,t);m.connect(mg);mg.connect(o.frequency);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.07*globalVol,t+0.005);g.gain.exponentialRampToValueAtTime(.001,t+0.4);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.45);m.start(t);m.stop(t+0.45)},c:'#ff6b5f',d:'wipe soft bell'},
{id:'slide-soft-bleep',n:'slide-soft-bleep',cat:'media',fn:()=>{for(let i=0;i<5;i++)setTimeout(()=>tone(1900,'square',-0.11,0.008,0.04,0.2,0.11,0.06),i*72)},c:'#ff6b5f',d:'slide soft rhythm'},
{id:'push-soft-warble',n:'push-soft-warble',cat:'media',fn:()=>{const f=1000+Math.random()*223;tone(f,'sawtooth',0.11,0.011,0.045,0.25,0.13,0.08)},c:'#ff6b5f',d:'push soft random'},
{id:'pull-soft-trill',n:'pull-soft-trill',cat:'media',fn:()=>tone(400,'sine',0.13,0.014,0.01,0.3,0.03,0.02),c:'#ff6b5f',d:'pull soft trill'},
{id:'zoom-soft-roll',n:'zoom-soft-roll',cat:'media',fn:()=>{tone(700,'triangle',0.15,0.002,0.015,0.1,0.05,0.04);setTimeout(()=>tone(900,'square',0.12,0.002,0.015,0.08,0.05,0.04),65)},c:'#ff6b5f',d:'zoom soft duo'},
{id:'pan-soft-rush',n:'pan-soft-rush',cat:'media',fn:()=>{[900,1100,300].forEach((f,i)=>setTimeout(()=>tone(f,'square',-0.49,0.005,0.02,0.15,0.07,0.06),i*41))},c:'#ff6b5f',d:'pan soft arpeggio'},
{id:'tilt-soft-whoosh',n:'tilt-soft-whoosh',cat:'media',fn:()=>chord([1100,300,1200,500],'sawtooth',0.19,0.008,0.025,0.2,0.09,0.08,72),c:'#ff6b5f',d:'tilt soft chord'},
{id:'dolly-soft-swish',n:'dolly-soft-swish',cat:'media',fn:()=>playNoise(0.21,0.21,5000),c:'#ff6b5f',d:'dolly soft noise'},
{id:'play-hard-swoosh',n:'play-hard-swoosh',cat:'media',fn:()=>playBandNoise(0.23,0.08,4700,7),c:'#ff6b5f',d:'play hard filtered'},
{id:'pause-hard-thwip',n:'pause-hard-thwip',cat:'media',fn:()=>playSweepNoise(0.05,0.08,500,2500),c:'#ff6b5f',d:'pause hard sweep up'},
{id:'stop-hard-zip',n:'stop-hard-zip',cat:'media',fn:()=>playSweepNoise(0.07,0.1,6500,700),c:'#ff6b5f',d:'stop hard sweep down'},
{id:'record-hard-zap',n:'record-hard-zap',cat:'media',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(800,t);o.frequency.exponentialRampToValueAtTime(1000,t+0.2);g.gain.setValueAtTime(0.09*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+0.25);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.3)},c:'#ff6b5f',d:'record hard glide'},
{id:'capture-hard-pow',n:'capture-hard-pow',cat:'media',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),m=ctx.createOscillator(),mg=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(1000,t);m.type='sine';m.frequency.setValueAtTime(2500.0,t);mg.gain.setValueAtTime(3000,t);m.connect(mg);mg.connect(o.frequency);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.11*globalVol,t+0.011);g.gain.exponentialRampToValueAtTime(.001,t+0.6);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.65);m.start(t);m.stop(t+0.65)},c:'#ff6b5f',d:'capture hard bell'},
{id:'stream-hard-thump',n:'stream-hard-thump',cat:'media',fn:()=>{for(let i=0;i<5;i++)setTimeout(()=>tone(2100,'square',-0.31,0.014,0.02,0.3,0.11,0.06),i*54)},c:'#ff6b5f',d:'stream hard rhythm'},
{id:'buffer-hard-thud',n:'buffer-hard-thud',cat:'media',fn:()=>{const f=700+Math.random()*235;tone(f,'sawtooth',0.15,0.002,0.025,0.1,0.13,0.08)},c:'#ff6b5f',d:'buffer hard random'},
{id:'push-soft-pulse',n:'push-soft-pulse',cat:'gesture',fn:()=>tone(300,'sine',0.05,0.002,0.01,0.1,0.03,0.02),c:'#d9a066',d:'push soft pulse'},
{id:'pull-soft-drone',n:'pull-soft-drone',cat:'gesture',fn:()=>{tone(400,'triangle',0.07,0.005,0.015,0.15,0.05,0.04);setTimeout(()=>tone(500,'square',0.06,0.005,0.015,0.12,0.05,0.04),41)},c:'#d9a066',d:'pull soft duo'},
{id:'lift-soft-sweep',n:'lift-soft-sweep',cat:'gesture',fn:()=>{[500,600,200].forEach((f,i)=>setTimeout(()=>tone(f,'square',0.06,0.008,0.02,0.2,0.07,0.06),i*37))},c:'#d9a066',d:'lift soft arpeggio'},
{id:'drop-soft-swell',n:'drop-soft-swell',cat:'gesture',fn:()=>chord([600,200,800,1000],'sawtooth',0.11,0.011,0.025,0.25,0.09,0.08,48),c:'#d9a066',d:'drop soft chord'},
{id:'throw-soft-fade',n:'throw-soft-fade',cat:'gesture',fn:()=>playNoise(0.13,0.13,3000),c:'#d9a066',d:'throw soft noise'},
{id:'catch-soft-rise',n:'catch-soft-rise',cat:'gesture',fn:()=>playBandNoise(0.15,0.08,2000,7),c:'#d9a066',d:'catch soft filtered'},
{id:'grab-soft-drop',n:'grab-soft-drop',cat:'gesture',fn:()=>playSweepNoise(0.17,0.08,2900,5900),c:'#d9a066',d:'grab soft sweep up'},
{id:'release-soft-hit',n:'release-soft-hit',cat:'gesture',fn:()=>playSweepNoise(0.19,0.1,6500,900),c:'#d9a066',d:'release soft sweep down'},
{id:'squeeze-soft-knock',n:'squeeze-soft-knock',cat:'gesture',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(250,t);o.frequency.exponentialRampToValueAtTime(700,t+0.25);g.gain.setValueAtTime(0.21*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+0.3);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.35)},c:'#d9a066',d:'squeeze soft glide'},
{id:'stretch-soft-ring',n:'stretch-soft-ring',cat:'gesture',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),m=ctx.createOscillator(),mg=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(700,t);m.type='sine';m.frequency.setValueAtTime(1750.0,t);mg.gain.setValueAtTime(2100,t);m.connect(mg);mg.connect(o.frequency);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.23*globalVol,t+0.014);g.gain.exponentialRampToValueAtTime(.001,t+0.7);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.75);m.start(t);m.stop(t+0.75)},c:'#d9a066',d:'stretch soft bell'},
{id:'bend-soft-hum',n:'bend-soft-hum',cat:'gesture',fn:()=>{for(let i=0;i<5;i++)setTimeout(()=>tone(800,'square',0.0,0.002,0.02,0.1,0.11,0.06),i*60)},c:'#d9a066',d:'bend soft rhythm'},
{id:'twist-soft-buzz',n:'twist-soft-buzz',cat:'gesture',fn:()=>{const f=400+Math.random()*211;tone(f,'sawtooth',0.07,0.005,0.025,0.15,0.13,0.08)},c:'#d9a066',d:'twist soft random'},
{id:'turn-soft-whir',n:'turn-soft-whir',cat:'gesture',fn:()=>tone(500,'sine',0.09,0.008,0.03,0.2,0.03,0.02),c:'#d9a066',d:'turn soft whir'},
{id:'flip-soft-fizz',n:'flip-soft-fizz',cat:'gesture',fn:()=>{tone(600,'triangle',0.11,0.011,0.035,0.25,0.05,0.04);setTimeout(()=>tone(200,'square',0.09,0.011,0.035,0.2,0.05,0.04),53)},c:'#d9a066',d:'flip soft duo'},
{id:'spin-soft-snap',n:'spin-soft-snap',cat:'gesture',fn:()=>{[200,800,1000].forEach((f,i)=>setTimeout(()=>tone(f,'square',-0.14,0.014,0.04,0.3,0.07,0.06),i*49))},c:'#d9a066',d:'spin soft arpeggio'},
{id:'roll-soft-crackle',n:'roll-soft-crackle',cat:'gesture',fn:()=>chord([800,1000,1500,250],'sawtooth',0.15,0.002,0.045,0.1,0.09,0.08,60),c:'#d9a066',d:'roll soft chord'},
{id:'rock-soft-pop',n:'rock-soft-pop',cat:'gesture',fn:()=>playNoise(0.17,0.17,4000),c:'#d9a066',d:'rock soft noise'},
{id:'tilt-soft-click',n:'tilt-soft-click',cat:'gesture',fn:()=>playBandNoise(0.19,0.04,1100,3),c:'#d9a066',d:'tilt soft filtered'},
{id:'lean-soft-beep',n:'lean-soft-beep',cat:'gesture',fn:()=>playSweepNoise(0.21,0.08,3700,8700),c:'#d9a066',d:'lean soft sweep up'},
{id:'fall-soft-boop',n:'fall-soft-boop',cat:'gesture',fn:()=>playSweepNoise(0.23,0.1,4500,1300),c:'#d9a066',d:'fall soft sweep down'},
{id:'rise-soft-blip',n:'rise-soft-blip',cat:'gesture',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(300,t);o.frequency.exponentialRampToValueAtTime(400,t+0.1);g.gain.setValueAtTime(0.05*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+0.15);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.2)},c:'#d9a066',d:'rise soft glide'},
{id:'sink-soft-bleep',n:'sink-soft-bleep',cat:'gesture',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),m=ctx.createOscillator(),mg=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(400,t);m.type='sine';m.frequency.setValueAtTime(1000.0,t);mg.gain.setValueAtTime(1200,t);m.connect(mg);mg.connect(o.frequency);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.07*globalVol,t+0.005);g.gain.exponentialRampToValueAtTime(.001,t+0.4);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.45);m.start(t);m.stop(t+0.45)},c:'#d9a066',d:'sink soft bell'},
{id:'float-soft-warble',n:'float-soft-warble',cat:'gesture',fn:()=>{for(let i=0;i<5;i++)setTimeout(()=>tone(1600,'square',-0.11,0.008,0.04,0.2,0.11,0.06),i*72)},c:'#d9a066',d:'float soft rhythm'},
{id:'fly-soft-trill',n:'fly-soft-trill',cat:'gesture',fn:()=>{const f=600+Math.random()*223;tone(f,'sawtooth',0.11,0.011,0.045,0.25,0.13,0.08)},c:'#d9a066',d:'fly soft random'},
{id:'land-soft-roll',n:'land-soft-roll',cat:'gesture',fn:()=>tone(200,'sine',0.13,0.014,0.01,0.3,0.03,0.02),c:'#d9a066',d:'land soft roll'},
{id:'takeoff-soft-rush',n:'takeoff-soft-rush',cat:'gesture',fn:()=>{tone(800,'triangle',0.15,0.002,0.015,0.1,0.05,0.04);setTimeout(()=>tone(1000,'square',0.12,0.002,0.015,0.08,0.05,0.04),65)},c:'#d9a066',d:'takeoff soft duo'},
{id:'dive-soft-whoosh',n:'dive-soft-whoosh',cat:'gesture',fn:()=>{[1000,1500,250].forEach((f,i)=>setTimeout(()=>tone(f,'square',-0.49,0.005,0.02,0.15,0.07,0.06),i*41))},c:'#d9a066',d:'dive soft arpeggio'},
{id:'jump-soft-swish',n:'jump-soft-swish',cat:'gesture',fn:()=>chord([1500,250,700,300],'sawtooth',0.19,0.008,0.025,0.2,0.09,0.08,72),c:'#d9a066',d:'jump soft chord'},
{id:'hop-soft-swoosh',n:'hop-soft-swoosh',cat:'gesture',fn:()=>playNoise(0.21,0.21,5000),c:'#d9a066',d:'hop soft noise'},
{id:'push-hard-thwip',n:'push-hard-thwip',cat:'gesture',fn:()=>playBandNoise(0.23,0.08,4700,7),c:'#d9a066',d:'push hard filtered'},
{id:'pull-hard-zip',n:'pull-hard-zip',cat:'gesture',fn:()=>playSweepNoise(0.05,0.08,500,2500),c:'#d9a066',d:'pull hard sweep up'},
{id:'lift-hard-zap',n:'lift-hard-zap',cat:'gesture',fn:()=>playSweepNoise(0.07,0.1,6500,700),c:'#d9a066',d:'lift hard sweep down'},
{id:'drop-hard-pow',n:'drop-hard-pow',cat:'gesture',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(500,t);o.frequency.exponentialRampToValueAtTime(600,t+0.2);g.gain.setValueAtTime(0.09*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+0.25);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.3)},c:'#d9a066',d:'drop hard glide'},
{id:'throw-hard-thump',n:'throw-hard-thump',cat:'gesture',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),m=ctx.createOscillator(),mg=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(600,t);m.type='sine';m.frequency.setValueAtTime(1500.0,t);mg.gain.setValueAtTime(1800,t);m.connect(mg);mg.connect(o.frequency);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.11*globalVol,t+0.011);g.gain.exponentialRampToValueAtTime(.001,t+0.6);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.65);m.start(t);m.stop(t+0.65)},c:'#d9a066',d:'throw hard bell'},
{id:'catch-hard-thud',n:'catch-hard-thud',cat:'gesture',fn:()=>{for(let i=0;i<5;i++)setTimeout(()=>tone(1900,'square',-0.31,0.014,0.02,0.3,0.11,0.06),i*54)},c:'#d9a066',d:'catch hard rhythm'},
{id:'grab-hard-clack',n:'grab-hard-clack',cat:'gesture',fn:()=>{const f=800+Math.random()*235;tone(f,'sawtooth',0.15,0.002,0.025,0.1,0.13,0.08)},c:'#d9a066',d:'grab hard random'},
{id:'release-hard-clink',n:'release-hard-clink',cat:'gesture',fn:()=>tone(1000,'sine',0.17,0.005,0.03,0.15,0.03,0.02),c:'#d9a066',d:'release hard clink'},
{id:'squeeze-hard-ding',n:'squeeze-hard-ding',cat:'gesture',fn:()=>{tone(1500,'triangle',0.19,0.008,0.035,0.2,0.05,0.04);setTimeout(()=>tone(250,'square',0.15,0.008,0.035,0.16,0.05,0.04),77)},c:'#d9a066',d:'squeeze hard duo'},
{id:'home-soft-drone',n:'home-soft-drone',cat:'navigation',fn:()=>tone(400,'sine',0.05,0.002,0.01,0.1,0.03,0.02),c:'#00b2ff',d:'home soft drone'},
{id:'back-soft-sweep',n:'back-soft-sweep',cat:'navigation',fn:()=>{tone(500,'triangle',0.07,0.005,0.015,0.15,0.05,0.04);setTimeout(()=>tone(600,'square',0.06,0.005,0.015,0.12,0.05,0.04),41)},c:'#00b2ff',d:'back soft duo'},
{id:'forward-soft-swell',n:'forward-soft-swell',cat:'navigation',fn:()=>{[600,800,350].forEach((f,i)=>setTimeout(()=>tone(f,'square',0.06,0.008,0.02,0.2,0.07,0.06),i*37))},c:'#00b2ff',d:'forward soft arpeggio'},
{id:'up-soft-fade',n:'up-soft-fade',cat:'navigation',fn:()=>chord([800,350,450,700],'sawtooth',0.11,0.011,0.025,0.25,0.09,0.08,48),c:'#00b2ff',d:'up soft chord'},
{id:'down-soft-rise',n:'down-soft-rise',cat:'navigation',fn:()=>playNoise(0.13,0.13,3000),c:'#00b2ff',d:'down soft noise'},
{id:'top-soft-drop',n:'top-soft-drop',cat:'navigation',fn:()=>playBandNoise(0.15,0.08,2000,7),c:'#00b2ff',d:'top soft filtered'},
{id:'bottom-soft-hit',n:'bottom-soft-hit',cat:'navigation',fn:()=>playSweepNoise(0.17,0.08,2900,5900),c:'#00b2ff',d:'bottom soft sweep up'},
{id:'first-soft-knock',n:'first-soft-knock',cat:'navigation',fn:()=>playSweepNoise(0.19,0.1,6500,900),c:'#00b2ff',d:'first soft sweep down'},
{id:'last-soft-ring',n:'last-soft-ring',cat:'navigation',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(550,t);o.frequency.exponentialRampToValueAtTime(750,t+0.25);g.gain.setValueAtTime(0.21*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+0.3);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.35)},c:'#00b2ff',d:'last soft glide'},
{id:'prev-soft-hum',n:'prev-soft-hum',cat:'navigation',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),m=ctx.createOscillator(),mg=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(750,t);m.type='sine';m.frequency.setValueAtTime(1875.0,t);mg.gain.setValueAtTime(2250,t);m.connect(mg);mg.connect(o.frequency);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.23*globalVol,t+0.014);g.gain.exponentialRampToValueAtTime(.001,t+0.7);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.75);m.start(t);m.stop(t+0.75)},c:'#00b2ff',d:'prev soft bell'},
{id:'next-soft-buzz',n:'next-soft-buzz',cat:'navigation',fn:()=>{for(let i=0;i<5;i++)setTimeout(()=>tone(900,'square',0.0,0.002,0.02,0.1,0.11,0.06),i*60)},c:'#00b2ff',d:'next soft rhythm'},
{id:'index-soft-whir',n:'index-soft-whir',cat:'navigation',fn:()=>{const f=500+Math.random()*211;tone(f,'sawtooth',0.07,0.005,0.025,0.15,0.13,0.08)},c:'#00b2ff',d:'index soft random'},
{id:'contents-soft-fizz',n:'contents-soft-fizz',cat:'navigation',fn:()=>tone(600,'sine',0.09,0.008,0.03,0.2,0.03,0.02),c:'#00b2ff',d:'contents soft fizz'},
{id:'search-soft-snap',n:'search-soft-snap',cat:'navigation',fn:()=>{tone(800,'triangle',0.11,0.011,0.035,0.25,0.05,0.04);setTimeout(()=>tone(350,'square',0.09,0.011,0.035,0.2,0.05,0.04),53)},c:'#00b2ff',d:'search soft duo'},
{id:'find-soft-crackle',n:'find-soft-crackle',cat:'navigation',fn:()=>{[350,450,700].forEach((f,i)=>setTimeout(()=>tone(f,'square',-0.14,0.014,0.04,0.3,0.07,0.06),i*49))},c:'#00b2ff',d:'find soft arpeggio'},
{id:'jump-soft-pop',n:'jump-soft-pop',cat:'navigation',fn:()=>chord([450,700,900,550],'sawtooth',0.15,0.002,0.045,0.1,0.09,0.08,60),c:'#00b2ff',d:'jump soft chord'},
{id:'skip-soft-click',n:'skip-soft-click',cat:'navigation',fn:()=>playNoise(0.17,0.17,4000),c:'#00b2ff',d:'skip soft noise'},
{id:'scroll-soft-beep',n:'scroll-soft-beep',cat:'navigation',fn:()=>playBandNoise(0.19,0.04,1100,3),c:'#00b2ff',d:'scroll soft filtered'},
{id:'page-soft-boop',n:'page-soft-boop',cat:'navigation',fn:()=>playSweepNoise(0.21,0.08,3700,8700),c:'#00b2ff',d:'page soft sweep up'},
{id:'section-soft-blip',n:'section-soft-blip',cat:'navigation',fn:()=>playSweepNoise(0.23,0.1,4500,1300),c:'#00b2ff',d:'section soft sweep down'},
{id:'chapter-soft-bleep',n:'chapter-soft-bleep',cat:'navigation',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(400,t);o.frequency.exponentialRampToValueAtTime(500,t+0.1);g.gain.setValueAtTime(0.05*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+0.15);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.2)},c:'#00b2ff',d:'chapter soft glide'},
{id:'part-soft-warble',n:'part-soft-warble',cat:'navigation',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),m=ctx.createOscillator(),mg=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(500,t);m.type='sine';m.frequency.setValueAtTime(1250.0,t);mg.gain.setValueAtTime(1500,t);m.connect(mg);mg.connect(o.frequency);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.07*globalVol,t+0.005);g.gain.exponentialRampToValueAtTime(.001,t+0.4);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.45);m.start(t);m.stop(t+0.45)},c:'#00b2ff',d:'part soft bell'},
{id:'volume-soft-trill',n:'volume-soft-trill',cat:'navigation',fn:()=>{for(let i=0;i<5;i++)setTimeout(()=>tone(1700,'square',-0.11,0.008,0.04,0.2,0.11,0.06),i*72)},c:'#00b2ff',d:'volume soft rhythm'},
{id:'edition-soft-roll',n:'edition-soft-roll',cat:'navigation',fn:()=>{const f=800+Math.random()*223;tone(f,'sawtooth',0.11,0.011,0.045,0.25,0.13,0.08)},c:'#00b2ff',d:'edition soft random'},
{id:'version-soft-rush',n:'version-soft-rush',cat:'navigation',fn:()=>tone(350,'sine',0.13,0.014,0.01,0.3,0.03,0.02),c:'#00b2ff',d:'version soft rush'},
{id:'branch-soft-whoosh',n:'branch-soft-whoosh',cat:'navigation',fn:()=>{tone(450,'triangle',0.15,0.002,0.015,0.1,0.05,0.04);setTimeout(()=>tone(700,'square',0.12,0.002,0.015,0.08,0.05,0.04),65)},c:'#00b2ff',d:'branch soft duo'},
{id:'merge-soft-swish',n:'merge-soft-swish',cat:'navigation',fn:()=>{[700,900,550].forEach((f,i)=>setTimeout(()=>tone(f,'square',-0.49,0.005,0.02,0.15,0.07,0.06),i*41))},c:'#00b2ff',d:'merge soft arpeggio'},
{id:'fork-soft-swoosh',n:'fork-soft-swoosh',cat:'navigation',fn:()=>chord([900,550,750,400],'sawtooth',0.19,0.008,0.025,0.2,0.09,0.08,72),c:'#00b2ff',d:'fork soft chord'},
{id:'clone-soft-thwip',n:'clone-soft-thwip',cat:'navigation',fn:()=>playNoise(0.21,0.21,5000),c:'#00b2ff',d:'clone soft noise'},
{id:'home-hard-zip',n:'home-hard-zip',cat:'navigation',fn:()=>playBandNoise(0.23,0.08,4700,7),c:'#00b2ff',d:'home hard filtered'},
{id:'back-hard-zap',n:'back-hard-zap',cat:'navigation',fn:()=>playSweepNoise(0.05,0.08,500,2500),c:'#00b2ff',d:'back hard sweep up'},
{id:'forward-hard-pow',n:'forward-hard-pow',cat:'navigation',fn:()=>playSweepNoise(0.07,0.1,6500,700),c:'#00b2ff',d:'forward hard sweep down'},
{id:'up-hard-thump',n:'up-hard-thump',cat:'navigation',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(600,t);o.frequency.exponentialRampToValueAtTime(800,t+0.2);g.gain.setValueAtTime(0.09*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+0.25);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.3)},c:'#00b2ff',d:'up hard glide'},
{id:'down-hard-thud',n:'down-hard-thud',cat:'navigation',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),m=ctx.createOscillator(),mg=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(800,t);m.type='sine';m.frequency.setValueAtTime(2000.0,t);mg.gain.setValueAtTime(2400,t);m.connect(mg);mg.connect(o.frequency);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.11*globalVol,t+0.011);g.gain.exponentialRampToValueAtTime(.001,t+0.6);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.65);m.start(t);m.stop(t+0.65)},c:'#00b2ff',d:'down hard bell'},
{id:'top-hard-clack',n:'top-hard-clack',cat:'navigation',fn:()=>{for(let i=0;i<5;i++)setTimeout(()=>tone(2050,'square',-0.31,0.014,0.02,0.3,0.11,0.06),i*54)},c:'#00b2ff',d:'top hard rhythm'},
{id:'bottom-hard-clink',n:'bottom-hard-clink',cat:'navigation',fn:()=>{const f=450+Math.random()*235;tone(f,'sawtooth',0.15,0.002,0.025,0.1,0.13,0.08)},c:'#00b2ff',d:'bottom hard random'},
{id:'buy-soft-sweep',n:'buy-soft-sweep',cat:'commerce',fn:()=>tone(523,'sine',0.05,0.002,0.01,0.1,0.03,0.02),c:'#23ad91',d:'buy soft sweep'},
{id:'sell-soft-swell',n:'sell-soft-swell',cat:'commerce',fn:()=>{tone(659,'triangle',0.07,0.005,0.015,0.15,0.05,0.04);setTimeout(()=>tone(784,'square',0.06,0.005,0.015,0.12,0.05,0.04),41)},c:'#23ad91',d:'sell soft duo'},
{id:'trade-soft-fade',n:'trade-soft-fade',cat:'commerce',fn:()=>{[784,880,440].forEach((f,i)=>setTimeout(()=>tone(f,'square',0.06,0.008,0.02,0.2,0.07,0.06),i*37))},c:'#23ad91',d:'trade soft arpeggio'},
{id:'bid-soft-rise',n:'bid-soft-rise',cat:'commerce',fn:()=>chord([880,440,554,1047],'sawtooth',0.11,0.011,0.025,0.25,0.09,0.08,48),c:'#23ad91',d:'bid soft chord'},
{id:'offer-soft-drop',n:'offer-soft-drop',cat:'commerce',fn:()=>playNoise(0.13,0.13,3000),c:'#23ad91',d:'offer soft noise'},
{id:'deal-soft-hit',n:'deal-soft-hit',cat:'commerce',fn:()=>playBandNoise(0.15,0.08,2000,7),c:'#23ad91',d:'deal soft filtered'},
{id:'save-soft-knock',n:'save-soft-knock',cat:'commerce',fn:()=>playSweepNoise(0.17,0.08,2900,5900),c:'#23ad91',d:'save soft sweep up'},
{id:'spend-soft-ring',n:'spend-soft-ring',cat:'commerce',fn:()=>playSweepNoise(0.19,0.1,6500,900),c:'#23ad91',d:'spend soft sweep down'},
{id:'earn-soft-hum',n:'earn-soft-hum',cat:'commerce',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(392,t);o.frequency.exponentialRampToValueAtTime(698,t+0.25);g.gain.setValueAtTime(0.21*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+0.3);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.35)},c:'#23ad91',d:'earn soft glide'},
{id:'win-soft-buzz',n:'win-soft-buzz',cat:'commerce',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),m=ctx.createOscillator(),mg=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(698,t);m.type='sine';m.frequency.setValueAtTime(1745.0,t);mg.gain.setValueAtTime(2094,t);m.connect(mg);mg.connect(o.frequency);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.23*globalVol,t+0.014);g.gain.exponentialRampToValueAtTime(.001,t+0.7);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.75);m.start(t);m.stop(t+0.75)},c:'#23ad91',d:'win soft bell'},
{id:'lose-soft-whir',n:'lose-soft-whir',cat:'commerce',fn:()=>{for(let i=0;i<5;i++)setTimeout(()=>tone(1023,'square',0.0,0.002,0.02,0.1,0.11,0.06),i*60)},c:'#23ad91',d:'lose soft rhythm'},
{id:'gain-soft-fizz',n:'gain-soft-fizz',cat:'commerce',fn:()=>{const f=659+Math.random()*211;tone(f,'sawtooth',0.07,0.005,0.025,0.15,0.13,0.08)},c:'#23ad91',d:'gain soft random'},
{id:'profit-soft-snap',n:'profit-soft-snap',cat:'commerce',fn:()=>tone(784,'sine',0.09,0.008,0.03,0.2,0.03,0.02),c:'#23ad91',d:'profit soft snap'},
{id:'loss-soft-crackle',n:'loss-soft-crackle',cat:'commerce',fn:()=>{tone(880,'triangle',0.11,0.011,0.035,0.25,0.05,0.04);setTimeout(()=>tone(440,'square',0.09,0.011,0.035,0.2,0.05,0.04),53)},c:'#23ad91',d:'loss soft duo'},
{id:'tax-soft-pop',n:'tax-soft-pop',cat:'commerce',fn:()=>{[440,554,1047].forEach((f,i)=>setTimeout(()=>tone(f,'square',-0.14,0.014,0.04,0.3,0.07,0.06),i*49))},c:'#23ad91',d:'tax soft arpeggio'},
{id:'fee-soft-click',n:'fee-soft-click',cat:'commerce',fn:()=>chord([554,1047,1319,392],'sawtooth',0.15,0.002,0.045,0.1,0.09,0.08,60),c:'#23ad91',d:'fee soft chord'},
{id:'tip-soft-beep',n:'tip-soft-beep',cat:'commerce',fn:()=>playNoise(0.17,0.17,4000),c:'#23ad91',d:'tip soft noise'},
{id:'donate-soft-boop',n:'donate-soft-boop',cat:'commerce',fn:()=>playBandNoise(0.19,0.04,1100,3),c:'#23ad91',d:'donate soft filtered'},
{id:'subscribe-soft-blip',n:'subscribe-soft-blip',cat:'commerce',fn:()=>playSweepNoise(0.21,0.08,3700,8700),c:'#23ad91',d:'subscribe soft sweep up'},
{id:'renew-soft-bleep',n:'renew-soft-bleep',cat:'commerce',fn:()=>playSweepNoise(0.23,0.1,4500,1300),c:'#23ad91',d:'renew soft sweep down'},
{id:'cancel-soft-warble',n:'cancel-soft-warble',cat:'commerce',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(523,t);o.frequency.exponentialRampToValueAtTime(659,t+0.1);g.gain.setValueAtTime(0.05*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+0.15);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.2)},c:'#23ad91',d:'cancel soft glide'},
{id:'refund-soft-trill',n:'refund-soft-trill',cat:'commerce',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),m=ctx.createOscillator(),mg=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(659,t);m.type='sine';m.frequency.setValueAtTime(1648.0,t);mg.gain.setValueAtTime(1977,t);m.connect(mg);mg.connect(o.frequency);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.07*globalVol,t+0.005);g.gain.exponentialRampToValueAtTime(.001,t+0.4);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.45);m.start(t);m.stop(t+0.45)},c:'#23ad91',d:'refund soft bell'},
{id:'exchange-soft-roll',n:'exchange-soft-roll',cat:'commerce',fn:()=>{for(let i=0;i<5;i++)setTimeout(()=>tone(1884,'square',-0.11,0.008,0.04,0.2,0.11,0.06),i*72)},c:'#23ad91',d:'exchange soft rhythm'},
{id:'return-soft-rush',n:'return-soft-rush',cat:'commerce',fn:()=>{const f=880+Math.random()*223;tone(f,'sawtooth',0.11,0.011,0.045,0.25,0.13,0.08)},c:'#23ad91',d:'return soft random'},
{id:'ship-soft-whoosh',n:'ship-soft-whoosh',cat:'commerce',fn:()=>tone(440,'sine',0.13,0.014,0.01,0.3,0.03,0.02),c:'#23ad91',d:'ship soft whoosh'},
{id:'deliver-soft-swish',n:'deliver-soft-swish',cat:'commerce',fn:()=>{tone(554,'triangle',0.15,0.002,0.015,0.1,0.05,0.04);setTimeout(()=>tone(1047,'square',0.12,0.002,0.015,0.08,0.05,0.04),65)},c:'#23ad91',d:'deliver soft duo'},
{id:'track-soft-swoosh',n:'track-soft-swoosh',cat:'commerce',fn:()=>{[1047,1319,392].forEach((f,i)=>setTimeout(()=>tone(f,'square',-0.49,0.005,0.02,0.15,0.07,0.06),i*41))},c:'#23ad91',d:'track soft arpeggio'},
{id:'arrive-soft-thwip',n:'arrive-soft-thwip',cat:'commerce',fn:()=>chord([1319,392,698,523],'sawtooth',0.19,0.008,0.025,0.2,0.09,0.08,72),c:'#23ad91',d:'arrive soft chord'},
{id:'receive-soft-zip',n:'receive-soft-zip',cat:'commerce',fn:()=>playNoise(0.21,0.21,5000),c:'#23ad91',d:'receive soft noise'},
{id:'buy-hard-zap',n:'buy-hard-zap',cat:'commerce',fn:()=>playBandNoise(0.23,0.08,4700,7),c:'#23ad91',d:'buy hard filtered'},
{id:'sell-hard-pow',n:'sell-hard-pow',cat:'commerce',fn:()=>playSweepNoise(0.05,0.08,500,2500),c:'#23ad91',d:'sell hard sweep up'},
{id:'trade-hard-thump',n:'trade-hard-thump',cat:'commerce',fn:()=>playSweepNoise(0.07,0.1,6500,700),c:'#23ad91',d:'trade hard sweep down'},
{id:'bid-hard-thud',n:'bid-hard-thud',cat:'commerce',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(784,t);o.frequency.exponentialRampToValueAtTime(880,t+0.2);g.gain.setValueAtTime(0.09*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+0.25);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.3)},c:'#23ad91',d:'bid hard glide'},
{id:'offer-hard-clack',n:'offer-hard-clack',cat:'commerce',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),m=ctx.createOscillator(),mg=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(880,t);m.type='sine';m.frequency.setValueAtTime(2200.0,t);mg.gain.setValueAtTime(2640,t);m.connect(mg);mg.connect(o.frequency);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.11*globalVol,t+0.011);g.gain.exponentialRampToValueAtTime(.001,t+0.6);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.65);m.start(t);m.stop(t+0.65)},c:'#23ad91',d:'offer hard bell'},
{id:'deal-hard-clink',n:'deal-hard-clink',cat:'commerce',fn:()=>{for(let i=0;i<5;i++)setTimeout(()=>tone(2140,'square',-0.31,0.014,0.02,0.3,0.11,0.06),i*54)},c:'#23ad91',d:'deal hard rhythm'},
{id:'save-hard-ding',n:'save-hard-ding',cat:'commerce',fn:()=>{const f=554+Math.random()*235;tone(f,'sawtooth',0.15,0.002,0.025,0.1,0.13,0.08)},c:'#23ad91',d:'save hard random'},
{id:'spend-hard-dong',n:'spend-hard-dong',cat:'commerce',fn:()=>tone(1047,'sine',0.17,0.005,0.03,0.15,0.03,0.02),c:'#23ad91',d:'spend hard dong'},
{id:'earn-hard-tink',n:'earn-hard-tink',cat:'commerce',fn:()=>{tone(1319,'triangle',0.19,0.008,0.035,0.2,0.05,0.04);setTimeout(()=>tone(392,'square',0.15,0.008,0.035,0.16,0.05,0.04),77)},c:'#23ad91',d:'earn hard duo'},
{id:'post-soft-swell',n:'post-soft-swell',cat:'social',fn:()=>tone(880,'sine',0.05,0.002,0.01,0.1,0.03,0.02),c:'#ff58ae',d:'post soft swell'},
{id:'reply-soft-fade',n:'reply-soft-fade',cat:'social',fn:()=>{tone(1108,'triangle',0.07,0.005,0.015,0.15,0.05,0.04);setTimeout(()=>tone(1320,'square',0.06,0.005,0.015,0.12,0.05,0.04),41)},c:'#ff58ae',d:'reply soft duo'},
{id:'mention-soft-rise',n:'mention-soft-rise',cat:'social',fn:()=>{[1320,1760,659].forEach((f,i)=>setTimeout(()=>tone(f,'square',0.06,0.008,0.02,0.2,0.07,0.06),i*37))},c:'#ff58ae',d:'mention soft arpeggio'},
{id:'tag-soft-drop',n:'tag-soft-drop',cat:'social',fn:()=>chord([1760,659,784,1047],'sawtooth',0.11,0.011,0.025,0.25,0.09,0.08,48),c:'#ff58ae',d:'tag soft chord'},
{id:'invite-soft-hit',n:'invite-soft-hit',cat:'social',fn:()=>playNoise(0.13,0.13,3000),c:'#ff58ae',d:'invite soft noise'},
{id:'accept-soft-knock',n:'accept-soft-knock',cat:'social',fn:()=>playBandNoise(0.15,0.08,2000,7),c:'#ff58ae',d:'accept soft filtered'},
{id:'decline-soft-ring',n:'decline-soft-ring',cat:'social',fn:()=>playSweepNoise(0.17,0.08,2900,5900),c:'#ff58ae',d:'decline soft sweep up'},
{id:'block-soft-hum',n:'block-soft-hum',cat:'social',fn:()=>playSweepNoise(0.19,0.1,6500,900),c:'#ff58ae',d:'block soft sweep down'},
{id:'mute-soft-buzz',n:'mute-soft-buzz',cat:'social',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(988,t);o.frequency.exponentialRampToValueAtTime(1175,t+0.25);g.gain.setValueAtTime(0.21*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+0.3);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.35)},c:'#ff58ae',d:'mute soft glide'},
{id:'report-soft-whir',n:'report-soft-whir',cat:'social',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),m=ctx.createOscillator(),mg=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(1175,t);m.type='sine';m.frequency.setValueAtTime(2938.0,t);mg.gain.setValueAtTime(3525,t);m.connect(mg);mg.connect(o.frequency);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.23*globalVol,t+0.014);g.gain.exponentialRampToValueAtTime(.001,t+0.7);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.75);m.start(t);m.stop(t+0.75)},c:'#ff58ae',d:'report soft bell'},
{id:'flag-soft-fizz',n:'flag-soft-fizz',cat:'social',fn:()=>{for(let i=0;i<5;i++)setTimeout(()=>tone(1380,'square',0.0,0.002,0.02,0.1,0.11,0.06),i*60)},c:'#ff58ae',d:'flag soft rhythm'},
{id:'vote-soft-snap',n:'vote-soft-snap',cat:'social',fn:()=>{const f=1108+Math.random()*211;tone(f,'sawtooth',0.07,0.005,0.025,0.15,0.13,0.08)},c:'#ff58ae',d:'vote soft random'},
{id:'poll-soft-crackle',n:'poll-soft-crackle',cat:'social',fn:()=>tone(1320,'sine',0.09,0.008,0.03,0.2,0.03,0.02),c:'#ff58ae',d:'poll soft crackle'},
{id:'survey-soft-pop',n:'survey-soft-pop',cat:'social',fn:()=>{tone(1760,'triangle',0.11,0.011,0.035,0.25,0.05,0.04);setTimeout(()=>tone(659,'square',0.09,0.011,0.035,0.2,0.05,0.04),53)},c:'#ff58ae',d:'survey soft duo'},
{id:'quiz-soft-click',n:'quiz-soft-click',cat:'social',fn:()=>{[659,784,1047].forEach((f,i)=>setTimeout(()=>tone(f,'square',-0.14,0.014,0.04,0.3,0.07,0.06),i*49))},c:'#ff58ae',d:'quiz soft arpeggio'},
{id:'game-soft-beep',n:'game-soft-beep',cat:'social',fn:()=>chord([784,1047,523,988],'sawtooth',0.15,0.002,0.045,0.1,0.09,0.08,60),c:'#ff58ae',d:'game soft chord'},
{id:'challenge-soft-boop',n:'challenge-soft-boop',cat:'social',fn:()=>playNoise(0.17,0.17,4000),c:'#ff58ae',d:'challenge soft noise'},
{id:'request-soft-blip',n:'request-soft-blip',cat:'social',fn:()=>playBandNoise(0.19,0.04,1100,3),c:'#ff58ae',d:'request soft filtered'},
{id:'approve-soft-bleep',n:'approve-soft-bleep',cat:'social',fn:()=>playSweepNoise(0.21,0.08,3700,8700),c:'#ff58ae',d:'approve soft sweep up'},
{id:'deny-soft-warble',n:'deny-soft-warble',cat:'social',fn:()=>playSweepNoise(0.23,0.1,4500,1300),c:'#ff58ae',d:'deny soft sweep down'},
{id:'ignore-soft-trill',n:'ignore-soft-trill',cat:'social',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(880,t);o.frequency.exponentialRampToValueAtTime(1108,t+0.1);g.gain.setValueAtTime(0.05*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+0.15);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.2)},c:'#ff58ae',d:'ignore soft glide'},
{id:'archive-soft-roll',n:'archive-soft-roll',cat:'social',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),m=ctx.createOscillator(),mg=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(1108,t);m.type='sine';m.frequency.setValueAtTime(2770.0,t);mg.gain.setValueAtTime(3324,t);m.connect(mg);mg.connect(o.frequency);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.07*globalVol,t+0.005);g.gain.exponentialRampToValueAtTime(.001,t+0.4);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.45);m.start(t);m.stop(t+0.45)},c:'#ff58ae',d:'archive soft bell'},
{id:'pin-soft-rush',n:'pin-soft-rush',cat:'social',fn:()=>{for(let i=0;i<5;i++)setTimeout(()=>tone(2420,'square',-0.11,0.008,0.04,0.2,0.11,0.06),i*72)},c:'#ff58ae',d:'pin soft rhythm'},
{id:'unpin-soft-whoosh',n:'unpin-soft-whoosh',cat:'social',fn:()=>{const f=1760+Math.random()*223;tone(f,'sawtooth',0.11,0.011,0.045,0.25,0.13,0.08)},c:'#ff58ae',d:'unpin soft random'},
{id:'highlight-soft-swish',n:'highlight-soft-swish',cat:'social',fn:()=>tone(659,'sine',0.13,0.014,0.01,0.3,0.03,0.02),c:'#ff58ae',d:'highlight soft swish'},
{id:'feature-soft-swoosh',n:'feature-soft-swoosh',cat:'social',fn:()=>{tone(784,'triangle',0.15,0.002,0.015,0.1,0.05,0.04);setTimeout(()=>tone(1047,'square',0.12,0.002,0.015,0.08,0.05,0.04),65)},c:'#ff58ae',d:'feature soft duo'},
{id:'promote-soft-thwip',n:'promote-soft-thwip',cat:'social',fn:()=>{[1047,523,988].forEach((f,i)=>setTimeout(()=>tone(f,'square',-0.49,0.005,0.02,0.15,0.07,0.06),i*41))},c:'#ff58ae',d:'promote soft arpeggio'},
{id:'boost-soft-zip',n:'boost-soft-zip',cat:'social',fn:()=>chord([523,988,1175,880],'sawtooth',0.19,0.008,0.025,0.2,0.09,0.08,72),c:'#ff58ae',d:'boost soft chord'},
{id:'trend-soft-zap',n:'trend-soft-zap',cat:'social',fn:()=>playNoise(0.21,0.21,5000),c:'#ff58ae',d:'trend soft noise'},
{id:'post-hard-pow',n:'post-hard-pow',cat:'social',fn:()=>playBandNoise(0.23,0.08,4700,7),c:'#ff58ae',d:'post hard filtered'},
{id:'reply-hard-thump',n:'reply-hard-thump',cat:'social',fn:()=>playSweepNoise(0.05,0.08,500,2500),c:'#ff58ae',d:'reply hard sweep up'},
{id:'mention-hard-thud',n:'mention-hard-thud',cat:'social',fn:()=>playSweepNoise(0.07,0.1,6500,700),c:'#ff58ae',d:'mention hard sweep down'},
{id:'tag-hard-clack',n:'tag-hard-clack',cat:'social',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(1320,t);o.frequency.exponentialRampToValueAtTime(1760,t+0.2);g.gain.setValueAtTime(0.09*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+0.25);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.3)},c:'#ff58ae',d:'tag hard glide'},
{id:'invite-hard-clink',n:'invite-hard-clink',cat:'social',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),m=ctx.createOscillator(),mg=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(1760,t);m.type='sine';m.frequency.setValueAtTime(4400.0,t);mg.gain.setValueAtTime(5280,t);m.connect(mg);mg.connect(o.frequency);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.11*globalVol,t+0.011);g.gain.exponentialRampToValueAtTime(.001,t+0.6);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.65);m.start(t);m.stop(t+0.65)},c:'#ff58ae',d:'invite hard bell'},
{id:'accept-hard-ding',n:'accept-hard-ding',cat:'social',fn:()=>{for(let i=0;i<5;i++)setTimeout(()=>tone(2359,'square',-0.31,0.014,0.02,0.3,0.11,0.06),i*54)},c:'#ff58ae',d:'accept hard rhythm'},
{id:'decline-hard-dong',n:'decline-hard-dong',cat:'social',fn:()=>{const f=784+Math.random()*235;tone(f,'sawtooth',0.15,0.002,0.025,0.1,0.13,0.08)},c:'#ff58ae',d:'decline hard random'},
{id:'block-hard-tink',n:'block-hard-tink',cat:'social',fn:()=>tone(1047,'sine',0.17,0.005,0.03,0.15,0.03,0.02),c:'#ff58ae',d:'block hard tink'},
{id:'mute-hard-tock',n:'mute-hard-tock',cat:'social',fn:()=>{tone(523,'triangle',0.19,0.008,0.035,0.2,0.05,0.04);setTimeout(()=>tone(988,'square',0.15,0.008,0.035,0.16,0.05,0.04),77)},c:'#ff58ae',d:'mute hard duo'},
{id:'train-soft-fade',n:'train-soft-fade',cat:'ai',fn:()=>tone(500,'sine',0.05,0.002,0.01,0.1,0.03,0.02),c:'#9f4fff',d:'train soft fade'},
{id:'infer-soft-rise',n:'infer-soft-rise',cat:'ai',fn:()=>{tone(600,'triangle',0.07,0.005,0.015,0.15,0.05,0.04);setTimeout(()=>tone(700,'square',0.06,0.005,0.015,0.12,0.05,0.04),41)},c:'#9f4fff',d:'infer soft duo'},
{id:'predict-soft-drop',n:'predict-soft-drop',cat:'ai',fn:()=>{[700,800,400].forEach((f,i)=>setTimeout(()=>tone(f,'square',0.06,0.008,0.02,0.2,0.07,0.06),i*37))},c:'#9f4fff',d:'predict soft arpeggio'},
{id:'classify-soft-hit',n:'classify-soft-hit',cat:'ai',fn:()=>chord([800,400,900,1000],'sawtooth',0.11,0.011,0.025,0.25,0.09,0.08,48),c:'#9f4fff',d:'classify soft chord'},
{id:'cluster-soft-knock',n:'cluster-soft-knock',cat:'ai',fn:()=>playNoise(0.13,0.13,3000),c:'#9f4fff',d:'cluster soft noise'},
{id:'embed-soft-ring',n:'embed-soft-ring',cat:'ai',fn:()=>playBandNoise(0.15,0.08,2000,7),c:'#9f4fff',d:'embed soft filtered'},
{id:'tokenize-soft-hum',n:'tokenize-soft-hum',cat:'ai',fn:()=>playSweepNoise(0.17,0.08,2900,5900),c:'#9f4fff',d:'tokenize soft sweep up'},
{id:'parse-soft-buzz',n:'parse-soft-buzz',cat:'ai',fn:()=>playSweepNoise(0.19,0.1,6500,900),c:'#9f4fff',d:'parse soft sweep down'},
{id:'generate-soft-whir',n:'generate-soft-whir',cat:'ai',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(450,t);o.frequency.exponentialRampToValueAtTime(850,t+0.25);g.gain.setValueAtTime(0.21*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+0.3);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.35)},c:'#9f4fff',d:'generate soft glide'},
{id:'summarize-soft-fizz',n:'summarize-soft-fizz',cat:'ai',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),m=ctx.createOscillator(),mg=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(850,t);m.type='sine';m.frequency.setValueAtTime(2125.0,t);mg.gain.setValueAtTime(2550,t);m.connect(mg);mg.connect(o.frequency);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.23*globalVol,t+0.014);g.gain.exponentialRampToValueAtTime(.001,t+0.7);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.75);m.start(t);m.stop(t+0.75)},c:'#9f4fff',d:'summarize soft bell'},
{id:'translate-soft-snap',n:'translate-soft-snap',cat:'ai',fn:()=>{for(let i=0;i<5;i++)setTimeout(()=>tone(1000,'square',0.0,0.002,0.02,0.1,0.11,0.06),i*60)},c:'#9f4fff',d:'translate soft rhythm'},
{id:'transcribe-soft-crackle',n:'transcribe-soft-crackle',cat:'ai',fn:()=>{const f=600+Math.random()*211;tone(f,'sawtooth',0.07,0.005,0.025,0.15,0.13,0.08)},c:'#9f4fff',d:'transcribe soft random'},
{id:'synthesize-soft-pop',n:'synthesize-soft-pop',cat:'ai',fn:()=>tone(700,'sine',0.09,0.008,0.03,0.2,0.03,0.02),c:'#9f4fff',d:'synthesize soft pop'},
{id:'recognize-soft-click',n:'recognize-soft-click',cat:'ai',fn:()=>{tone(800,'triangle',0.11,0.011,0.035,0.25,0.05,0.04);setTimeout(()=>tone(400,'square',0.09,0.011,0.035,0.2,0.05,0.04),53)},c:'#9f4fff',d:'recognize soft duo'},
{id:'detect-soft-beep',n:'detect-soft-beep',cat:'ai',fn:()=>{[400,900,1000].forEach((f,i)=>setTimeout(()=>tone(f,'square',-0.14,0.014,0.04,0.3,0.07,0.06),i*49))},c:'#9f4fff',d:'detect soft arpeggio'},
{id:'segment-soft-boop',n:'segment-soft-boop',cat:'ai',fn:()=>chord([900,1000,1200,450],'sawtooth',0.15,0.002,0.045,0.1,0.09,0.08,60),c:'#9f4fff',d:'segment soft chord'},
{id:'track-soft-blip',n:'track-soft-blip',cat:'ai',fn:()=>playNoise(0.17,0.17,4000),c:'#9f4fff',d:'track soft noise'},
{id:'match-soft-bleep',n:'match-soft-bleep',cat:'ai',fn:()=>playBandNoise(0.19,0.04,1100,3),c:'#9f4fff',d:'match soft filtered'},
{id:'rank-soft-warble',n:'rank-soft-warble',cat:'ai',fn:()=>playSweepNoise(0.21,0.08,3700,8700),c:'#9f4fff',d:'rank soft sweep up'},
{id:'score-soft-trill',n:'score-soft-trill',cat:'ai',fn:()=>playSweepNoise(0.23,0.1,4500,1300),c:'#9f4fff',d:'score soft sweep down'},
{id:'recommend-soft-roll',n:'recommend-soft-roll',cat:'ai',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(500,t);o.frequency.exponentialRampToValueAtTime(600,t+0.1);g.gain.setValueAtTime(0.05*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+0.15);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.2)},c:'#9f4fff',d:'recommend soft glide'},
{id:'optimize-soft-rush',n:'optimize-soft-rush',cat:'ai',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),m=ctx.createOscillator(),mg=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(600,t);m.type='sine';m.frequency.setValueAtTime(1500.0,t);mg.gain.setValueAtTime(1800,t);m.connect(mg);mg.connect(o.frequency);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.07*globalVol,t+0.005);g.gain.exponentialRampToValueAtTime(.001,t+0.4);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.45);m.start(t);m.stop(t+0.45)},c:'#9f4fff',d:'optimize soft bell'},
{id:'tune-soft-whoosh',n:'tune-soft-whoosh',cat:'ai',fn:()=>{for(let i=0;i<5;i++)setTimeout(()=>tone(1800,'square',-0.11,0.008,0.04,0.2,0.11,0.06),i*72)},c:'#9f4fff',d:'tune soft rhythm'},
{id:'prune-soft-swish',n:'prune-soft-swish',cat:'ai',fn:()=>{const f=800+Math.random()*223;tone(f,'sawtooth',0.11,0.011,0.045,0.25,0.13,0.08)},c:'#9f4fff',d:'prune soft random'},
{id:'quantize-soft-swoosh',n:'quantize-soft-swoosh',cat:'ai',fn:()=>tone(400,'sine',0.13,0.014,0.01,0.3,0.03,0.02),c:'#9f4fff',d:'quantize soft swoosh'},
{id:'distill-soft-thwip',n:'distill-soft-thwip',cat:'ai',fn:()=>{tone(900,'triangle',0.15,0.002,0.015,0.1,0.05,0.04);setTimeout(()=>tone(1000,'square',0.12,0.002,0.015,0.08,0.05,0.04),65)},c:'#9f4fff',d:'distill soft duo'},
{id:'ensemble-soft-zip',n:'ensemble-soft-zip',cat:'ai',fn:()=>{[1000,1200,450].forEach((f,i)=>setTimeout(()=>tone(f,'square',-0.49,0.005,0.02,0.15,0.07,0.06),i*41))},c:'#9f4fff',d:'ensemble soft arpeggio'},
{id:'bootstrap-soft-zap',n:'bootstrap-soft-zap',cat:'ai',fn:()=>chord([1200,450,850,500],'sawtooth',0.19,0.008,0.025,0.2,0.09,0.08,72),c:'#9f4fff',d:'bootstrap soft chord'},
{id:'validate-soft-pow',n:'validate-soft-pow',cat:'ai',fn:()=>playNoise(0.21,0.21,5000),c:'#9f4fff',d:'validate soft noise'},
{id:'train-hard-thump',n:'train-hard-thump',cat:'ai',fn:()=>playBandNoise(0.23,0.08,4700,7),c:'#9f4fff',d:'train hard filtered'},
{id:'infer-hard-thud',n:'infer-hard-thud',cat:'ai',fn:()=>playSweepNoise(0.05,0.08,500,2500),c:'#9f4fff',d:'infer hard sweep up'},
{id:'predict-hard-clack',n:'predict-hard-clack',cat:'ai',fn:()=>playSweepNoise(0.07,0.1,6500,700),c:'#9f4fff',d:'predict hard sweep down'},
{id:'classify-hard-clink',n:'classify-hard-clink',cat:'ai',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(700,t);o.frequency.exponentialRampToValueAtTime(800,t+0.2);g.gain.setValueAtTime(0.09*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+0.25);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.3)},c:'#9f4fff',d:'classify hard glide'},
{id:'cluster-hard-ding',n:'cluster-hard-ding',cat:'ai',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),m=ctx.createOscillator(),mg=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(800,t);m.type='sine';m.frequency.setValueAtTime(2000.0,t);mg.gain.setValueAtTime(2400,t);m.connect(mg);mg.connect(o.frequency);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.11*globalVol,t+0.011);g.gain.exponentialRampToValueAtTime(.001,t+0.6);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.65);m.start(t);m.stop(t+0.65)},c:'#9f4fff',d:'cluster hard bell'},
{id:'embed-hard-dong',n:'embed-hard-dong',cat:'ai',fn:()=>{for(let i=0;i<5;i++)setTimeout(()=>tone(2100,'square',-0.31,0.014,0.02,0.3,0.11,0.06),i*54)},c:'#9f4fff',d:'embed hard rhythm'},
{id:'tokenize-hard-tink',n:'tokenize-hard-tink',cat:'ai',fn:()=>{const f=900+Math.random()*235;tone(f,'sawtooth',0.15,0.002,0.025,0.1,0.13,0.08)},c:'#9f4fff',d:'tokenize hard random'},
{id:'parse-hard-tock',n:'parse-hard-tock',cat:'ai',fn:()=>tone(1000,'sine',0.17,0.005,0.03,0.15,0.03,0.02),c:'#9f4fff',d:'parse hard tock'},
{id:'generate-hard-twang',n:'generate-hard-twang',cat:'ai',fn:()=>{tone(1200,'triangle',0.19,0.008,0.035,0.2,0.05,0.04);setTimeout(()=>tone(450,'square',0.15,0.008,0.035,0.16,0.05,0.04),77)},c:'#9f4fff',d:'generate hard duo'},
{id:'start-soft-rise',n:'start-soft-rise',cat:'gaming',fn:()=>tone(400,'sine',0.05,0.002,0.01,0.1,0.03,0.02),c:'#ffbb26',d:'start soft rise'},
{id:'pause-soft-drop',n:'pause-soft-drop',cat:'gaming',fn:()=>{tone(500,'triangle',0.07,0.005,0.015,0.15,0.05,0.04);setTimeout(()=>tone(600,'square',0.06,0.005,0.015,0.12,0.05,0.04),41)},c:'#ffbb26',d:'pause soft duo'},
{id:'resume-soft-hit',n:'resume-soft-hit',cat:'gaming',fn:()=>{[600,800,1000].forEach((f,i)=>setTimeout(()=>tone(f,'square',0.06,0.008,0.02,0.2,0.07,0.06),i*37))},c:'#ffbb26',d:'resume soft arpeggio'},
{id:'quit-soft-knock',n:'quit-soft-knock',cat:'gaming',fn:()=>chord([800,1000,1200,200],'sawtooth',0.11,0.011,0.025,0.25,0.09,0.08,48),c:'#ffbb26',d:'quit soft chord'},
{id:'save-soft-ring',n:'save-soft-ring',cat:'gaming',fn:()=>playNoise(0.13,0.13,3000),c:'#ffbb26',d:'save soft noise'},
{id:'load-soft-hum',n:'load-soft-hum',cat:'gaming',fn:()=>playBandNoise(0.15,0.08,2000,7),c:'#ffbb26',d:'load soft filtered'},
{id:'spawn-soft-buzz',n:'spawn-soft-buzz',cat:'gaming',fn:()=>playSweepNoise(0.17,0.08,2900,5900),c:'#ffbb26',d:'spawn soft sweep up'},
{id:'despawn-soft-whir',n:'despawn-soft-whir',cat:'gaming',fn:()=>playSweepNoise(0.19,0.1,6500,900),c:'#ffbb26',d:'despawn soft sweep down'},
{id:'respawn-soft-fizz',n:'respawn-soft-fizz',cat:'gaming',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(1500,t);o.frequency.exponentialRampToValueAtTime(1800,t+0.25);g.gain.setValueAtTime(0.21*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+0.3);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.35)},c:'#ffbb26',d:'respawn soft glide'},
{id:'warp-soft-snap',n:'warp-soft-snap',cat:'gaming',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),m=ctx.createOscillator(),mg=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(1800,t);m.type='sine';m.frequency.setValueAtTime(4500.0,t);mg.gain.setValueAtTime(5400,t);m.connect(mg);mg.connect(o.frequency);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.23*globalVol,t+0.014);g.gain.exponentialRampToValueAtTime(.001,t+0.7);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.75);m.start(t);m.stop(t+0.75)},c:'#ffbb26',d:'warp soft bell'},
{id:'portal-soft-crackle',n:'portal-soft-crackle',cat:'gaming',fn:()=>{for(let i=0;i<5;i++)setTimeout(()=>tone(900,'square',0.0,0.002,0.02,0.1,0.11,0.06),i*60)},c:'#ffbb26',d:'portal soft rhythm'},
{id:'teleport-soft-pop',n:'teleport-soft-pop',cat:'gaming',fn:()=>{const f=500+Math.random()*211;tone(f,'sawtooth',0.07,0.005,0.025,0.15,0.13,0.08)},c:'#ffbb26',d:'teleport soft random'},
{id:'dash-soft-click',n:'dash-soft-click',cat:'gaming',fn:()=>tone(600,'sine',0.09,0.008,0.03,0.2,0.03,0.02),c:'#ffbb26',d:'dash soft click'},
{id:'sprint-soft-beep',n:'sprint-soft-beep',cat:'gaming',fn:()=>{tone(800,'triangle',0.11,0.011,0.035,0.25,0.05,0.04);setTimeout(()=>tone(1000,'square',0.09,0.011,0.035,0.2,0.05,0.04),53)},c:'#ffbb26',d:'sprint soft duo'},
{id:'crouch-soft-boop',n:'crouch-soft-boop',cat:'gaming',fn:()=>{[1000,1200,200].forEach((f,i)=>setTimeout(()=>tone(f,'square',-0.14,0.014,0.04,0.3,0.07,0.06),i*49))},c:'#ffbb26',d:'crouch soft arpeggio'},
{id:'crawl-soft-blip',n:'crawl-soft-blip',cat:'gaming',fn:()=>chord([1200,200,300,1500],'sawtooth',0.15,0.002,0.045,0.1,0.09,0.08,60),c:'#ffbb26',d:'crawl soft chord'},
{id:'climb-soft-bleep',n:'climb-soft-bleep',cat:'gaming',fn:()=>playNoise(0.17,0.17,4000),c:'#ffbb26',d:'climb soft noise'},
{id:'swim-soft-warble',n:'swim-soft-warble',cat:'gaming',fn:()=>playBandNoise(0.19,0.04,1100,3),c:'#ffbb26',d:'swim soft filtered'},
{id:'fly-soft-trill-18',n:'fly-soft-trill-18',cat:'gaming',fn:()=>playSweepNoise(0.21,0.08,3700,8700),c:'#ffbb26',d:'fly soft sweep up'},
{id:'glide-soft-roll',n:'glide-soft-roll',cat:'gaming',fn:()=>playSweepNoise(0.23,0.1,4500,1300),c:'#ffbb26',d:'glide soft sweep down'},
{id:'sneak-soft-rush',n:'sneak-soft-rush',cat:'gaming',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(400,t);o.frequency.exponentialRampToValueAtTime(500,t+0.1);g.gain.setValueAtTime(0.05*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+0.15);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.2)},c:'#ffbb26',d:'sneak soft glide'},
{id:'hide-soft-whoosh',n:'hide-soft-whoosh',cat:'gaming',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),m=ctx.createOscillator(),mg=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(500,t);m.type='sine';m.frequency.setValueAtTime(1250.0,t);mg.gain.setValueAtTime(1500,t);m.connect(mg);mg.connect(o.frequency);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.07*globalVol,t+0.005);g.gain.exponentialRampToValueAtTime(.001,t+0.4);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.45);m.start(t);m.stop(t+0.45)},c:'#ffbb26',d:'hide soft bell'},
{id:'reveal-soft-swish',n:'reveal-soft-swish',cat:'gaming',fn:()=>{for(let i=0;i<5;i++)setTimeout(()=>tone(1700,'square',-0.11,0.008,0.04,0.2,0.11,0.06),i*72)},c:'#ffbb26',d:'reveal soft rhythm'},
{id:'discover-soft-swoosh',n:'discover-soft-swoosh',cat:'gaming',fn:()=>{const f=800+Math.random()*223;tone(f,'sawtooth',0.11,0.011,0.045,0.25,0.13,0.08)},c:'#ffbb26',d:'discover soft random'},
{id:'explore-soft-thwip',n:'explore-soft-thwip',cat:'gaming',fn:()=>tone(1000,'sine',0.13,0.014,0.01,0.3,0.03,0.02),c:'#ffbb26',d:'explore soft thwip'},
{id:'collect-soft-zip',n:'collect-soft-zip',cat:'gaming',fn:()=>{tone(1200,'triangle',0.15,0.002,0.015,0.1,0.05,0.04);setTimeout(()=>tone(200,'square',0.12,0.002,0.015,0.08,0.05,0.04),65)},c:'#ffbb26',d:'collect soft duo'},
{id:'craft-soft-zap',n:'craft-soft-zap',cat:'gaming',fn:()=>{[200,300,1500].forEach((f,i)=>setTimeout(()=>tone(f,'square',-0.49,0.005,0.02,0.15,0.07,0.06),i*41))},c:'#ffbb26',d:'craft soft arpeggio'},
{id:'build-soft-pow',n:'build-soft-pow',cat:'gaming',fn:()=>chord([300,1500,1800,400],'sawtooth',0.19,0.008,0.025,0.2,0.09,0.08,72),c:'#ffbb26',d:'build soft chord'},
{id:'destroy-soft-thump',n:'destroy-soft-thump',cat:'gaming',fn:()=>playNoise(0.21,0.21,5000),c:'#ffbb26',d:'destroy soft noise'},
{id:'start-hard-thud',n:'start-hard-thud',cat:'gaming',fn:()=>playBandNoise(0.23,0.08,4700,7),c:'#ffbb26',d:'start hard filtered'},
{id:'pause-hard-clack',n:'pause-hard-clack',cat:'gaming',fn:()=>playSweepNoise(0.05,0.08,500,2500),c:'#ffbb26',d:'pause hard sweep up'},
{id:'resume-hard-clink',n:'resume-hard-clink',cat:'gaming',fn:()=>playSweepNoise(0.07,0.1,6500,700),c:'#ffbb26',d:'resume hard sweep down'},
{id:'quit-hard-ding',n:'quit-hard-ding',cat:'gaming',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(600,t);o.frequency.exponentialRampToValueAtTime(800,t+0.2);g.gain.setValueAtTime(0.09*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+0.25);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.3)},c:'#ffbb26',d:'quit hard glide'},
{id:'save-hard-dong',n:'save-hard-dong',cat:'gaming',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),m=ctx.createOscillator(),mg=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(800,t);m.type='sine';m.frequency.setValueAtTime(2000.0,t);mg.gain.setValueAtTime(2400,t);m.connect(mg);mg.connect(o.frequency);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.11*globalVol,t+0.011);g.gain.exponentialRampToValueAtTime(.001,t+0.6);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.65);m.start(t);m.stop(t+0.65)},c:'#ffbb26',d:'save hard bell'},
{id:'load-hard-tink',n:'load-hard-tink',cat:'gaming',fn:()=>{for(let i=0;i<5;i++)setTimeout(()=>tone(2700,'square',-0.31,0.014,0.02,0.3,0.11,0.06),i*54)},c:'#ffbb26',d:'load hard rhythm'},
{id:'spawn-hard-tock',n:'spawn-hard-tock',cat:'gaming',fn:()=>{const f=1200+Math.random()*235;tone(f,'sawtooth',0.15,0.002,0.025,0.1,0.13,0.08)},c:'#ffbb26',d:'spawn hard random'},
{id:'ready-soft-drop',n:'ready-soft-drop',cat:'status',fn:()=>tone(523,'sine',0.05,0.002,0.01,0.1,0.03,0.02),c:'#00ca48',d:'ready soft drop'},
{id:'busy-soft-hit',n:'busy-soft-hit',cat:'status',fn:()=>{tone(659,'triangle',0.07,0.005,0.015,0.15,0.05,0.04);setTimeout(()=>tone(784,'square',0.06,0.005,0.015,0.12,0.05,0.04),41)},c:'#00ca48',d:'busy soft duo'},
{id:'idle-soft-knock',n:'idle-soft-knock',cat:'status',fn:()=>{[784,440,350].forEach((f,i)=>setTimeout(()=>tone(f,'square',0.06,0.008,0.02,0.2,0.07,0.06),i*37))},c:'#00ca48',d:'idle soft arpeggio'},
{id:'active-soft-ring',n:'active-soft-ring',cat:'status',fn:()=>chord([440,350,600,800],'sawtooth',0.11,0.011,0.025,0.25,0.09,0.08,48),c:'#00ca48',d:'active soft chord'},
{id:'inactive-soft-hum',n:'inactive-soft-hum',cat:'status',fn:()=>playNoise(0.13,0.13,3000),c:'#00ca48',d:'inactive soft noise'},
{id:'pending-soft-buzz',n:'pending-soft-buzz',cat:'status',fn:()=>playBandNoise(0.15,0.08,2000,7),c:'#00ca48',d:'pending soft filtered'},
{id:'queued-soft-whir',n:'queued-soft-whir',cat:'status',fn:()=>playSweepNoise(0.17,0.08,2900,5900),c:'#00ca48',d:'queued soft sweep up'},
{id:'running-soft-fizz',n:'running-soft-fizz',cat:'status',fn:()=>playSweepNoise(0.19,0.1,6500,900),c:'#00ca48',d:'running soft sweep down'},
{id:'done-soft-snap',n:'done-soft-snap',cat:'status',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(450,t);o.frequency.exponentialRampToValueAtTime(550,t+0.25);g.gain.setValueAtTime(0.21*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+0.3);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.35)},c:'#00ca48',d:'done soft glide'},
{id:'error-soft-crackle',n:'error-soft-crackle',cat:'status',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),m=ctx.createOscillator(),mg=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(550,t);m.type='sine';m.frequency.setValueAtTime(1375.0,t);mg.gain.setValueAtTime(1650,t);m.connect(mg);mg.connect(o.frequency);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.23*globalVol,t+0.014);g.gain.exponentialRampToValueAtTime(.001,t+0.7);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.75);m.start(t);m.stop(t+0.75)},c:'#00ca48',d:'error soft bell'},
{id:'warn-soft-pop',n:'warn-soft-pop',cat:'status',fn:()=>{for(let i=0;i<5;i++)setTimeout(()=>tone(1023,'square',0.0,0.002,0.02,0.1,0.11,0.06),i*60)},c:'#00ca48',d:'warn soft rhythm'},
{id:'info-soft-click',n:'info-soft-click',cat:'status',fn:()=>{const f=659+Math.random()*211;tone(f,'sawtooth',0.07,0.005,0.025,0.15,0.13,0.08)},c:'#00ca48',d:'info soft random'},
{id:'debug-soft-beep',n:'debug-soft-beep',cat:'status',fn:()=>tone(784,'sine',0.09,0.008,0.03,0.2,0.03,0.02),c:'#00ca48',d:'debug soft beep'},
{id:'trace-soft-boop',n:'trace-soft-boop',cat:'status',fn:()=>{tone(440,'triangle',0.11,0.011,0.035,0.25,0.05,0.04);setTimeout(()=>tone(350,'square',0.09,0.011,0.035,0.2,0.05,0.04),53)},c:'#00ca48',d:'trace soft duo'},
{id:'fatal-soft-blip',n:'fatal-soft-blip',cat:'status',fn:()=>{[350,600,800].forEach((f,i)=>setTimeout(()=>tone(f,'square',-0.14,0.014,0.04,0.3,0.07,0.06),i*49))},c:'#00ca48',d:'fatal soft arpeggio'},
{id:'critical-soft-bleep',n:'critical-soft-bleep',cat:'status',fn:()=>chord([600,800,1000,450],'sawtooth',0.15,0.002,0.045,0.1,0.09,0.08,60),c:'#00ca48',d:'critical soft chord'},
{id:'major-soft-warble',n:'major-soft-warble',cat:'status',fn:()=>playNoise(0.17,0.17,4000),c:'#00ca48',d:'major soft noise'},
{id:'minor-soft-trill',n:'minor-soft-trill',cat:'status',fn:()=>playBandNoise(0.19,0.04,1100,3),c:'#00ca48',d:'minor soft filtered'},
{id:'patch-soft-roll',n:'patch-soft-roll',cat:'status',fn:()=>playSweepNoise(0.21,0.08,3700,8700),c:'#00ca48',d:'patch soft sweep up'},
{id:'build-soft-rush',n:'build-soft-rush',cat:'status',fn:()=>playSweepNoise(0.23,0.1,4500,1300),c:'#00ca48',d:'build soft sweep down'},
{id:'deploy-soft-whoosh',n:'deploy-soft-whoosh',cat:'status',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(523,t);o.frequency.exponentialRampToValueAtTime(659,t+0.1);g.gain.setValueAtTime(0.05*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+0.15);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.2)},c:'#00ca48',d:'deploy soft glide'},
{id:'stage-soft-swish',n:'stage-soft-swish',cat:'status',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),m=ctx.createOscillator(),mg=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(659,t);m.type='sine';m.frequency.setValueAtTime(1648.0,t);mg.gain.setValueAtTime(1977,t);m.connect(mg);mg.connect(o.frequency);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.07*globalVol,t+0.005);g.gain.exponentialRampToValueAtTime(.001,t+0.4);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.45);m.start(t);m.stop(t+0.45)},c:'#00ca48',d:'stage soft bell'},
{id:'prod-soft-swoosh',n:'prod-soft-swoosh',cat:'status',fn:()=>{for(let i=0;i<5;i++)setTimeout(()=>tone(1884,'square',-0.11,0.008,0.04,0.2,0.11,0.06),i*72)},c:'#00ca48',d:'prod soft rhythm'},
{id:'test-soft-thwip',n:'test-soft-thwip',cat:'status',fn:()=>{const f=440+Math.random()*223;tone(f,'sawtooth',0.11,0.011,0.045,0.25,0.13,0.08)},c:'#00ca48',d:'test soft random'},
{id:'dev-soft-zip',n:'dev-soft-zip',cat:'status',fn:()=>tone(350,'sine',0.13,0.014,0.01,0.3,0.03,0.02),c:'#00ca48',d:'dev soft zip'},
{id:'local-soft-zap',n:'local-soft-zap',cat:'status',fn:()=>{tone(600,'triangle',0.15,0.002,0.015,0.1,0.05,0.04);setTimeout(()=>tone(800,'square',0.12,0.002,0.015,0.08,0.05,0.04),65)},c:'#00ca48',d:'local soft duo'},
{id:'remote-soft-pow',n:'remote-soft-pow',cat:'status',fn:()=>{[800,1000,450].forEach((f,i)=>setTimeout(()=>tone(f,'square',-0.49,0.005,0.02,0.15,0.07,0.06),i*41))},c:'#00ca48',d:'remote soft arpeggio'},
{id:'online-soft-thump',n:'online-soft-thump',cat:'status',fn:()=>chord([1000,450,550,523],'sawtooth',0.19,0.008,0.025,0.2,0.09,0.08,72),c:'#00ca48',d:'online soft chord'},
{id:'offline-soft-thud',n:'offline-soft-thud',cat:'status',fn:()=>playNoise(0.21,0.21,5000),c:'#00ca48',d:'offline soft noise'},
{id:'ready-hard-clack',n:'ready-hard-clack',cat:'status',fn:()=>playBandNoise(0.23,0.08,4700,7),c:'#00ca48',d:'ready hard filtered'},
{id:'busy-hard-clink',n:'busy-hard-clink',cat:'status',fn:()=>playSweepNoise(0.05,0.08,500,2500),c:'#00ca48',d:'busy hard sweep up'},
{id:'idle-hard-ding',n:'idle-hard-ding',cat:'status',fn:()=>playSweepNoise(0.07,0.1,6500,700),c:'#00ca48',d:'idle hard sweep down'},
{id:'active-hard-dong',n:'active-hard-dong',cat:'status',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(784,t);o.frequency.exponentialRampToValueAtTime(440,t+0.2);g.gain.setValueAtTime(0.09*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+0.25);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.3)},c:'#00ca48',d:'active hard glide'},
{id:'inactive-hard-tink',n:'inactive-hard-tink',cat:'status',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),m=ctx.createOscillator(),mg=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(440,t);m.type='sine';m.frequency.setValueAtTime(1100.0,t);mg.gain.setValueAtTime(1320,t);m.connect(mg);mg.connect(o.frequency);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.11*globalVol,t+0.011);g.gain.exponentialRampToValueAtTime(.001,t+0.6);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.65);m.start(t);m.stop(t+0.65)},c:'#00ca48',d:'inactive hard bell'},
{id:'pending-hard-tock',n:'pending-hard-tock',cat:'status',fn:()=>{for(let i=0;i<5;i++)setTimeout(()=>tone(2050,'square',-0.31,0.014,0.02,0.3,0.11,0.06),i*54)},c:'#00ca48',d:'pending hard rhythm'},
{id:'queued-hard-twang',n:'queued-hard-twang',cat:'status',fn:()=>{const f=600+Math.random()*235;tone(f,'sawtooth',0.15,0.002,0.025,0.1,0.13,0.08)},c:'#00ca48',d:'queued hard random'},
{id:'running-hard-pluck',n:'running-hard-pluck',cat:'status',fn:()=>tone(800,'sine',0.17,0.005,0.03,0.15,0.03,0.02),c:'#00ca48',d:'running hard pluck'},
{id:'done-hard-strum',n:'done-hard-strum',cat:'status',fn:()=>{tone(1000,'triangle',0.19,0.008,0.035,0.2,0.05,0.04);setTimeout(()=>tone(450,'square',0.15,0.008,0.035,0.16,0.05,0.04),77)},c:'#00ca48',d:'done hard duo'},
{id:'error-hard-bow',n:'error-hard-bow',cat:'status',fn:()=>{[450,550,523].forEach((f,i)=>setTimeout(()=>tone(f,'square',-0.99,0.011,0.04,0.25,0.07,0.06),i*53))},c:'#00ca48',d:'error hard arpeggio'},
{id:'warn-hard-slide',n:'warn-hard-slide',cat:'status',fn:()=>chord([550,523,659,784],'sawtooth',0.23,0.014,0.045,0.3,0.09,0.08,54),c:'#00ca48',d:'warn hard chord'},
{id:'wind-soft-hit',n:'wind-soft-hit',cat:'ambient',fn:()=>tone(100,'sine',0.05,0.002,0.01,0.1,0.03,0.02),c:'#7e7e7d',d:'wind soft hit'},
{id:'rain-soft-knock',n:'rain-soft-knock',cat:'ambient',fn:()=>{tone(200,'triangle',0.07,0.005,0.015,0.15,0.05,0.04);setTimeout(()=>tone(300,'square',0.06,0.005,0.015,0.12,0.05,0.04),41)},c:'#7e7e7d',d:'rain soft duo'},
{id:'storm-soft-ring',n:'storm-soft-ring',cat:'ambient',fn:()=>{[300,80,150].forEach((f,i)=>setTimeout(()=>tone(f,'square',0.06,0.008,0.02,0.2,0.07,0.06),i*37))},c:'#7e7e7d',d:'storm soft arpeggio'},
{id:'thunder-soft-hum',n:'thunder-soft-hum',cat:'ambient',fn:()=>chord([80,150,250,50],'sawtooth',0.11,0.011,0.025,0.25,0.09,0.08,48),c:'#7e7e7d',d:'thunder soft chord'},
{id:'lightning-soft-buzz',n:'lightning-soft-buzz',cat:'ambient',fn:()=>playNoise(0.13,0.13,3000),c:'#7e7e7d',d:'lightning soft noise'},
{id:'snow-soft-whir',n:'snow-soft-whir',cat:'ambient',fn:()=>playBandNoise(0.15,0.08,2000,7),c:'#7e7e7d',d:'snow soft filtered'},
{id:'hail-soft-fizz',n:'hail-soft-fizz',cat:'ambient',fn:()=>playSweepNoise(0.17,0.08,2900,5900),c:'#7e7e7d',d:'hail soft sweep up'},
{id:'fog-soft-snap',n:'fog-soft-snap',cat:'ambient',fn:()=>playSweepNoise(0.19,0.1,6500,900),c:'#7e7e7d',d:'fog soft sweep down'},
{id:'mist-soft-crackle',n:'mist-soft-crackle',cat:'ambient',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(60,t);o.frequency.exponentialRampToValueAtTime(120,t+0.25);g.gain.setValueAtTime(0.21*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+0.3);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.35)},c:'#7e7e7d',d:'mist soft glide'},
{id:'cloud-soft-pop',n:'cloud-soft-pop',cat:'ambient',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),m=ctx.createOscillator(),mg=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(120,t);m.type='sine';m.frequency.setValueAtTime(300.0,t);mg.gain.setValueAtTime(360,t);m.connect(mg);mg.connect(o.frequency);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.23*globalVol,t+0.014);g.gain.exponentialRampToValueAtTime(.001,t+0.7);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.75);m.start(t);m.stop(t+0.75)},c:'#7e7e7d',d:'cloud soft bell'},
{id:'sun-soft-click',n:'sun-soft-click',cat:'ambient',fn:()=>{for(let i=0;i<5;i++)setTimeout(()=>tone(600,'square',0.0,0.002,0.02,0.1,0.11,0.06),i*60)},c:'#7e7e7d',d:'sun soft rhythm'},
{id:'moon-soft-beep',n:'moon-soft-beep',cat:'ambient',fn:()=>{const f=200+Math.random()*211;tone(f,'sawtooth',0.07,0.005,0.025,0.15,0.13,0.08)},c:'#7e7e7d',d:'moon soft random'},
{id:'star-soft-boop',n:'star-soft-boop',cat:'ambient',fn:()=>tone(300,'sine',0.09,0.008,0.03,0.2,0.03,0.02),c:'#7e7e7d',d:'star soft boop'},
{id:'space-soft-blip',n:'space-soft-blip',cat:'ambient',fn:()=>{tone(80,'triangle',0.11,0.011,0.035,0.25,0.05,0.04);setTimeout(()=>tone(150,'square',0.09,0.011,0.035,0.2,0.05,0.04),53)},c:'#7e7e7d',d:'space soft duo'},
{id:'void-soft-bleep',n:'void-soft-bleep',cat:'ambient',fn:()=>{[150,250,50].forEach((f,i)=>setTimeout(()=>tone(f,'square',-0.14,0.014,0.04,0.3,0.07,0.06),i*49))},c:'#7e7e7d',d:'void soft arpeggio'},
{id:'dream-soft-warble',n:'dream-soft-warble',cat:'ambient',fn:()=>chord([250,50,400,60],'sawtooth',0.15,0.002,0.045,0.1,0.09,0.08,60),c:'#7e7e7d',d:'dream soft chord'},
{id:'sleep-soft-trill',n:'sleep-soft-trill',cat:'ambient',fn:()=>playNoise(0.17,0.17,4000),c:'#7e7e7d',d:'sleep soft noise'},
{id:'wake-soft-roll',n:'wake-soft-roll',cat:'ambient',fn:()=>playBandNoise(0.19,0.04,1100,3),c:'#7e7e7d',d:'wake soft filtered'},
{id:'dawn-soft-rush',n:'dawn-soft-rush',cat:'ambient',fn:()=>playSweepNoise(0.21,0.08,3700,8700),c:'#7e7e7d',d:'dawn soft sweep up'},
{id:'dusk-soft-whoosh',n:'dusk-soft-whoosh',cat:'ambient',fn:()=>playSweepNoise(0.23,0.1,4500,1300),c:'#7e7e7d',d:'dusk soft sweep down'},
{id:'noon-soft-swish',n:'noon-soft-swish',cat:'ambient',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(100,t);o.frequency.exponentialRampToValueAtTime(200,t+0.1);g.gain.setValueAtTime(0.05*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+0.15);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.2)},c:'#7e7e7d',d:'noon soft glide'},
{id:'midnight-soft-swoosh',n:'midnight-soft-swoosh',cat:'ambient',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),m=ctx.createOscillator(),mg=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(200,t);m.type='sine';m.frequency.setValueAtTime(500.0,t);mg.gain.setValueAtTime(600,t);m.connect(mg);mg.connect(o.frequency);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.07*globalVol,t+0.005);g.gain.exponentialRampToValueAtTime(.001,t+0.4);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.45);m.start(t);m.stop(t+0.45)},c:'#7e7e7d',d:'midnight soft bell'},
{id:'spring-soft-thwip',n:'spring-soft-thwip',cat:'ambient',fn:()=>{for(let i=0;i<5;i++)setTimeout(()=>tone(1400,'square',-0.11,0.008,0.04,0.2,0.11,0.06),i*72)},c:'#7e7e7d',d:'spring soft rhythm'},
{id:'summer-soft-zip',n:'summer-soft-zip',cat:'ambient',fn:()=>{const f=80+Math.random()*223;tone(f,'sawtooth',0.11,0.011,0.045,0.25,0.13,0.08)},c:'#7e7e7d',d:'summer soft random'},
{id:'fall-soft-zap',n:'fall-soft-zap',cat:'ambient',fn:()=>tone(150,'sine',0.13,0.014,0.01,0.3,0.03,0.02),c:'#7e7e7d',d:'fall soft zap'},
{id:'winter-soft-pow',n:'winter-soft-pow',cat:'ambient',fn:()=>{tone(250,'triangle',0.15,0.002,0.015,0.1,0.05,0.04);setTimeout(()=>tone(50,'square',0.12,0.002,0.015,0.08,0.05,0.04),65)},c:'#7e7e7d',d:'winter soft duo'},
{id:'forest-soft-thump',n:'forest-soft-thump',cat:'ambient',fn:()=>{[50,400,60].forEach((f,i)=>setTimeout(()=>tone(f,'square',-0.49,0.005,0.02,0.15,0.07,0.06),i*41))},c:'#7e7e7d',d:'forest soft arpeggio'},
{id:'ocean-soft-thud',n:'ocean-soft-thud',cat:'ambient',fn:()=>chord([400,60,120,100],'sawtooth',0.19,0.008,0.025,0.2,0.09,0.08,72),c:'#7e7e7d',d:'ocean soft chord'},
{id:'desert-soft-clack',n:'desert-soft-clack',cat:'ambient',fn:()=>playNoise(0.21,0.21,5000),c:'#7e7e7d',d:'desert soft noise'},
{id:'wind-hard-clink',n:'wind-hard-clink',cat:'ambient',fn:()=>playBandNoise(0.23,0.08,4700,7),c:'#7e7e7d',d:'wind hard filtered'},
{id:'rain-hard-ding',n:'rain-hard-ding',cat:'ambient',fn:()=>playSweepNoise(0.05,0.08,500,2500),c:'#7e7e7d',d:'rain hard sweep up'},
{id:'storm-hard-dong',n:'storm-hard-dong',cat:'ambient',fn:()=>playSweepNoise(0.07,0.1,6500,700),c:'#7e7e7d',d:'storm hard sweep down'},
{id:'thunder-hard-tink',n:'thunder-hard-tink',cat:'ambient',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(300,t);o.frequency.exponentialRampToValueAtTime(80,t+0.2);g.gain.setValueAtTime(0.09*globalVol,t);g.gain.exponentialRampToValueAtTime(.001,t+0.25);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.3)},c:'#7e7e7d',d:'thunder hard glide'},
{id:'lightning-hard-tock',n:'lightning-hard-tock',cat:'ambient',fn:()=>{initAudio();const t=now(),o=ctx.createOscillator(),g=ctx.createGain(),m=ctx.createOscillator(),mg=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(80,t);m.type='sine';m.frequency.setValueAtTime(200.0,t);mg.gain.setValueAtTime(240,t);m.connect(mg);mg.connect(o.frequency);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.11*globalVol,t+0.011);g.gain.exponentialRampToValueAtTime(.001,t+0.6);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+0.65);m.start(t);m.stop(t+0.65)},c:'#7e7e7d',d:'lightning hard bell'},
{id:'snow-hard-twang',n:'snow-hard-twang',cat:'ambient',fn:()=>{for(let i=0;i<5;i++)setTimeout(()=>tone(1850,'square',-0.31,0.014,0.02,0.3,0.11,0.06),i*54)},c:'#7e7e7d',d:'snow hard rhythm'},
{id:'hail-hard-pluck',n:'hail-hard-pluck',cat:'ambient',fn:()=>{const f=250+Math.random()*235;tone(f,'sawtooth',0.15,0.002,0.025,0.1,0.13,0.08)},c:'#7e7e7d',d:'hail hard random'},
{id:'fog-hard-strum',n:'fog-hard-strum',cat:'ambient',fn:()=>tone(50,'sine',0.17,0.005,0.03,0.15,0.03,0.02),c:'#7e7e7d',d:'fog hard strum'},
{id:'mist-hard-bow',n:'mist-hard-bow',cat:'ambient',fn:()=>{tone(400,'triangle',0.19,0.008,0.035,0.2,0.05,0.04);setTimeout(()=>tone(60,'square',0.15,0.008,0.035,0.16,0.05,0.04),77)},c:'#7e7e7d',d:'mist hard duo'}];

const catColors = {
  all:'#0a0a0a', feedback:'#00c978', interaction:'#3b82f6', notification:'#f59e0b',
  system:'#6366f1', form:'#8b5cf6', media:'#ef4444', gesture:'#f97316',
  navigation:'#06b6d4', commerce:'#10b981', social:'#ec4899', ai:'#a855f7',
  gaming:'#eab308', status:'#22c55e', ambient:'#64748b'
};
const cats = ['all','feedback','interaction','notification','system','form','media','gesture','navigation','commerce','social','ai','gaming','status','ambient'];

// ===== SVG ICONS =====
const copyIco = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
const arrowIco = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>';
const tickIco = '<svg viewBox="0 0 24 24" fill="none" stroke="#00c978" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

// ===== CATEGORY TABS =====
const tabsEl = document.getElementById('cat-tabs');
let activeCat = 'all';
cats.forEach(cat => {
  const pill = document.createElement('button');
  pill.className = 'cat-pill' + (cat === 'all' ? ' active' : '');
  pill.setAttribute('role', 'tab');
  pill.setAttribute('aria-selected', cat === 'all');
  pill.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
  pill.dataset.cat = cat;
  pill.addEventListener('click', () => {
    activeCat = cat;
    visibleCount = PAGE_SIZE;
    document.querySelectorAll('.cat-pill').forEach(p => {
      p.classList.toggle('active', p === pill);
      p.setAttribute('aria-selected', p === pill);
    });
    renderGrid();
    playClick();
  });
  tabsEl.appendChild(pill);
});

// ===== GRID WITH LOAD MORE =====
const grid = document.getElementById('sound-grid');
const loadMoreWrap = document.getElementById('load-more-wrap');
const loadMoreBtn = document.getElementById('load-more-btn');
let currentId = '', currentSound = null;
const PAGE_SIZE = 100;
let visibleCount = PAGE_SIZE;

function getFilteredList() {
  return SD.filter(s => activeCat === 'all' || s.cat === activeCat);
}

function renderGrid() {
  grid.innerHTML = '';
  const list = getFilteredList();
  const showing = list.slice(0, visibleCount);

  showing.forEach(s => {
    const cell = document.createElement('div');
    cell.className = 'sound-cell' + (s.id === currentId ? ' active' : '');
    cell.dataset.id = s.id;
    cell.style.setProperty('--dot-c', s.c);
    cell.setAttribute('role', 'listitem');
    cell.innerHTML = `
      <div class="sc-actions">
        <button class="sc-action-btn sc-copy" aria-label="Copy play() code" title="Copy">${copyIco}</button>
      </div>
      <span class="sc-dot" style="background:${s.c}"></span>
      <div class="sc-label"><span class="sc-name">${s.n}</span><span class="sc-arrow">${arrowIco}</span></div>`;

    cell.addEventListener('click', e => {
      if (e.target.closest('.sc-action-btn')) return;
      selectSound(s);
    });
    cell.querySelector('.sc-copy').addEventListener('click', e => {
      e.stopPropagation();
      copyWithTick('play("' + s.id + '")', e.currentTarget);
    });
    grid.appendChild(cell);
  });

  // Request cell at end
  if (visibleCount >= list.length) {
    const req = document.createElement('div');
    req.className = 'request-cell';
    req.innerHTML = '<span>Don\'t see what you need?</span><p>Open an issue and describe the sound. If it makes sense, it goes in.</p><a class="request-btn" href="https://github.com/uxasim-rgb/sonic-flow/issues/new" target="_blank" rel="noopener">Request a sound</a>';
    grid.appendChild(req);
  }

  // Show/hide load more
  loadMoreWrap.style.display = visibleCount < list.length ? 'flex' : 'none';
  const remaining = list.length - visibleCount;
  loadMoreBtn.textContent = remaining > 0 ? `Load ${Math.min(remaining, PAGE_SIZE)} more sounds` : '';
}

loadMoreBtn.addEventListener('click', () => {
  visibleCount += PAGE_SIZE;
  renderGrid();
  playClick();
});

// ===== COPY HELPER WITH FALLBACK + TICK =====
function copyText(text) {
  return new Promise((resolve, reject) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(resolve).catch(reject);
    } else {
      // fallback for non-HTTPS / file:// / older browsers
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); resolve(); }
      catch(e) { reject(e); }
      finally { ta.remove(); }
    }
  });
}

function showTick(btn) {
  const saved = btn.innerHTML;
  btn.innerHTML = tickIco;
  btn.classList.add('copied');
  playSuccessSoft();
  setTimeout(() => { btn.innerHTML = saved; btn.classList.remove('copied'); }, 1500);
}

// ===== GRID COPY =====
function copyWithTick(text, btn) {
  copyText(text).then(() => {
    btn.innerHTML = tickIco;
    btn.classList.add('copied');
    playSuccessSoft();
    setTimeout(() => { btn.innerHTML = copyIco; btn.classList.remove('copied'); }, 1500);
  });
}

function selectSound(s) {
  currentId = s.id; currentSound = s; s.fn();
  document.querySelectorAll('.sound-cell').forEach(c => c.classList.toggle('active', c.dataset.id === s.id));
  document.getElementById('np-bar').classList.add('visible');
  document.getElementById('np-name').textContent = s.n;
  document.getElementById('np-desc').textContent = s.cat + ' · ' + s.d;
  document.getElementById('np-dot').style.background = s.c;
}

renderGrid();

// ===== NOW PLAYING =====
document.getElementById('np-replay').addEventListener('click', () => { if (currentSound) currentSound.fn() });
document.getElementById('np-close').addEventListener('click', () => {
  document.getElementById('np-bar').classList.remove('visible');
  document.querySelectorAll('.sound-cell.active').forEach(c => c.classList.remove('active'));
  currentId = ''; currentSound = null;
});

// ===== THEME =====
const themeBtn = document.getElementById('theme-btn');
function setTheme(t) { document.documentElement.setAttribute('data-theme', t); localStorage.setItem('sf-theme', t) }
themeBtn.addEventListener('click', () => {
  setTheme((document.documentElement.getAttribute('data-theme') || 'light') === 'dark' ? 'light' : 'dark');
  playClick();
});
(() => { const s = localStorage.getItem('sf-theme'); setTheme(s || (matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light')); })();

// ===== VOLUME =====
document.getElementById('volume').addEventListener('input', e => {
  globalVol = e.target.value / 100;
  document.getElementById('vol-val').textContent = e.target.value;
  if (masterGain) masterGain.gain.setTargetAtTime(globalVol, ctx.currentTime, .05);
});

// ===== HERO COPY =====
const copyInstallBtn = document.getElementById('copy-install');
copyInstallBtn.addEventListener('click', () => {
  copyText(document.getElementById('install-cmd').value).then(() => showTick(copyInstallBtn));
});

// ===== INSTALL SECTION COPY =====
document.getElementById('copy-cmd').addEventListener('click', function() {
  const btn = this;
  copyText(document.querySelector('#cmd code').textContent).then(() => showTick(btn));
});

// ===== WAVEFORM =====
const trace = document.getElementById('trace'), traceEcho = document.getElementById('trace-echo');
let scopeD = new Float32Array(300), echoD = new Float32Array(300);
function drawScope() {
  requestAnimationFrame(drawScope);
  if (!analyser) return;
  const buf = new Float32Array(analyser.fftSize);
  analyser.getFloatTimeDomainData(buf);
  echoD.set(scopeD);
  for (let i = 0; i < 300; i++) { const idx = Math.floor(i * buf.length / 300); scopeD[i] = buf[idx] }
  function mp(data) { let d = 'M'; for (let i = 0; i < 300; i++) { d += `${i},${10 + data[i] * 8} `; if (i < 299) d += 'L' } return d }
  trace.setAttribute('d', mp(scopeD));
  traceEcho.setAttribute('d', mp(echoD));
}
drawScope();

// ===== SOUND WIRING =====
document.querySelectorAll('.nav-link').forEach(a => { a.addEventListener('mouseenter', () => playHover()); a.addEventListener('click', () => playClick()); });
document.querySelectorAll('.icon-btn').forEach(b => { b.addEventListener('mouseenter', () => playHoverSoft()); });
document.querySelector('.logo').addEventListener('mouseenter', () => playHover());
document.querySelector('.gh-btn').addEventListener('mouseenter', () => playHoverSoft());
document.querySelector('.gh-btn').addEventListener('mousedown', () => playPress());
document.querySelector('.gh-btn').addEventListener('mouseup', () => playRelease());

// Demo interactions
document.getElementById('like-demo').addEventListener('click', function() {
  const liked = this.getAttribute('aria-pressed') === 'true';
  this.setAttribute('aria-pressed', !liked);
  const countEl = this.querySelector('.like-count');
  countEl.textContent = liked ? '12' : '13';
  if (!liked) playConfirm(); else playCancel();
});
document.getElementById('switch-demo').addEventListener('click', function() {
  const c = this.getAttribute('aria-checked') === 'true';
  this.setAttribute('aria-checked', !c);
  if (!c) playToggleOn(); else playToggleOff();
});
document.getElementById('save-demo').addEventListener('mousedown', function() { playPress() });
document.getElementById('save-demo').addEventListener('mouseup', function() { playRelease(); this.classList.toggle('is-saved'); setTimeout(() => this.classList.toggle('is-saved'), 1200) });

// Feature cards
document.querySelectorAll('.feat-card').forEach(c => {
  const sf = c.dataset.sf;
  c.addEventListener('click', () => { if (sf === 'click') playClick(); else if (sf === 'bloom') playBloom(); else if (sf === 'sparkle') playSparkle(); });
  c.addEventListener('mouseenter', () => playHoverSoft());
});

// Install tabs
document.querySelectorAll('.install-tab').forEach(t => {
  t.addEventListener('click', function() {
    document.querySelectorAll('.install-tab').forEach(x => { x.classList.toggle('active', x === this) });
    const m = this.dataset.method;
    document.getElementById('install-npm').style.display = m === 'npm' ? 'flex' : 'none';
    document.getElementById('install-cdn').classList.toggle('active', m === 'cdn');
    playClick();
  });
});
document.querySelectorAll('.code-tab').forEach(t => {
  t.addEventListener('click', function() {
    document.querySelectorAll('.code-tab').forEach(x => x.classList.toggle('active', x === this));
    document.querySelectorAll('.code-pane').forEach(p => p.classList.toggle('active', p.id === this.dataset.pane));
    playClick();
  });
});

// Install cmd cycle
const pkgs = ['npm install sonic-flow', 'yarn add sonic-flow', 'pnpm add sonic-flow']; let pi = 0;
document.getElementById('cmd').addEventListener('click', function() { pi = (pi + 1) % pkgs.length; this.querySelector('code').textContent = pkgs[pi]; playClick() });
