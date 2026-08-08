# SonicFlow

700 UI sounds from pure code. No audio files. Under 3 kB.

[![Live Demo](https://img.shields.io/badge/demo-sonic--flow--eta.vercel.app-22c55e?style=flat-square&logo=vercel)](https://sonic-flow-eta.vercel.app/)
[![npm](https://img.shields.io/npm/v/sonic-flow?style=flat-square&color=22c55e)](https://www.npmjs.com/package/sonic-flow)
[![License](https://img.shields.io/badge/license-MIT-22c55e?style=flat-square)](./LICENSE)

Every sound is built from oscillators at runtime using the Web Audio API. No MP3s, no WAVs, no network requests, no loading. Just `play("success")` and it plays.

**[Try them all →](https://sonic-flow-eta.vercel.app/#sounds)**

---

## Install

```bash
npm install sonic-flow
```

Or yarn / pnpm:

```bash
yarn add sonic-flow
```

```bash
pnpm add sonic-flow
```

No bundler? Drop a script tag:

```html
<script src="https://unpkg.com/sonic-flow@latest"></script>
<script>SonicFlow.bind();</script>
```

---

## Quick start

Two ways to use it.

**Option A: data attributes** — add `data-sf-*` to your HTML elements, call `bind()` once.

```html
<button data-sf-press data-sf-release>Save</button>
<a data-sf-hover="tick">Docs</a>
<input data-sf-toggle type="checkbox" />
```

```js
import { bind } from "sonic-flow";
bind();
```

Done. The button clicks, the link ticks on hover, the checkbox toggles.

**Option B: call `play()` directly** — for when you want control over exactly when a sound fires.

```js
import { play } from "sonic-flow";

play("success");                  // plays at master volume
play("error", { volume: 0.3 });   // quieter
```

---

## What's in the box

700 sounds across 14 categories. Each one is its own thing — no pitch-shifted copies.

| Category | Count | Some examples |
|---|---|---|
| **Feedback** | 50 | success, error, warning, confirm, deny, complete, bloom, sparkle |
| **Interaction** | 50 | hover, click, pop, toggle-on, toggle-off, press, release, scroll, swipe |
| **Notification** | 50 | bell, chime, ping, message, mention, alert, call, reminder |
| **System** | 50 | unlock, lock, open, close, save, delete, refresh, send, download |
| **Form** | 50 | typing, backspace, enter, tab, copy, paste, focus, blur, validate |
| **Media** | 50 | play, pause, stop, skip, vol-up, vol-down, mute, unmute, record |
| **Gesture** | 50 | pinch, zoom, pull, drop, drag, drop-zone, spread, rotate, flick |
| **Navigation** | 50 | page-in, page-out, tab-switch, sidebar-open, back, forward, home |
| **Commerce** | 50 | cart-add, cart-remove, checkout, payment, coupon, receipt, wishlist |
| **Social** | 50 | like, unlike, follow, unfollow, share, comment, react, bookmark |
| **AI** | 50 | ai-thinking, ai-streaming, ai-complete, ai-error, ai-typing, ai-response |
| **Gaming** | 50 | score, level-up, coin, powerup, damage, heal, countdown, game-over |
| **Status** | 50 | online, offline, away, connecting, connected, syncing, permission |
| **Ambient** | 50 | ambient-hum, ambient-drone, ambient-pulse, ambient-wind, ambient-rain |

---

## Data attributes

| Attribute | When it fires | Default sound |
|---|---|---|
| `data-sf-hover` | Pointer enters the element | hover |
| `data-sf-press` | Mouse down / touch start | click |
| `data-sf-release` | Mouse up / touch end | pop |
| `data-sf-toggle` | Click (alternates) | toggle-on / toggle-off |
| `data-sf-focus` | Element gets focus | focus |
| `data-sf-blur` | Element loses focus | blur |
| `data-sf` | Click | *(whatever you set)* |

Override the default by passing a sound name: `data-sf-hover="hover-soft"`.

---

## API

### `play(name, options?)`

Play a sound by name.

```js
play("success");
play("notification", { volume: 0.5 });
```

Skips silently if the user has `prefers-reduced-motion` enabled.

### `bind(options?)`

Finds every `data-sf-*` element on the page and wires up the listeners. Call it once when the page loads.

```js
bind();
bind({ volume: 0.6 });  // also sets master volume
```

### `setVolume(value)`

Master volume. Takes a number from 0 to 1.

```js
setVolume(0.5);
```

### `setPitch(semitones)`

Shift every sound up or down by semitones. 0 is normal. Positive goes higher, negative goes lower.

```js
setPitch(2);   // everything two semitones up
setPitch(-3);  // three semitones down
setPitch(0);   // back to normal
```

### `getSounds()`

Returns an array of all 700 sound names.

```js
const all = getSounds();
console.log(all.length); // 700
```

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

**Next.js** (client component)

```tsx
"use client";
import { useEffect } from "react";
import { bind, play } from "sonic-flow";

export default function Page() {
  useEffect(() => { bind(); }, []);
  return <button onClick={() => play("confirm")}>Confirm</button>;
}
```

---

## Accessibility

SonicFlow checks `prefers-reduced-motion` before every `play()` call. If the user has asked for reduced motion, sounds don't play. You don't need to do anything — it's handled automatically.

---

## Size

```
sonic-flow.js ........... 4.8 kB
sonic-flow.js.gz ........ 2.1 kB
sonic-flow.js.br ........ 1.8 kB
```

All 700 sounds. Smaller than most favicons.

---

## Browser support

| Chrome | Firefox | Safari | Edge |
|---|---|---|---|
| 66+ | 60+ | 14.1+ | 79+ |

Uses the standard Web Audio API. Works everywhere that supports `AudioContext`.

---

## Contributing

```bash
git clone https://github.com/uxasim-rgb/sonic-flow.git
cd sonic-flow
npm run dev
```

Open an issue if you want a new sound or find a bug.

---

## License

MIT — [Asim](https://uxasim.com/)
