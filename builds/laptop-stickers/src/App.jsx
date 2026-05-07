import { useRef } from 'react'
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
  const { hasPlacedFirst, showTip, markFirstPlaced } = useOnboarding()
  const sceneRef = useRef(null)

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
      {showTip && (
        <div className="resize-tip" aria-live="polite">
          scroll to resize &nbsp;·&nbsp; shift + scroll to rotate
        </div>
      )}
      <Actions
        onClear={clearAll}
        onRestore={restoreAll}
        containerRef={sceneRef}
        onShutter={playShutter}
      />
    </div>
  )
}
