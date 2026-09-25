/*
 * Sonic — site UI for sonic.uxasim.com: sound pad, library, player, live demos, theme.
 * Runs after sounds.js, which defines SD and the Web Audio globals (ctx, masterGain, analyser, globalVol).
 */
(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const BY_ID = new Map(SD.map(s => [s.id, s]));
  const CATS = [...new Set(SD.map(s => s.cat))];
  const COUNT = SD.reduce((m, s) => { m[s.cat] = (m[s.cat] || 0) + 1; return m; }, {});
  const HAYSTACK = SD.map(s => `${s.id} ${s.cat} ${s.d}`.toLowerCase());
  const LABELS = { ai: 'AI', iot: 'IoT', devops: 'DevOps' };
  const PAD = ['success', 'error', 'bell', 'pop', 'toggle-on', 'message', 'sparkle', 'coin', 'level-up'];
  const PAGE = 60;

  const label = cat => LABELS[cat] || cat.charAt(0).toUpperCase() + cat.slice(1);
  const sentence = text => text.charAt(0).toUpperCase() + text.slice(1);
  const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
  const isTyping = el => el instanceof Element && el.closest('input, textarea, select, [contenteditable="true"]');
  const store = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch { /* storage unavailable */ } },
  };

  const announcer = $('#announcer');
  function announce(message) {
    announcer.textContent = '';
    requestAnimationFrame(() => { announcer.textContent = message; });
  }

  // ── Scope and activity meter ─────────────────────────────
  // Draws the live waveform on both canvases while audio is audible, then settles back to a flat line.
  const meter = (() => {
    const scopes = ['#hero-scope', '#player-scope'].map(sel => {
      const canvas = $(sel);
      return { canvas, g: canvas.getContext('2d'), w: 0, h: 0 };
    });
    const marked = new Set();
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let buf = null, raf = 0, wokeAt = 0, loudAt = 0, colors = {};

    function readColors() {
      const css = getComputedStyle(document.documentElement);
      colors = { idle: css.getPropertyValue('--line-strong').trim(), live: css.getPropertyValue('--brand').trim() };
    }
    function size() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      for (const s of scopes) {
        const { width, height } = s.canvas.getBoundingClientRect();
        s.w = width; s.h = height;
        if (!width) continue;
        s.canvas.width = Math.round(width * dpr);
        s.canvas.height = Math.round(height * dpr);
        s.g.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    }
    function draw(s, data) {
      const { g, w, h } = s;
      if (!w) return;
      const mid = h / 2;
      g.clearRect(0, 0, w, h);
      g.lineWidth = 1.5;
      g.lineJoin = 'round';
      g.lineCap = 'round';
      g.strokeStyle = data ? colors.live : colors.idle;
      g.beginPath();
      if (!data) {
        g.moveTo(0, mid);
        g.lineTo(w, mid);
      } else {
        const n = data.length, step = Math.max(1, Math.floor(n / w));
        for (let i = 0; i < n; i += step) {
          const x = (i / (n - 1)) * w;
          const y = Math.max(1, Math.min(h - 1, mid - data[i] * h * 1.6));
          if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
        }
      }
      g.stroke();
    }
    const flat = () => scopes.forEach(s => draw(s, null));

    function tick(t) {
      raf = 0;
      let data = null;
      if (analyser) {
        if (!buf || buf.length !== analyser.fftSize) buf = new Float32Array(analyser.fftSize);
        analyser.getFloatTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
        if (Math.sqrt(sum / buf.length) > 0.002) loudAt = t;
        data = buf;
      }
      // Stay awake briefly after a trigger so staggered notes are caught.
      if (t - loudAt > 350 && t - wokeAt > 250) {
        flat();
        unmark();
        return;
      }
      if (!reducedMotion.matches) scopes.forEach(s => draw(s, data));
      raf = requestAnimationFrame(tick);
    }
    function wake() {
      wokeAt = loudAt = performance.now();
      if (!raf) raf = requestAnimationFrame(tick);
    }
    function mark(elements) {
      unmark();
      for (const el of elements) if (el) { el.classList.add('is-playing'); marked.add(el); }
    }
    function unmark() {
      marked.forEach(el => el.classList.remove('is-playing'));
      marked.clear();
    }
    function refresh() { readColors(); size(); if (!raf) flat(); }

    let resizeTimer;
    window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(refresh, 100); });
    refresh();
    return { wake, mark, refresh };
  })();

  // ── Playback ─────────────────────────────────────────────
  // Previews always play. Interface sounds (tabs, copy, theme) follow the header toggle.
  let uiSounds = store.get('sf-ui-sounds') !== 'off';

  function trigger(id) {
    const s = BY_ID.get(id);
    if (!s) return;
    s.fn();
    meter.wake();
  }
  function uiSound(id) { if (uiSounds) trigger(id); }

  const uiBtn = $('#ui-sound-btn');
  function syncUiButton() {
    uiBtn.setAttribute('aria-pressed', String(uiSounds));
    uiBtn.title = `Interface sounds: ${uiSounds ? 'on' : 'off'}`;
  }
  uiBtn.addEventListener('click', () => {
    uiSounds = !uiSounds;
    store.set('sf-ui-sounds', uiSounds ? 'on' : 'off');
    syncUiButton();
    if (uiSounds) trigger('toggle-on');
  });
  syncUiButton();

  // ── Theme ────────────────────────────────────────────────
  const root = document.documentElement;
  const darkQuery = matchMedia('(prefers-color-scheme: dark)');
  const themeBtn = $('#theme-btn');
  const currentTheme = () => root.dataset.theme || (darkQuery.matches ? 'dark' : 'light');

  function syncTheme() {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    themeBtn.setAttribute('aria-label', `Switch to ${next} theme`);
    themeBtn.title = `Switch to ${next} theme`;
    if (root.dataset.theme) {
      $$('meta[name="theme-color"]').forEach(m => { m.content = root.dataset.theme === 'dark' ? '#0a0a0a' : '#ffffff'; });
    }
    meter.refresh();
  }
  themeBtn.addEventListener('click', () => {
    root.dataset.theme = currentTheme() === 'dark' ? 'light' : 'dark';
    store.set('sf-theme', root.dataset.theme);
    syncTheme();
    uiSound('click-soft');
  });
  darkQuery.addEventListener('change', syncTheme);
  syncTheme();

  // ── Clipboard ────────────────────────────────────────────
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
      document.body.append(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch { /* no fallback left */ }
      ta.remove();
      return ok;
    }
  }
  async function copyWithFeedback(btn, text, message = 'Copied to clipboard') {
    if (!(await copyText(text))) return;
    btn.classList.add('is-done');
    clearTimeout(btn.doneTimer);
    btn.doneTimer = setTimeout(() => btn.classList.remove('is-done'), 1600);
    uiSound('success-soft');
    announce(message);
  }
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-copy-from]');
    if (btn) copyWithFeedback(btn, $(btn.dataset.copyFrom).textContent.trim());
  });
  $('#code-copy').addEventListener('click', e => {
    const pane = $$('[id^="cp-"]').find(p => !p.hidden);
    if (pane) copyWithFeedback(e.currentTarget, pane.textContent.trim());
  });

  // ── Player ───────────────────────────────────────────────
  const player = $('#player');
  const playerEq = $('#player-eq');
  const playerCopy = $('#player-copy');
  let current = null;

  function openPlayer(s) {
    $('#player-name').textContent = s.id;
    $('#player-desc').textContent = `${label(s.cat)} · ${sentence(s.d)}`;
    $('#player-code').textContent = `play("${s.id}")`;
    playerCopy.setAttribute('aria-label', `Copy play("${s.id}")`);
    if (player.classList.contains('is-open')) return;
    player.classList.add('is-open');
    player.inert = false;
    document.body.classList.add('has-player');
    meter.refresh();
  }
  function closePlayer() {
    player.classList.remove('is-open');
    player.inert = true;
    document.body.classList.remove('has-player');
    current = null;
    $$('.sound.is-current').forEach(el => el.classList.remove('is-current'));
  }
  $('#player-replay').addEventListener('click', () => { if (current) preview(current); });
  $('#player-close').addEventListener('click', closePlayer);
  playerCopy.addEventListener('click', () => {
    if (current) copyWithFeedback(playerCopy, `play("${current.id}")`, `Copied play("${current.id}")`);
  });

  const volume = $('#volume');
  const volumeOut = $('#volume-out');
  function setVolume(v) {
    volume.value = v;
    volumeOut.textContent = v;
    globalVol = v / 100;
    if (masterGain) masterGain.gain.setTargetAtTime(globalVol, ctx.currentTime, 0.03);
  }
  const savedVolume = store.get('sf-volume');
  if (savedVolume !== null && Number(savedVolume) >= 0 && Number(savedVolume) <= 100) setVolume(Number(savedVolume));
  volume.addEventListener('input', () => {
    setVolume(Number(volume.value));
    store.set('sf-volume', volume.value);
  });

  // ── Library ──────────────────────────────────────────────
  const grid = $('#sound-grid');
  const tpl = $('#sound-tpl');
  const search = $('#search');
  const catList = $('#cat-list');
  const moreBtn = $('#more-btn');
  const empty = $('#empty');
  const state = { cat: 'all', query: '', limit: PAGE };

  function preview(s, card) {
    trigger(s.id);
    current = s;
    $$('.sound.is-current', grid).forEach(el => el.classList.remove('is-current'));
    const li = card || grid.querySelector(`.sound[data-id="${CSS.escape(s.id)}"]`);
    if (li) li.classList.add('is-current');
    meter.mark([li, playerEq]);
    openPlayer(s);
  }

  function matches() {
    const terms = state.query.toLowerCase().split(/\s+/).filter(Boolean);
    return SD.filter((s, i) => (state.cat === 'all' || s.cat === state.cat) && terms.every(t => HAYSTACK[i].includes(t)));
  }
  function card(s) {
    const li = tpl.content.firstElementChild.cloneNode(true);
    li.dataset.id = s.id;
    if (current && current.id === s.id) li.classList.add('is-current');
    li.querySelector('.sound-name').textContent = s.id;
    li.querySelector('.sound-desc').textContent = s.d;
    const copy = li.querySelector('.copy-btn');
    copy.setAttribute('aria-label', `Copy play("${s.id}")`);
    copy.title = `Copy play("${s.id}")`;
    return li;
  }
  function render() {
    const list = matches();
    const shown = list.slice(0, state.limit);
    const rest = list.length - shown.length;
    grid.replaceChildren(...shown.map(card));
    moreBtn.hidden = rest <= 0;
    moreBtn.textContent = `Show ${Math.min(rest, PAGE)} more`;
    $('#result-count').textContent = rest > 0 ? `${shown.length} of ${list.length}` : plural(list.length, 'sound');
    empty.hidden = list.length > 0;
    $('#empty-q').textContent = state.query.trim();
    $('#empty-in').textContent = state.cat === 'all' ? '' : ` in ${label(state.cat)}`;
    $('#empty-all').hidden = state.cat === 'all';
  }

  function selectCategory(cat) {
    state.cat = cat;
    state.limit = PAGE;
    $$('.cat', catList).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cat === cat)));
    render();
    // After a long scroll, bring the top of the results back into view.
    const top = $('#sounds .toolbar').getBoundingClientRect().top;
    if (top < 0) $('#sounds .toolbar').scrollIntoView({ block: 'start' });
  }

  catList.append(...['all', ...CATS].map(cat => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cat';
    btn.dataset.cat = cat;
    btn.setAttribute('aria-pressed', String(cat === 'all'));
    const name = document.createElement('span');
    name.textContent = cat === 'all' ? 'All' : label(cat);
    const count = document.createElement('span');
    count.className = 'count';
    count.textContent = cat === 'all' ? SD.length : COUNT[cat];
    btn.append(name, count);
    li.append(btn);
    return li;
  }));
  catList.addEventListener('click', e => {
    const btn = e.target.closest('.cat');
    if (!btn || btn.dataset.cat === state.cat) return;
    selectCategory(btn.dataset.cat);
    btn.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    uiSound('click-soft');
  });
  $('#empty-all').addEventListener('click', () => selectCategory('all'));

  search.placeholder = `Search ${SD.length} sounds`;
  search.addEventListener('input', () => {
    state.query = search.value;
    state.limit = PAGE;
    render();
  });
  search.addEventListener('keydown', e => {
    if (e.key !== 'Escape' || !search.value) return;
    e.preventDefault();
    search.value = '';
    state.query = '';
    render();
  });

  moreBtn.addEventListener('click', () => {
    const first = state.limit;
    state.limit += PAGE;
    render();
    uiSound('click-soft');
    // Keep keyboard users in place: move focus to the first newly added sound.
    const added = grid.children[first];
    if (added) added.querySelector('.sound-play').focus({ preventScroll: true });
  });

  grid.addEventListener('click', e => {
    const li = e.target.closest('.sound');
    if (!li) return;
    const s = BY_ID.get(li.dataset.id);
    const copy = e.target.closest('.copy-btn');
    if (copy) copyWithFeedback(copy, `play("${s.id}")`, `Copied play("${s.id}")`);
    else if (e.target.closest('.sound-play')) preview(s, li);
  });
  // Arrow keys move through the grid and play each sound, for quick auditioning.
  grid.addEventListener('keydown', e => {
    if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
    const btn = e.target.closest('.sound-play');
    if (!btn) return;
    const buttons = $$('.sound-play', grid);
    const cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
    const delta = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: cols, ArrowUp: -cols }[e.key];
    const next = buttons[buttons.indexOf(btn) + delta];
    if (!next) return;
    e.preventDefault();
    next.focus();
    const li = next.closest('.sound');
    preview(BY_ID.get(li.dataset.id), li);
  });

  // ── Sound pad ────────────────────────────────────────────
  const pad = $('#pad');
  PAD.filter(id => BY_ID.has(id)).forEach((id, i) => {
    const key = document.createElement('button');
    key.type = 'button';
    key.className = 'pad-key';
    key.dataset.id = id;
    key.setAttribute('aria-keyshortcuts', String(i + 1));
    const num = document.createElement('span');
    num.className = 'num';
    num.setAttribute('aria-hidden', 'true');
    num.textContent = i + 1;
    const name = document.createElement('span');
    name.className = 'name';
    name.textContent = id;
    key.append(num, name);
    pad.append(key);
  });
  function hitPad(i) {
    const key = pad.children[i];
    if (!key) return;
    key.classList.add('is-hit');
    clearTimeout(key.hitTimer);
    key.hitTimer = setTimeout(() => key.classList.remove('is-hit'), 140);
    preview(BY_ID.get(key.dataset.id));
  }
  pad.addEventListener('click', e => {
    const key = e.target.closest('.pad-key');
    if (key) hitPad(Array.prototype.indexOf.call(pad.children, key));
  });

  // ── Keyboard shortcuts ───────────────────────────────────
  document.addEventListener('keydown', e => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'Escape' && player.classList.contains('is-open') && !isTyping(e.target)) {
      closePlayer();
      return;
    }
    if (isTyping(e.target)) return;
    if (e.key === '/') {
      e.preventDefault();
      search.focus();
      search.select();
    } else if (/^[1-9]$/.test(e.key) && !e.repeat) {
      hitPad(Number(e.key) - 1);
    }
  });

  // ── Live demos ───────────────────────────────────────────
  // Same data-sf-* contract as bind() in the package.
  function bindAttributes(scope) {
    $$('[data-sf-hover]', scope).forEach(el => el.addEventListener('pointerenter', e => {
      if (e.pointerType === 'mouse') trigger(el.dataset.sfHover || 'hover');
    }));
    $$('[data-sf-press]', scope).forEach(el => el.addEventListener('pointerdown', () => trigger(el.dataset.sfPress || 'press')));
    $$('[data-sf-release]', scope).forEach(el => el.addEventListener('pointerup', () => trigger(el.dataset.sfRelease || 'release')));
    $$('[data-sf-toggle]', scope).forEach(el => {
      let on = false;
      el.addEventListener('click', () => {
        on = el.type === 'checkbox' ? el.checked : !on;
        trigger(on ? 'toggle-on' : 'toggle-off');
      });
    });
    $$('[data-sf-focus]', scope).forEach(el => el.addEventListener('focus', () => trigger('focus')));
    $$('[data-sf-blur]', scope).forEach(el => el.addEventListener('blur', () => trigger('blur')));
    $$('[data-sf]', scope).forEach(el => el.addEventListener('click', () => trigger(el.dataset.sf)));
  }
  bindAttributes($('#usage'));

  const like = $('#like-demo');
  like.addEventListener('click', () => {
    const liked = like.getAttribute('aria-pressed') !== 'true';
    like.setAttribute('aria-pressed', String(liked));
    like.querySelector('.like-count').textContent = liked ? '13' : '12';
    trigger(liked ? 'like' : 'unlike');
  });

  const cart = $('#cart-demo');
  cart.addEventListener('click', e => {
    // Keyboard activation has no pointer events, so play the pair here.
    if (e.detail === 0) {
      trigger('press');
      setTimeout(() => trigger('release'), 90);
    }
    cart.classList.add('is-added');
    clearTimeout(cart.addedTimer);
    cart.addedTimer = setTimeout(() => cart.classList.remove('is-added'), 1400);
  });

  // ── Tabs ─────────────────────────────────────────────────
  $$('[role="tablist"]').forEach(list => {
    const tabs = $$('[role="tab"]', list);
    function select(tab) {
      for (const t of tabs) {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      }
    }
    list.addEventListener('click', e => {
      const tab = e.target.closest('[role="tab"]');
      if (!tab || tab.getAttribute('aria-selected') === 'true') return;
      select(tab);
      uiSound('click-soft');
    });
    list.addEventListener('keydown', e => {
      const i = tabs.indexOf(e.target.closest('[role="tab"]'));
      const to = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (i < 0 || to === undefined) return;
      e.preventDefault();
      const tab = tabs[(to + tabs.length) % tabs.length];
      select(tab);
      tab.focus();
      uiSound('click-soft');
    });
  });

  // ── Counts ───────────────────────────────────────────────
  $$('[data-total]').forEach(el => { el.textContent = SD.length; });
  $$('[data-cats]').forEach(el => { el.textContent = CATS.length; });

  render();
})();
