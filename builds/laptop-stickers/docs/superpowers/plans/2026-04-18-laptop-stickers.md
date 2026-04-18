# Laptop Stickers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page interactive toy where users drag their own PNG/SVG stickers onto a realistic CSS MacBook lid, with localStorage persistence and Web Audio API sound effects.

**Architecture:** `App.jsx` composes four components (`StickerPanel`, `MacBook`, `PlacedSticker`, `Actions`) wired through two hooks (`useLayout` for state + persistence, `useSound` for audio). Panel-to-lid drag uses the HTML5 native drag API (copy semantics — panel item stays); on-lid repositioning uses `react-draggable`. All sticker files are auto-discovered at build time via Vite's `import.meta.glob`.

**Tech Stack:** Vite + React 18 · `react-draggable` · `html2canvas` · Web Audio API · localStorage · Plain CSS · Vitest + @testing-library/react

---

## File Map

| File | Responsibility |
|------|---------------|
| `src/hooks/useLayout.js` | State management: add / remove / move / clearAll · localStorage read/write |
| `src/hooks/useSound.js` | Web Audio API: synth pop on add, synth descend on remove |
| `src/components/StickerPanel.jsx` | Left panel: auto-discovers stickers via glob, renders draggable thumbnails |
| `src/components/PlacedSticker.jsx` | Single sticker on the lid: react-draggable + click-to-remove |
| `src/components/MacBook.jsx` | CSS lid + HTML5 drop zone; renders all PlacedStickers |
| `src/components/Actions.jsx` | Clear All + Screenshot (html2canvas) buttons |
| `src/App.jsx` | Root: composes all components, wires hooks |
| `src/App.css` | All component styles |
| `src/index.css` | Global reset + body background |
| `src/stickers/placeholder.svg` | One sample sticker so the panel is non-empty on first launch |
| `src/hooks/useLayout.test.js` | Vitest unit tests for useLayout |

---

### Task 1: Scaffold the project

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx` (via Vite scaffold)

- [ ] **Step 1: Run Vite scaffold inside the project directory**

```bash
cd /Users/sara/builds/laptop-stickers
npm create vite@latest . -- --template react
```

When prompted "Target directory is not empty. Remove existing files and continue?", choose **No, keep existing files** (the `docs/` folder must be preserved).

Expected: Vite project files created — `src/`, `index.html`, `package.json`, `vite.config.js`

- [ ] **Step 2: Install runtime dependencies**

```bash
npm install react-draggable html2canvas
```

Expected: both packages appear in `dependencies` in `package.json`.

- [ ] **Step 3: Install test dependencies**

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 4: Verify dev server starts**

```bash
npm run dev
```

Expected: server starts at `http://localhost:5173`, browser shows default Vite+React page. Ctrl+C to stop.

- [ ] **Step 5: Commit scaffold**

```bash
git add package.json package-lock.json vite.config.js index.html src/ public/ .gitignore eslint.config.js
git commit -m "feat: scaffold vite+react project for laptop-stickers"
```

---

### Task 2: Configure Vitest + add placeholder sticker

**Files:**
- Modify: `vite.config.js`
- Create: `src/test-setup.js`
- Create: `src/stickers/placeholder.svg`

- [ ] **Step 1: Replace the full contents of `vite.config.js`**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test-setup.js',
  },
})
```

- [ ] **Step 2: Create `src/test-setup.js`**

```js
import '@testing-library/jest-dom'
```

- [ ] **Step 3: Add `"test"` script to `package.json`**

In `package.json`, add `"test": "vitest"` inside the `"scripts"` object:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview",
  "test": "vitest"
}
```

- [ ] **Step 4: Create `src/stickers/placeholder.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <circle cx="32" cy="32" r="28" fill="#f7df1e" stroke="#c8a800" stroke-width="2"/>
  <text x="32" y="42" text-anchor="middle" font-size="28" font-family="system-ui">⭐</text>
</svg>
```

- [ ] **Step 5: Confirm Vitest resolves (no tests yet)**

```bash
npx vitest run
```

Expected: outputs "No test files found" or "0 tests". This is not an error — just confirms the runner initialises without crashing.

- [ ] **Step 6: Commit**

```bash
git add vite.config.js src/test-setup.js src/stickers/
git commit -m "feat: configure vitest and add placeholder sticker"
```

---

### Task 3: Implement useLayout hook (TDD)

**Files:**
- Create: `src/hooks/useLayout.js`
- Create: `src/hooks/useLayout.test.js`

- [ ] **Step 1: Write the failing tests**

Create `src/hooks/useLayout.test.js`:

