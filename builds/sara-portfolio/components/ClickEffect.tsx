'use client'

import { useEffect, useRef } from 'react'

const ACCENT = '#F472B6'
const RAY_COUNT = 8

export default function ClickEffect() {
  const audioCtxRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    function playTick() {
      try {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioContext()
        }
        const ctx = audioCtxRef.current
        if (ctx.state === 'suspended') ctx.resume()

        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.type = 'sine'
        osc.frequency.setValueAtTime(1100, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.05)
        gain.gain.setValueAtTime(0.08, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.09)
        osc.start()
        osc.stop(ctx.currentTime + 0.1)
      } catch {
        // audio unavailable — skip silently
      }
    }

    function createBurst(x: number, y: number) {
      const wrapper = document.createElement('div')
      wrapper.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 0;
        height: 0;
        pointer-events: none;
        z-index: 9999;
      `

      // Center dot
      const dot = document.createElement('div')
      dot.style.cssText = `
        position: absolute;
        width: 5px; height: 5px;
        background: ${ACCENT};
        border-radius: 50%;
        left: -2.5px; top: -2.5px;
        transform: scale(1.6);
        opacity: 1;
        transition: transform 0.32s ease, opacity 0.32s ease;
      `
      wrapper.appendChild(dot)

      // Rays
      const rays: HTMLDivElement[] = []
      for (let i = 0; i < RAY_COUNT; i++) {
        const angle = i * (360 / RAY_COUNT)
        const ray = document.createElement('div')
        ray.style.cssText = `
          position: absolute;
          width: 2px; height: 9px;
          background: ${ACCENT};
          border-radius: 1px;
          transform-origin: center bottom;
          left: -1px; top: -9px;
          transform: rotate(${angle}deg) translateY(-2px) scaleY(0.25);
          opacity: 1;
          transition: transform 0.42s cubic-bezier(0.2, 0, 0.3, 1), opacity 0.38s ease;
        `
        rays.push(ray)
        wrapper.appendChild(ray)
      }

      document.body.appendChild(wrapper)

      // Paint initial state first, then trigger transition
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          dot.style.transform = 'scale(0)'
          dot.style.opacity = '0'
          rays.forEach((ray, i) => {
            const angle = i * (360 / RAY_COUNT)
            ray.style.transform = `rotate(${angle}deg) translateY(-19px) scaleY(0.5)`
            ray.style.opacity = '0'
          })
        })
      })

      setTimeout(() => wrapper.remove(), 600)
    }

    function handleClick(e: MouseEvent) {
      playTick()
      createBurst(e.clientX, e.clientY)
    }

    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [])

  return null
}
