import { useState } from 'react'

const KEY_PLACED = 'stickers-ob-placed'

export function useOnboarding() {
  const [hasPlacedFirst, setHasPlacedFirst] = useState(
    () => localStorage.getItem(KEY_PLACED) === '1'
  )

  const markFirstPlaced = () => {
    if (hasPlacedFirst) return
    localStorage.setItem(KEY_PLACED, '1')
    setHasPlacedFirst(true)
  }

  return { hasPlacedFirst, markFirstPlaced }
}