```js
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useLayout } from './useLayout'

const localStorageMock = (() => {
  let store = {}
  return {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => { store[key] = String(value) },
    clear: () => { store = {} },
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('useLayout', () => {
  beforeEach(() => localStorageMock.clear())

  it('starts with empty stickers when localStorage is empty', () => {
    const { result } = renderHook(() => useLayout())
    expect(result.current.stickers).toEqual([])
  })

  it('adds a sticker with src, x, y, id, and rotation within ±12°', () => {
    const { result } = renderHook(() => useLayout())
    act(() => result.current.addSticker('/test.png', 100, 50))

    expect(result.current.stickers).toHaveLength(1)
    const s = result.current.stickers[0]
    expect(s.src).toBe('/test.png')
    expect(s.x).toBe(100)
    expect(s.y).toBe(50)
    expect(typeof s.id).toBe('string')
    expect(s.rotation).toBeGreaterThanOrEqual(-12)
    expect(s.rotation).toBeLessThanOrEqual(12)
  })

  it('removes a sticker by id', () => {
    const { result } = renderHook(() => useLayout())
    act(() => result.current.addSticker('/test.png', 0, 0))
    const id = result.current.stickers[0].id
    act(() => result.current.removeSticker(id))
    expect(result.current.stickers).toHaveLength(0)
  })

  it('moves a sticker to new coordinates', () => {
    const { result } = renderHook(() => useLayout())
    act(() => result.current.addSticker('/test.png', 0, 0))
    const id = result.current.stickers[0].id
    act(() => result.current.moveSticker(id, 80, 120))
    expect(result.current.stickers[0].x).toBe(80)
    expect(result.current.stickers[0].y).toBe(120)
  })

  it('clearAll removes all stickers', () => {
    const { result } = renderHook(() => useLayout())
    act(() => result.current.addSticker('/a.png', 0, 0))
    act(() => result.current.addSticker('/b.png', 10, 10))
    act(() => result.current.clearAll())
    expect(result.current.stickers).toHaveLength(0)
  })

  it('persists to localStorage on add', () => {
    const { result } = renderHook(() => useLayout())
    act(() => result.current.addSticker('/test.png', 10, 20))
    const stored = JSON.parse(localStorageMock.getItem('laptop-stickers-layout'))
    expect(stored).toHaveLength(1)
    expect(stored[0].src).toBe('/test.png')
    expect(stored[0].x).toBe(10)
    expect(stored[0].y).toBe(20)
  })

  it('restores layout from localStorage on mount', () => {
    const saved = [{ id: 'abc', src: '/old.png', x: 5, y: 10, rotation: 3 }]
    localStorageMock.setItem('laptop-stickers-layout', JSON.stringify(saved))
    const { result } = renderHook(() => useLayout())
    expect(result.current.stickers).toHaveLength(1)
    expect(result.current.stickers[0].id).toBe('abc')
  })
})
```

- [ ] **Step 2: Run tests — expect all to fail**

```bash
npx vitest run src/hooks/useLayout.test.js
```

Expected: 7 failures — "Cannot find module './useLayout'"

- [ ] **Step 3: Implement `src/hooks/useLayout.js`**

```js
import { useState } from 'react'

const STORAGE_KEY = 'laptop-stickers-layout'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function useLayout() {
  const [stickers, setStickers] = useState(load)

  const addSticker = (src, x, y) => {
    setStickers((prev) => {
      const next = [
        ...prev,
        {
          id: crypto.randomUUID(),
          src,
          x,
          y,
          rotation: Math.round(Math.random() * 24 - 12),
        },
      ]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const removeSticker = (id) => {
    setStickers((prev) => {
      const next = prev.filter((s) => s.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const moveSticker = (id, x, y) => {
    setStickers((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, x, y } : s))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const clearAll = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
    setStickers([])
  }

  return { stickers, addSticker, removeSticker, moveSticker, clearAll }
}
```

- [ ] **Step 4: Run tests — expect all to pass**

```bash
npx vitest run src/hooks/useLayout.test.js
```

