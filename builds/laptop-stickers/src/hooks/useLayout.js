import { useState } from 'react'

const STORAGE_KEY = 'laptop-stickers-layout'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function useLayout() {
  const [stickers, setStickers] = useState(load)

  const addSticker = (src, x, y) => {
    setStickers((prev) => {
      const next = [
        ...prev,
        {
          id: crypto.randomUUID(),
          src,
          x,
          y,
          rotation: Math.round(Math.random() * 24 - 12),
        },
      ]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const removeSticker = (id) => {
    setStickers((prev) => {
      const next = prev.filter((s) => s.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const moveSticker = (id, x, y) => {
    setStickers((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, x, y } : s))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const clearAll = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
    setStickers([])
  }

  return { stickers, addSticker, removeSticker, moveSticker, clearAll }
}
