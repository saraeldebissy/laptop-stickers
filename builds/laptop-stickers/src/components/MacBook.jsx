import { useRef } from 'react'
import { PlacedSticker } from './PlacedSticker'

export function MacBook({ stickers, onAdd, onRemove, onRemoveStart, onMove, containerRef }) {
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
    const rawX = e.clientX - rect.left - 32
    const rawY = e.clientY - rect.top - 32
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
          {/* Real Apple logo SVG */}
          <svg
            className="apple-logo"
            viewBox="0 0 384 512"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
          </svg>
          {stickers.map((s) => (
            <PlacedSticker
              key={s.id}
              {...s}
              onRemove={onRemove}
              onRemoveStart={onRemoveStart}
              onMove={onMove}
            />
          ))}
        </div>
        <div className="macbook-hinge" />
        <div className="macbook-glow" />
      </div>
    </div>
  )
}