Expected: 7 tests pass, 0 failures.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/
git commit -m "feat: implement useLayout hook with localStorage persistence"
```

---

### Task 4: Implement useSound hook

**Files:**
- Create: `src/hooks/useSound.js`

The Web Audio API requires an active browser context and is impractical to unit test. Manual verification in Task 11 covers this.

- [ ] **Step 1: Create `src/hooks/useSound.js`**

```js
export function useSound() {
  const play = (type) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.connect(gain)
      gain.connect(ctx.destination)
      gain.gain.setValueAtTime(0.3, ctx.currentTime)

      if (type === 'add') {
        osc.type = 'sine'
        osc.frequency.setValueAtTime(800, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.12)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)
        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + 0.12)
      } else {
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(400, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + 0.08)
      }
    } catch {
      // AudioContext unavailable (e.g. test environment) — fail silently
    }
  }

  return {
    playAdd: () => play('add'),
    playRemove: () => play('remove'),
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useSound.js
git commit -m "feat: add useSound hook with Web Audio API synth sounds"
```

---

### Task 5: Implement StickerPanel component

**Files:**
- Create: `src/components/StickerPanel.jsx`

- [ ] **Step 1: Create `src/components/StickerPanel.jsx`**

```jsx
// STICKER_SRCS is at module scope — import.meta.glob is evaluated at build time,
// no need to re-run it on every render.
const stickerModules = import.meta.glob('../stickers/*', {
  eager: true,
  query: '?url',
  import: 'default',
})

const STICKER_SRCS = Object.values(stickerModules)

export function StickerPanel() {
  const handleDragStart = (e, src) => {
    e.dataTransfer.setData('sticker-src', src)
    e.dataTransfer.effectAllowed = 'copy'
  }

  return (
    <div className="sticker-panel">
      <div className="panel-label">Your Stickers</div>
      <div className="sticker-grid">
        {STICKER_SRCS.map((src) => (
          <div
            key={src}
            className="sticker-thumb"
            draggable
            onDragStart={(e) => handleDragStart(e, src)}
          >
            <img src={src} alt="" draggable={false} />
          </div>
        ))}
      </div>
      <div className="panel-hint">
        drag stickers<br />onto your laptop
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/StickerPanel.jsx
git commit -m "feat: add StickerPanel with auto-discovered sticker files"
```

---

### Task 6: Implement PlacedSticker component

**Files:**
- Create: `src/components/PlacedSticker.jsx`

Key design: `react-draggable` fires `onClick` after every mouse-up — including after a drag. We use a `didMoveRef` to distinguish a genuine click (remove) from a drag-end (move).

- [ ] **Step 1: Create `src/components/PlacedSticker.jsx`**

```jsx
import Draggable from 'react-draggable'
import { useRef } from 'react'

export function PlacedSticker({ id, src, x, y, rotation, onRemove, onMove }) {
  const nodeRef = useRef(null)
  const didMoveRef = useRef(false)

  const handleStart = () => {
    didMoveRef.current = false
  }

  const handleDrag = () => {
    didMoveRef.current = true
  }

  const handleStop = (_e, data) => {
    if (didMoveRef.current) {
      onMove(id, data.x, data.y)
    }
  }

  const handleClick = () => {
    if (!didMoveRef.current) {
      onRemove(id)
    }
  }

  return (
    <Draggable
      nodeRef={nodeRef}
      defaultPosition={{ x, y }}
      bounds="parent"
      onStart={handleStart}
      onDrag={handleDrag}
      onStop={handleStop}
    >
      <div
        ref={nodeRef}
        className="placed-sticker"
        onClick={handleClick}
      >
        <img
          src={src}
          alt=""
          draggable={false}
          style={{ transform: `rotate(${rotation}deg)` }}
        />
      </div>
    </Draggable>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PlacedSticker.jsx
git commit -m "feat: add PlacedSticker with drag-to-move and click-to-remove"
```

---

### Task 7: Implement MacBook component

**Files:**
- Create: `src/components/MacBook.jsx`

- [ ] **Step 1: Create `src/components/MacBook.jsx`**

```jsx
import { useRef } from 'react'
import { PlacedSticker } from './PlacedSticker'

export function MacBook({ stickers, onAdd, onRemove, onMove, containerRef }) {
  const lidRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const src = e.dataTransfer.getData('sticker-src')
    if (!src || !lidRef.current) return

    const rect = lidRef.current.getBoundingClientRect()
    // Center the 64×64 sticker on the cursor
    const rawX = e.clientX - rect.left - 32
    const rawY = e.clientY - rect.top - 32
    // Clamp so the sticker lands fully within lid bounds
    const x = Math.max(0, Math.min(rawX, rect.width - 64))
    const y = Math.max(0, Math.min(rawY, rect.height - 64))

    onAdd(src, x, y)
  }

  return (
    <div className="macbook-scene">
      <div className="macbook-lid-container" ref={containerRef}>
        <div
          ref={lidRef}
          className="macbook-lid"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="lid-texture" />
          <div className="apple-logo" aria-hidden="true" />
          {stickers.map((s) => (
            <PlacedSticker
              key={s.id}
              {...s}
              onRemove={onRemove}
              onMove={onMove}
            />
          ))}
        </div>
        <div className="macbook-hinge" />
        <div className="macbook-glow" />
      </div>
      <p className="drop-hint">drop stickers anywhere on the lid</p>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/MacBook.jsx
git commit -m "feat: add MacBook lid component with HTML5 drop zone"
```

---

### Task 8: Implement Actions component

**Files:**
- Create: `src/components/Actions.jsx`

- [ ] **Step 1: Create `src/components/Actions.jsx`**

```jsx
import html2canvas from 'html2canvas'

export function Actions({ onClear, containerRef }) {
  const handleScreenshot = async () => {
    if (!containerRef.current) return
    const canvas = await html2canvas(containerRef.current, {
      backgroundColor: '#0a0a0a',
      scale: window.devicePixelRatio,
      useCORS: true,
    })
    const link = document.createElement('a')
    link.download = 'my-stickers.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="actions">
      <button className="action-btn" onClick={onClear}>Clear All</button>
      <button className="action-btn" onClick={handleScreenshot}>Screenshot</button>
      <div className="auto-save-hint">auto-saved<br />to browser</div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Actions.jsx
git commit -m "feat: add Actions component with Clear All and Screenshot"
```

---

### Task 9: Compose App.jsx

**Files:**
- Modify: `src/App.jsx`
- Verify: `src/main.jsx`

- [ ] **Step 1: Replace the full contents of `src/App.jsx`**

```jsx
import { useRef } from 'react'
import { useLayout } from './hooks/useLayout'
import { useSound } from './hooks/useSound'
import { StickerPanel } from './components/StickerPanel'
import { MacBook } from './components/MacBook'
import { Actions } from './components/Actions'
import './App.css'

export default function App() {
  const { stickers, addSticker, removeSticker, moveSticker, clearAll } = useLayout()
  const { playAdd, playRemove } = useSound()
  const macbookRef = useRef(null)

  const handleAdd = (src, x, y) => {
    addSticker(src, x, y)
    playAdd()
  }

  const handleRemove = (id) => {
    removeSticker(id)
    playRemove()
  }

  return (
    <div className="app">
      <StickerPanel />
      <MacBook
        stickers={stickers}
        onAdd={handleAdd}
        onRemove={handleRemove}
        onMove={moveSticker}
        containerRef={macbookRef}
      />
      <Actions onClear={clearAll} containerRef={macbookRef} />
    </div>
  )
}
```

- [ ] **Step 2: Verify `src/main.jsx` mounts App correctly**

`src/main.jsx` should match this exactly (Vite's default scaffold produces it):

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

If it matches, no changes needed. If the imports differ, update to match the above.

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx src/main.jsx
git commit -m "feat: compose full app — wire hooks and components"
```

---

### Task 10: Add CSS styling

**Files:**
- Modify: `src/index.css`
- Modify: `src/App.css`

- [ ] **Step 1: Replace `src/index.css` with global reset**

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: #0a0a0a;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  color: #fff;
  overflow: hidden;
}
```

- [ ] **Step 2: Replace `src/App.css` with all component styles**

```css
/* ─── Layout ─────────────────────────────────── */
.app {
  display: flex;
  gap: 24px;
  align-items: center;
  padding: 32px;
}

/* ─── Sticker Panel ──────────────────────────── */
.sticker-panel {
  width: 130px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 340px;
  overflow-y: auto;
  scrollbar-width: none;
}

.sticker-panel::-webkit-scrollbar {
  display: none;
}

.panel-label {
  color: rgba(255, 255, 255, 0.3);
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-family: monospace;
}

.sticker-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.sticker-thumb {
  background: rgba(255, 255, 255, 0.06);
  border: 1px dashed rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  overflow: hidden;
  transition: background 0.15s, border-color 0.15s;
}

.sticker-thumb:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

.sticker-thumb:active {
  cursor: grabbing;
}

.sticker-thumb img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
  user-select: none;
}

.panel-hint {
  color: rgba(255, 255, 255, 0.2);
  font-size: 8px;
  text-align: center;
  line-height: 1.5;
  margin-top: auto;
}

/* ─── MacBook Scene ──────────────────────────── */
.macbook-scene {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.macbook-lid-container {
  position: relative;
  width: 380px;
}

/* The aluminium lid — the main visual centrepiece */
.macbook-lid {
  background: linear-gradient(145deg, #c8c8c8 0%, #a0a0a0 40%, #b8b8b8 100%);
  border-radius: 16px 16px 4px 4px;
  height: 240px;
  border: 1.5px solid rgba(255, 255, 255, 0.3);
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.4),
    0 40px 80px rgba(0, 0, 0, 0.9),
    0 20px 40px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -1px 0 rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  cursor: crosshair;
}

/* Brushed-metal highlight */
.lid-texture {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at 30% 20%,
    rgba(255, 255, 255, 0.18) 0%,
    transparent 60%
  );
  pointer-events: none;
  z-index: 0;
}

/* Apple logo — subtle, centred, decorative */
.apple-logo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 32px;
  height: 38px;
  background: rgba(90, 90, 90, 0.35);
  border-radius: 6px 6px 3px 3px;
  z-index: 0;
}

.macbook-hinge {
  height: 6px;
  background: linear-gradient(180deg, #909090, #787878);
  border-radius: 0 0 3px 3px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
}

/* Soft glow pooling beneath the laptop */
.macbook-glow {
  position: absolute;
  bottom: -20px;
  left: 10%;
  right: 10%;
  height: 18px;
  background: rgba(255, 255, 255, 0.06);
  filter: blur(20px);
  border-radius: 50%;
  pointer-events: none;
}

.drop-hint {
  color: rgba(255, 255, 255, 0.12);
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-top: 32px;
  font-family: monospace;
}

/* ─── Placed Stickers ────────────────────────── */
/* position: absolute + left/top: 0 lets react-draggable's
   transform: translate(x, y) control position cleanly */
.placed-sticker {
  position: absolute;
  left: 0;
  top: 0;
  width: 64px;
  height: 64px;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
  z-index: 1;
}

.placed-sticker:active {
  cursor: grabbing;
}

.placed-sticker img {
  width: 64px;
  height: 64px;
  object-fit: contain;
  pointer-events: none;
  user-select: none;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.4));
}

/* ─── Actions Panel ──────────────────────────── */
.actions {
  width: 90px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.action-btn {
  width: 100%;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  padding: 10px 6px;
  font-size: 9px;
  font-family: monospace;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  border-color: rgba(255, 255, 255, 0.2);
}

.auto-save-hint {
  color: rgba(255, 255, 255, 0.15);
  font-size: 8px;
  text-align: center;
  line-height: 1.5;
  margin-top: 8px;
  font-family: monospace;
}
```

- [ ] **Step 3: Start dev server and do a visual check**

```bash
npm run dev
```

Open `http://localhost:5173`. You should see:

- `#0a0a0a` dark background filling the viewport
- Left panel with "Your Stickers" label, placeholder sticker visible in the grid
- Centre: silver aluminium MacBook lid with gradient, inset shadows, brushed-metal highlight, and soft glow pooling below the hinge
- Right: "Clear All" and "Screenshot" ghost buttons

- [ ] **Step 4: Commit**

```bash
git add src/index.css src/App.css
git commit -m "style: add full CSS — dark scene, aluminium MacBook lid, panel and actions"
```

---

### Task 11: End-to-end verification

No new files. Manual checklist.

- [ ] **Drag and drop** — Drag the placeholder sticker from the left panel onto the MacBook lid. Expected: sticker appears on the lid at approximately the drop position, with a random slight rotation. A short bright pop sound plays.

- [ ] **Panel item stays** — After dropping, the panel sticker should still be visible. It was copied, not moved.

- [ ] **Multiple drops** — Drop the same sticker two or three times. Each instance appears independently with its own position and rotation.

- [ ] **Sticker repositioning** — Drag a placed sticker to a new position within the lid. It should move freely. No sound plays on reposition.

- [ ] **Boundary clamping** — Drag a placed sticker to the edge of the lid. It should stop at the lid boundary and not escape.

- [ ] **Click to remove** — Click (without moving) a placed sticker. It disappears. A short descending tone plays.

- [ ] **Drop outside lid** — Drag a sticker from the panel and release it anywhere outside the MacBook lid. Nothing happens — no sticker is added.

- [ ] **localStorage persistence** — Add several stickers. Refresh the page (`Cmd+R`). All stickers reappear in the same positions and rotations.

- [ ] **Clear All** — Click "Clear All". All stickers disappear. Refresh — they remain gone (localStorage cleared).

- [ ] **Screenshot** — Add stickers. Click "Screenshot". A PNG downloads. Open it: the MacBook lid with stickers should be visible on a dark background, not white.

- [ ] **Stacking order** — Drop overlapping stickers. Later drops render on top of earlier ones.

- [ ] **Final commit**

```bash
npx vitest run
git add -A
git commit -m "feat: laptop-stickers complete — drag, drop, sound, localStorage, screenshot"
```
