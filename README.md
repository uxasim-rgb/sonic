# SonicFlow

> **Sound design, shipped as code.**

[![Live Demo](https://img.shields.io/badge/demo-sonic--flow--eta.vercel.app-22c55e?style=flat-square&logo=vercel)](https://sonic-flow-eta.vercel.app/)
[![License](https://img.shields.io/badge/license-MIT-22c55e?style=flat-square)](./LICENSE)

84 interaction sounds — clicks, chimes, sweeps, blooms — synthesized live with the Web Audio API. No audio files, no network requests, no loading states. Under 3 kB gzipped.

**[Browse all 84 sounds →](https://sonic-flow-eta.vercel.app/#catalog)**

---

## Install

```bash
npm install sonic-flow
```

```bash
yarn add sonic-flow
```

```bash
pnpm add sonic-flow
```

**No bundler?** Drop in a script tag:

```html
<script src="https://unpkg.com/sonic-flow@latest"></script>
<script>SonicFlow.bind();</script>
```

---

## Usage

Tag any element with a `data-sf-*` attribute and call `bind()` once:

```html
<button data-sf-press data-sf-release>Save</button>
<a data-sf-hover="tick">Docs</a>
<input data-sf-toggle type="checkbox" />
```

```ts
import { bind, play, setVolume } from "sonic-flow";

bind();           // wires every data-sf-* element
setVolume(0.7);   // master volume, 0 to 1

play("success");                  // uses master volume
play("success", { volume: 0.4 }); // override per call
```

---

## The collection

84 sounds across 8 categories. Every cue has its own character — none are pitch-shifted clones.

| Category | Sounds | Examples |
|---|---|---|
| **Feedback** | 14 | success, error, warning, confirm, deny, complete, bloom, sparkle |
| **Interaction** | 18 | hover, click, pop, toggle, press, release, scroll, swipe, pluck |
| **Notification** | 12 | bell, chime, ping, message, mention, alert, call, reminder |
| **System** | 14 | unlock, lock, open, close, save, delete, refresh, send, download |
| **Form** | 10 | typing, backspace, enter, tab, copy, paste, focus, blur, validate |
| **Media** | 10 | play, pause, stop, skip, vol-up, vol-down, mute, unmute, record |
| **Gesture** | 6 | pinch, zoom, pull, drop, drag, drop-zone |

---

## Data attributes

| Attribute | Trigger | Default sound |
|---|---|---|
| `data-sf-hover` | Pointer enter / touch | hover |
| `data-sf-press` | Mouse down / touch start | click |
| `data-sf-release` | Mouse up / touch end | pop |
| `data-sf-toggle` | Click | toggle-on / toggle-off |
| `data-sf-focus` | Focus in | focus |
| `data-sf-blur` | Focus out | blur |

Pass a sound name as the value to override: `data-sf-hover="hover-soft"`.

---

## API

### `bind(options?)`

Wires all `data-sf-*` elements. Call once at startup.

```ts
bind({ volume: 0.7, hover: true });
```

### `play(name, options?)`

Play any sound by name.

```ts
play("success");
play("error", { volume: 0.3 });
```

### `setVolume(value)`

Set master volume (0–1).

### `setPitch(semitones)`

Shift all sounds up or down.

### `setReverb(amount)`

Set reverb wet/dry mix (0–1).

---

## Framework examples

**React**

```tsx
import { useEffect } from "react";
import { bind, play } from "sonic-flow";

function App() {
  useEffect(() => { bind(); }, []);
  return (
    <button data-sf-press onClick={() => play("success")}>
      Save
    </button>
  );
}
```

**Vue**

```vue
<script setup>
import { onMounted } from "vue";
import { bind } from "sonic-flow";
onMounted(() => bind());
</script>

<template>
  <button data-sf-press data-sf-release>Save</button>
</template>
```

**Svelte**

```svelte
<script>
  import { onMount } from "svelte";
  import { bind } from "sonic-flow";
  onMount(() => bind());
</script>

<button data-sf-press data-sf-release>Save</button>
```

---

## Browser support

| Chrome | Firefox | Safari | Edge |
|---|---|---|---|
| 66+ | 60+ | 14.1+ | 79+ |

Respects `prefers-reduced-motion` — sounds are suppressed when the user has asked for reduced motion.

---

## Bundle size

```
sonic-flow.js ........... 4.8 kB
sonic-flow.js.gz ........ 2.1 kB
sonic-flow.js.br ........ 1.8 kB
```

All 84 sounds, zero audio files. Smaller than a single favicon.

---

## Contributing

```bash
git clone https://github.com/uxasim-rgb/sonic-flow.git
cd sonic-flow
npm install
npm run dev
```

---

## License

MIT — [Asim](https://uxasim.com/)
