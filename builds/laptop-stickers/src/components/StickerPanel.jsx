import { useRef, useEffect } from 'react'

const stickerModules = import.meta.glob('../stickers/*', {
  eager: true,
  query: '?url',
  import: 'default',
})

const STICKER_SRCS = Object.values(stickerModules)

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

function animateScroll(el, from, to, duration, onDone) {
  const start = performance.now()
  let raf
  const step = (now) => {
    const t = Math.min((now - start) / duration, 1)
    el.scrollLeft = from + (to - from) * easeInOut(t)
    if (t < 1) { raf = requestAnimationFrame(step) }
    else { onDone?.() }
  }
  raf = requestAnimationFrame(step)
  return () => cancelAnimationFrame(raf)
}

export function StickerPanel() {
  const pillRef = useRef(null)

  useEffect(() => {
    const el = pillRef.current
    if (!el) return
    // no teaser scroll
  }, [])

  const handleDragStart = (e, src) => {
    e.dataTransfer.setData('sticker-src', src)
    e.dataTransfer.effectAllowed = 'copy'
  }

  return (
    <div className="sticker-panel">
      <div className="pill-inner" ref={pillRef}>
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
    </div>
  )
}
