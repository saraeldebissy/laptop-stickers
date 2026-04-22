import { useRef } from 'react'
import { useLayout } from './hooks/useLayout'
import { useSound } from './hooks/useSound'
import { StickerPanel } from './components/StickerPanel'
import { MacBook } from './components/MacBook'
import { Actions } from './components/Actions'
import './App.css'

export default function App() {
  const { stickers, addSticker, removeSticker, moveSticker, clearAll } = useLayout()
  const { playAdd, playRemove, playShutter } = useSound()
  const macbookRef = useRef(null)

  const handleAdd = (src, x, y) => {
    addSticker(src, x, y)
    playAdd()
  }

  return (
    <div className="app">
      <MacBook
        stickers={stickers}
        onAdd={handleAdd}
        onRemove={removeSticker}
        onRemoveStart={playRemove}
        onMove={moveSticker}
        containerRef={macbookRef}
      />
      <StickerPanel />
      <Actions onClear={clearAll} containerRef={macbookRef} onShutter={playShutter} />
    </div>
  )
}
