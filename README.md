# SonicFlow

> **Interaction sounds for the web. Synthesized live. Zero bytes shipped.**

[![npm version](https://img.shields.io/npm/v/sonicflow?style=flat-square&color=22c55e)](https://www.npmjs.com/package/sonicflow)
[![bundle size](https://img.shields.io/bundlephobia/minzip/sonicflow?style=flat-square&color=22c55e&label=gzip)](https://bundlephobia.com/package/sonicflow)
[![license](https://img.shields.io/npm/l/sonicflow?style=flat-square&color=22c55e)](LICENSE)

SonicFlow is a premium library of **84 UI interaction sounds** for the modern web. Every cue is synthesized in real-time using the Web Audio API — no samples, no network requests, no loading states. Just import, bind, and listen.

🔗 **Live Demo:** [uxasim.com/sonicflow](http://uxasim.com/sonicflow)

---

## ✨ Why SonicFlow?

| | |
|:---|:---|
| **⚡ Zero Bytes** | Nothing to download. Everything is synthesized live in the browser. |
| **📦 2.1kb Gzipped** | Smaller than a single image. Eighty-four unique sounds in one tiny package. |
| **🎯 Instant Response** | Sub-5ms latency. No decoding, no buffering, no waiting. |
| **🎹 Rich Synthesis** | Multi-oscillator voices with filters, ADSR envelopes, and spatial audio. |
| **🎨 Fully Customizable** | Global and per-sound volume, pitch shift, and reverb control. |
| **♿ Accessible** | Respects `prefers-reduced-motion`. Enhances, never replaces, visual feedback. |
| **⚛️ Framework Agnostic** | React, Vue, Svelte, Solid, or vanilla HTML. One import, zero dependencies. |

---

## 🚀 Quick Start

### Install

```bash
npm install sonicflow
# or
yarn add sonicflow
# or
pnpm add sonicflow
```

### Use

```html
<!-- One attribute per behavior -->
<button data-sf-press data-sf-release>Save</button>
<a data-sf-hover="tick">Docs</a>
<button data-sf-toggle>Dark mode</button>
<input data-sf-focus data-sf-blur />
```

```js
import { bind, play, setVolume } from 'sonicflow';

bind();                          // Auto-wires every data-sf-* attribute
setVolume(0.7);                  // Global loudness, 0 to 1

play('success');                 // Play any sound programmatically
play('error', { volume: 0.4 });  // Quieter for this play only
```

---

## 🎵 The Collection

### 84 Sounds Across 8 Categories

| Category | Count | Description |
|----------|-------|-------------|
| **Feedback** | 12 | Success, error, warning, confirm, deny, complete, cancel, undo |
| **Interaction** | 18 | Hover, click, pop, toggle, press, release, scroll, swipe, whoosh, pluck |
| **Notification** | 12 | Bell, chime, ping, message, mention, alert, call, hangup, reminder |
| **System** | 14 | Unlock, lock, open, close, save, delete, refresh, load, send, receive |
| **Form** | 10 | Typing, backspace, enter, tab, copy, paste, focus, blur, validate |
| **Media** | 10 | Play, pause, stop, skip, volume up/down, mute, unmute, record |
| **Gesture** | 6 | Pinch, zoom, pull, drop, drag, drop-zone |

---

## 🎛️ API Reference

### `bind(options?)`

Automatically wires all elements with `data-sf-*` attributes.

```js
import { bind } from 'sonicflow';

bind({
  volume: 0.7,        // Default global volume
  hover: true,        // Enable hover sounds
  reducedMotion: true // Respect prefers-reduced-motion
});
```

### `play(name, options?)`

Play any sound programmatically.

```js
import { play } from 'sonicflow';

play('success');
play('error', { volume: 0.3, pitch: -2 });
```

### `setVolume(value)`

Set the global master volume (0 to 1).

```js
import { setVolume } from 'sonicflow';

setVolume(0.5);
```

### `setPitch(semitones)`

Shift all sounds up or down in pitch.

```js
import { setPitch } from 'sonicflow';

setPitch(2);   // Shift up 2 semitones
setPitch(-5);  // Shift down 5 semitones
```

### `setReverb(amount)`

Set global reverb wet/dry mix (0 to 1).

```js
import { setReverb } from 'sonicflow';

setReverb(0.3);  // 30% reverb
```

---

## 🏷️ Data Attributes

| Attribute | Trigger | Sound |
|-----------|---------|-------|
| `data-sf-hover` | Mouse enter / touch | Hover tick |
| `data-sf-press` | Mouse down / touch start | Click |
| `data-sf-release` | Mouse up / touch end | Pop |
| `data-sf-toggle` | Click | Toggle on/off |
| `data-sf-success` | Programmatic or bound event | Success chime |
| `data-sf-error` | Programmatic or bound event | Error buzz |
| `data-sf-notification` | Programmatic or bound event | Notification ping |
| `data-sf-focus` | Focus in | Focus tone |
| `data-sf-blur` | Focus out | Blur tone |

---

## 🧪 Framework Examples

### React

```jsx
import { useEffect } from 'react';
import { bind, play } from 'sonicflow';

function App() {
  useEffect(() => { bind(); }, []);

  return (
    <button data-sf-press data-sf-release onClick={() => play('success')}>
      Save
    </button>
  );
}
```

### Vue

```vue
<script setup>
import { onMounted } from 'vue';
import { bind } from 'sonicflow';

onMounted(() => bind());
</script>

<template>
  <button data-sf-press data-sf-release>Save</button>
</template>
```

### Svelte

```svelte
<script>
  import { onMount } from 'svelte';
  import { bind } from 'sonicflow';

  onMount(() => bind());
</script>

<button data-sf-press data-sf-release>Save</button>
```

---

## 🌐 Browser Support

SonicFlow uses the Web Audio API and works in all modern browsers:

| Chrome | Firefox | Safari | Edge |
|--------|---------|--------|------|
| ✅ 66+ | ✅ 60+ | ✅ 14.1+ | ✅ 79+ |

---

## 📦 Bundle Size

```
sonicflow.js ........... 4.8kb
sonicflow.js.gz ........ 2.1kb  ⭐
sonicflow.js.br ........ 1.8kb
```

---

## 🎨 Custom Sounds

Want to create your own? SonicFlow exposes the synthesis engine:

```js
import { synthesize } from 'sonicflow';

synthesize({
  type: 'sine',
  frequency: 440,
  envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.2 },
  filter: { type: 'lowpass', frequency: 2000 }
});
```

---

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) before submitting a pull request.

```bash
git clone https://github.com/uxasim-rgb/sonicflow.git
cd sonicflow
npm install
npm run dev
```

---

## 🙏 Credits

Created by [Asim](http://uxasim.com/) — Designer & Developer crafting interfaces that sound as good as they feel.

---

## 📄 License

MIT © [Asim](http://uxasim.com/)

---

<p align="center">
  <sub>Synthesized with love. No samples, no latency, no limits.</sub>
</p>
