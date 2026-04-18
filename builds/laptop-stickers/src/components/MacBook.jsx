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
