import Draggable from 'react-draggable'
import { useRef, useState, useEffect } from 'react'

const MIN_SIZE = 48
const MAX_SIZE = 180
const STEP = 8

export function PlacedSticker({ id, src, x, y, rotation, onRemove, onRemoveStart, onMove }) {
  const nodeRef = useRef(null)
  const didMoveRef = useRef(false)
  const [removing, setRemoving] = useState(false)
  const [size, setSize] = useState(90)

  useEffect(() => {
    const el = nodeRef.current
    if (!el) return
    const onWheel = (e) => {
      e.preventDefault()
      setSize((prev) => Math.min(MAX_SIZE, Math.max(MIN_SIZE, prev + (e.deltaY < 0 ? STEP : -STEP))))
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

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
      <div
        ref={nodeRef}
        className="placed-sticker"
        style={{ width: size, height: size }}
        onClick={handleClick}
      >
        <div
          className={`sticker-inner${removing ? ' peeling' : ''}`}
          style={{ '--rot': `${rotation}deg`, width: size, height: size }}
          onAnimationEnd={handleAnimationEnd}
        >
          <img src={src} alt="" draggable={false} style={{ width: size, height: size }} />
        </div>
      </div>
    </Draggable>
  )
}
