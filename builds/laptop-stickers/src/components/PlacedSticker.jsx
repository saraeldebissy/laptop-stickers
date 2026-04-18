import Draggable from 'react-draggable'
import { useRef, useState } from 'react'

export function PlacedSticker({ id, src, x, y, rotation, onRemove, onRemoveStart, onMove }) {
  const nodeRef = useRef(null)
  const didMoveRef = useRef(false)
  const [removing, setRemoving] = useState(false)

  const handleStart = () => {
    didMoveRef.current = false
  }

  const handleDrag = () => {
    didMoveRef.current = true
  }

  const handleStop = (_e, data) => {
    if (didMoveRef.current) {
      onMove(id, data.x, data.y)
    }
  }

  const handleClick = () => {
    if (!didMoveRef.current) {
      onRemoveStart?.()
      setRemoving(true)
    }
  }

  const handleAnimationEnd = (e) => {
    if (e.animationName === 'stickerPeel') {
      onRemove(id)
    }
  }

  return (
    <Draggable
      nodeRef={nodeRef}
      defaultPosition={{ x, y }}
      bounds="parent"
      disabled={removing}
      onStart={handleStart}
      onDrag={handleDrag}
      onStop={handleStop}
    >
      <div ref={nodeRef} className="placed-sticker" onClick={handleClick}>
        <div
          className={`sticker-inner${removing ? ' peeling' : ''}`}
          style={{ '--rot': `${rotation}deg` }}
          onAnimationEnd={handleAnimationEnd}
        >
          <img src={src} alt="" draggable={false} />
        </div>
      </div>
    </Draggable>
  )
}
