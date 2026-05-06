import { useState } from 'react'

const KEY_PLACED = 'stickers-ob-placed'
const KEY_TIP    = 'stickers-ob-tip'

export function useOnboarding() {
  const [hasPlacedFirst, setHasPlacedFirst] = useState(
    () => localStorage.getItem(KEY_PLACED) === '1'
  )
  const [showTip, setShowTip] = useState(false)

  const markFirstPlaced = () => {
    if (hasPlacedFirst) return
    localStorage.setItem(KEY_PLACED, '1')
    setHasPlacedFirst(true)
    if (localStorage.getItem(KEY_TIP) !== '1') {
      setShowTip(true)
      setTimeout(() => {
        setShowTip(false)
        localStorage.setItem(KEY_TIP, '1')
      }, 4500)
    }
  }

  return { hasPlacedFirst, showTip, markFirstPlaced }
}
