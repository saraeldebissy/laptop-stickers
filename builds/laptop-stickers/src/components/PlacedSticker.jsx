import Draggable from 'react-draggable'
import { useRef, useState, useEffect } from 'react'

const MIN_SIZE = 48
const MAX_SIZE = 180
const STEP = 8
const ROT_STEP = 3

export function PlacedSticker({ id, src, x, y, rotation, onRemove, onRemoveStart, onMove }) {
  const nodeRef = useRef(null)
  const didMoveRef = useRef(false)
  const sizeRef = useRef(90)
  const rotRef = useRef(rotation)
  const gestureRef = useRef(null)
  const resizeTimerRef = useRef(null)
  const [removing, setRemoving] = useState(false)
  const [size, setSize] = useState(90)
  const [rot, setRot] = useState(rotation)

  // Keep refs in sync so event listeners always read current values
  useEffect(() => { sizeRef.current = size }, [size])
  useEffect(() => { rotRef.current = rot }, [rot])

  useEffect(() => {
    const el = nodeRef.current
    if (!el) return

    const markResizing = () => {
      el.classList.add('resizing')
      clearTimeout(resizeTimerRef.current)
      resizeTimerRef.current = setTimeout(() => el.classList.remove('resizing'), 400)
    }

    const onWheel = (e) => {
      e.preventDefault()
      if (e.ctrlKey) {
        markResizing()
        setSize((prev) => Math.min(MAX_SIZE, Math.max(MIN_SIZE, prev - e.deltaY * 0.6)))
      } else if (e.shiftKey) {
        setRot((prev) => prev + (e.deltaY < 0 ? -ROT_STEP : ROT_STEP))
      } else {
        markResizing()
        setSize((prev) => Math.min(MAX_SIZE, Math.max(MIN_SIZE, prev + (e.deltaY < 0 ? STEP : -STEP))))
      }
    }

    // Safari trackpad: two-finger pinch + rotate via GestureEvent
    const onGestureStart = (e) => {
      e.preventDefault()
      gestureRef.current = {
        scale: e.scale,
        rotation: e.rotation,
        size: sizeRef.current,
        rot: rotRef.current,
      }
    }

    const onGestureChange = (e) => {
      e.preventDefault()
      if (!gestureRef.current) return
      const { scale: s0, rotation: r0, size: sz0, rot: rot0 } = gestureRef.current
      setSize(Math.min(MAX_SIZE, Math.max(MIN_SIZE, sz0 * (e.scale / s0))))
      setRot(rot0 + (e.rotation - r0))
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('gesturestart', onGestureStart)
    el.addEventListener('gesturechange', onGestureChange)
    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('gesturestart', onGestureStart)
      el.removeEventListener('gesturechange', onGestureChange)
      clearTimeout(resizeTimerRef.current)
    }
  }, [])

  const handleStart = () => { didMoveRef.current = false }
  const handleDrag = () => { didMoveRef.current = true }
  const handleStop = (_e, data) => {
    if (didMoveRef.current) onMove(id, data.x, data.y)
  }

  const handleClick = () => {
    if (!didMoveRef.current) {
      onRemoveStart?.()
      setRemoving(true)
    }
  }

  const handleAnimationEnd = (e) => {
    if (e.animationName === 'stickerPeel') onRemove(id)
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
          style={{ '--rot': `${rot}deg`, width: size, height: size }}
          onAnimationEnd={handleAnimationEnd}
        >
          <img src={src} alt="" draggable={false} style={{ width: size, height: size }} />
        </div>
      </div>
    </Draggable>
  )
}
