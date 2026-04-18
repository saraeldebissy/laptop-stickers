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
