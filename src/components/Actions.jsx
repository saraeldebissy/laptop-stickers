import { useState, useRef } from 'react'
import html2canvas from 'html2canvas'

export function Actions({ onClear, onRestore, containerRef, onShutter }) {
  const [flashing, setFlashing]       = useState(false)
  const [undoSnapshot, setUndoSnapshot] = useState(null)
  const undoTimer = useRef(null)

  const handleScreenshot = async () => {
    if (!containerRef.current) return
    onShutter?.()
    setFlashing(true)
    const canvas = await html2canvas(containerRef.current, {
      backgroundColor: null,
      scale: window.devicePixelRatio,
      useCORS: true,
    })
    const link = document.createElement('a')
    link.download = 'my-stickers.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const handleClear = () => {
    const snapshot = onClear()
    if (!snapshot?.length) return
    clearTimeout(undoTimer.current)
    setUndoSnapshot(snapshot)
    undoTimer.current = setTimeout(() => setUndoSnapshot(null), 3000)
  }

  const handleUndo = () => {
    clearTimeout(undoTimer.current)
    onRestore(undoSnapshot)
    setUndoSnapshot(null)
  }

  return (
    <>
      {flashing && (
        <div
          className="screenshot-flash"
          onAnimationEnd={() => setFlashing(false)}
        />
      )}
      {undoSnapshot && (
        <div className="undo-toast">
          <span>Cleared</span>
          <button className="undo-btn" onClick={handleUndo}>Undo</button>
        </div>
      )}
      <div className="actions">
        <button className="chip" onClick={handleScreenshot} title="Save screenshot">
          📸
        </button>
        <button className="chip" onClick={handleClear} title="Clear all stickers">
          🧹
        </button>
      </div>
    </>
  )
}
