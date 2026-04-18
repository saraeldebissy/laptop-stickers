import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useLayout } from './useLayout'

const localStorageMock = (() => {
  let store = {}
  return {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => { store[key] = String(value) },
    clear: () => { store = {} },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  configurable: true,
  writable: true,
})

describe('useLayout', () => {
  beforeEach(() => localStorageMock.clear())

  it('starts with empty stickers when localStorage is empty', () => {
    const { result } = renderHook(() => useLayout())
    expect(result.current.stickers).toEqual([])
  })

  it('adds a sticker with src, x, y, id, and rotation within ±12°', () => {
    const { result } = renderHook(() => useLayout())
    act(() => result.current.addSticker('/test.png', 100, 50))

    expect(result.current.stickers).toHaveLength(1)
    const s = result.current.stickers[0]
    expect(s.src).toBe('/test.png')
    expect(s.x).toBe(100)
    expect(s.y).toBe(50)
    expect(typeof s.id).toBe('string')
    expect(s.rotation).toBeGreaterThanOrEqual(-12)
    expect(s.rotation).toBeLessThanOrEqual(12)
  })

  it('removes a sticker by id', () => {
    const { result } = renderHook(() => useLayout())
    act(() => result.current.addSticker('/test.png', 0, 0))
    const id = result.current.stickers[0].id
    act(() => result.current.removeSticker(id))
    expect(result.current.stickers).toHaveLength(0)
  })

  it('moves a sticker to new coordinates', () => {
    const { result } = renderHook(() => useLayout())
    act(() => result.current.addSticker('/test.png', 0, 0))
    const id = result.current.stickers[0].id
    act(() => result.current.moveSticker(id, 80, 120))
    expect(result.current.stickers[0].x).toBe(80)
    expect(result.current.stickers[0].y).toBe(120)
  })

  it('clearAll removes all stickers', () => {
    const { result } = renderHook(() => useLayout())
    act(() => result.current.addSticker('/a.png', 0, 0))
    act(() => result.current.addSticker('/b.png', 10, 10))
    act(() => result.current.clearAll())
    expect(result.current.stickers).toHaveLength(0)
  })

  it('persists to localStorage on add', () => {
    const { result } = renderHook(() => useLayout())
    act(() => result.current.addSticker('/test.png', 10, 20))
    const stored = JSON.parse(localStorageMock.getItem('laptop-stickers-layout'))
    expect(stored).toHaveLength(1)
    expect(stored[0].src).toBe('/test.png')
    expect(stored[0].x).toBe(10)
    expect(stored[0].y).toBe(20)
  })

  it('restores layout from localStorage on mount', () => {
    const saved = [{ id: 'abc', src: '/old.png', x: 5, y: 10, rotation: 3 }]
    localStorageMock.setItem('laptop-stickers-layout', JSON.stringify(saved))
    const { result } = renderHook(() => useLayout())
    expect(result.current.stickers).toHaveLength(1)
    expect(result.current.stickers[0].id).toBe('abc')
  })
})
