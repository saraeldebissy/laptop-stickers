import { useRef, useEffect } from 'react'
import { useLayout } from './hooks/useLayout'
import { useSound } from './hooks/useSound'
import { useOnboarding } from './hooks/useOnboarding'
import { StickerPanel } from './components/StickerPanel'
import { DeskScene } from './components/DeskScene'
import { Actions } from './components/Actions'
import './App.css'

export default function App() {
  const { stickers, addSticker, removeSticker, moveSticker, clearAll, restoreAll } = useLayout()
  const { playAdd, playRemove, playShutter } = useSound()
  const { hasPlacedFirst, markFirstPlaced } = useOnboarding()
  const sceneRef = useRef(null)

  useEffect(() => {
    const down = (e) => { if (e.key === 'Shift') document.body.classList.add('shift-held') }
    const up   = (e) => { if (e.key === 'Shift') document.body.classList.remove('shift-held') }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  const handleAdd = (src, x, y) => {
    addSticker(src, x, y)
    playAdd()
    markFirstPlaced()
  }

  const showHint = !hasPlacedFirst && stickers.length === 0

  return (
    <div className="app">
      <DeskScene
        sceneRef={sceneRef}
        stickers={stickers}
        onAdd={handleAdd}
        onRemove={removeSticker}
        onRemoveStart={playRemove}
        onMove={moveSticker}
        showHint={showHint}
      />
      <StickerPanel />
      <Actions
        onClear={clearAll}
        onRestore={restoreAll}
        containerRef={sceneRef}
        onShutter={playShutter}
      />
    </div>
  )
}
