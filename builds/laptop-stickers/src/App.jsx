import { useRef } from 'react'
import { useLayout } from './hooks/useLayout'
import { useSound } from './hooks/useSound'
import { StickerPanel } from './components/StickerPanel'
import { MacBook } from './components/MacBook'
import { Actions } from './components/Actions'
import './App.css'

export default function App() {
  const { stickers, addSticker, removeSticker, moveSticker, clearAll } = useLayout()
  const { playAdd, playRemove } = useSound()
  const macbookRef = useRef(null)

  const handleAdd = (src, x, y) => {
    addSticker(src, x, y)
    playAdd()
  }

  const handleRemove = (id) => {
    removeSticker(id)
    playRemove()
  }

  return (
    <div className="app">
      <StickerPanel />
      <MacBook
        stickers={stickers}
        onAdd={handleAdd}
        onRemove={handleRemove}
        onMove={moveSticker}
        containerRef={macbookRef}
      />
      <Actions onClear={clearAll} containerRef={macbookRef} />
    </div>
  )
}
