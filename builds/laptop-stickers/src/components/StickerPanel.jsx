import { useRef, useEffect } from 'react'

const stickerModules = import.meta.glob('../stickers/*', {
  eager: true,
  query: '?url',
  import: 'default',
})

const STICKER_SRCS = Object.values(stickerModules)

export function StickerPanel() {
  const pillRef = useRef(null)

  useEffect(() => {
    const el = pillRef.current
    if (!el) return
    // Teaser sweep: wait, drift right to show range, drift back
    const t1 = setTimeout(() => {
      el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' })
    }, 900)
    const t2 = setTimeout(() => {
      el.scrollTo({ left: 0, behavior: 'smooth' })
    }, 2200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
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
