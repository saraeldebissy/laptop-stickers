import Draggable from 'react-draggable'
import { useRef } from 'react'

export function PlacedSticker({ id, src, x, y, rotation, onRemove, onMove }) {
  const nodeRef = useRef(null)
  const didMoveRef = useRef(false)

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
      onRemove(id)
    }
  }

  return (
    <Draggable
      nodeRef={nodeRef}
      defaultPosition={{ x, y }}
      bounds="parent"
      onStart={handleStart}
      onDrag={handleDrag}
      onStop={handleStop}
    >
      <div
        ref={nodeRef}
        className="placed-sticker"
        onClick={handleClick}
      >
        <img
          src={src}
          alt=""
          draggable={false}
          style={{ transform: `rotate(${rotation}deg)` }}
        />
      </div>
    </Draggable>
  )
}
