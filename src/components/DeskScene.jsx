import { useRef, useState, useEffect } from 'react'
import { PlacedSticker } from './PlacedSticker'

// Natural image dimensions (background.png)
const IMG_W = 1672
const IMG_H = 941

// Lid defined by its CENTER as a fraction of image size + dimensions.
// Center-anchoring means the drop zone stays pinned to the same point
// on the photo regardless of how background-size:cover crops the image.
const LID = { cx: 0.526, cy: 0.645, w: 0.420, h: 0.380 }

function calcLidPos() {
  const vw = window.innerWidth
  const vh = window.innerHeight
  // Mirror what background-size: cover does
  const scale = Math.max(vw / IMG_W, vh / IMG_H)
  const rw = IMG_W * scale
  const rh = IMG_H * scale
  // background-position: center center
  const ox = (vw - rw) / 2
  const oy = (vh - rh) / 2
  const w = Math.round(LID.w * rw)
  const h = Math.round(LID.h * rh)
  return {
    left: Math.round(ox + LID.cx * rw - w / 2),
    top:  Math.round(oy + LID.cy * rh - h / 2),
    width:  w,
    height: h,
  }
}

export function DeskScene({ sceneRef, stickers, onAdd, onRemove, onRemoveStart, onMove, showHint }) {
  const surfaceRef = useRef(null)
  const [pos, setPos] = useState(calcLidPos)

  useEffect(() => {
    const onResize = () => setPos(calcLidPos())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const src = e.dataTransfer.getData('sticker-src')
    if (!src || !surfaceRef.current) return
    const rect = surfaceRef.current.getBoundingClientRect()
    const rawX = e.clientX - rect.left - 45
    const rawY = e.clientY - rect.top - 45
    const x = Math.max(0, Math.min(rawX, rect.width - 90))
    const y = Math.max(0, Math.min(rawY, rect.height - 90))
    onAdd(src, x, y)
  }

  return (
    <div className="desk-scene" ref={sceneRef}>
      <div
        ref={surfaceRef}
        className="sticker-surface"
        style={{
          position: 'absolute',
          left: pos.left,
          top:  pos.top,
          width:  pos.width,
          height: pos.height,
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {showHint && (
          <div className="lid-hint" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
            <span className="lid-hint-text">drag to place</span>
          </div>
        )}
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
    </div>
  )
}
