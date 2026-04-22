export function useSound() {
  const play = (type) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()

      if (type === 'add') {
        // Sticker slap: bandpass-filtered white noise burst + low thud
        const bufLen = Math.floor(ctx.sampleRate * 0.09)
        const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate)
        const data = buf.getChannelData(0)
        for (let i = 0; i < bufLen; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufLen * 0.25))
        }
        const noise = ctx.createBufferSource()
        noise.buffer = buf

        const bp = ctx.createBiquadFilter()
        bp.type = 'bandpass'
        bp.frequency.value = 1400
        bp.Q.value = 1.8

        const noiseGain = ctx.createGain()
        noiseGain.gain.setValueAtTime(0.6, ctx.currentTime)
        noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09)

        noise.connect(bp)
        bp.connect(noiseGain)
        noiseGain.connect(ctx.destination)
        noise.start(ctx.currentTime)

        // Low thud underneath
        const thud = ctx.createOscillator()
        const thudGain = ctx.createGain()
        thud.type = 'sine'
        thud.frequency.setValueAtTime(110, ctx.currentTime)
        thud.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 0.07)
        thudGain.gain.setValueAtTime(0.35, ctx.currentTime)
        thudGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07)
        thud.connect(thudGain)
        thudGain.connect(ctx.destination)
        thud.start(ctx.currentTime)
        thud.stop(ctx.currentTime + 0.07)

      } else if (type === 'shutter') {
        // Camera shutter: sharp mechanical click + mirror slap thud
        const bufLen = Math.floor(ctx.sampleRate * 0.04)
        const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate)
        const data = buf.getChannelData(0)
        for (let i = 0; i < bufLen; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufLen * 0.2))
        }
        const noise = ctx.createBufferSource()
        noise.buffer = buf

        const hp = ctx.createBiquadFilter()
        hp.type = 'highpass'
        hp.frequency.value = 3200

        const clickGain = ctx.createGain()
        clickGain.gain.setValueAtTime(0.9, ctx.currentTime)
        clickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04)

        noise.connect(hp)
        hp.connect(clickGain)
        clickGain.connect(ctx.destination)
        noise.start(ctx.currentTime)

        // Mirror slap — low thud underneath
        const slap = ctx.createOscillator()
        const slapGain = ctx.createGain()
        slap.type = 'sine'
        slap.frequency.setValueAtTime(180, ctx.currentTime)
        slap.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.06)
        slapGain.gain.setValueAtTime(0.5, ctx.currentTime)
        slapGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
        slap.connect(slapGain)
        slapGain.connect(ctx.destination)
        slap.start(ctx.currentTime)
        slap.stop(ctx.currentTime + 0.08)

      } else {
        // Sticker peel: highpass-swept noise (rising "zzt") + release pop
        const bufLen = Math.floor(ctx.sampleRate * 0.18)
        const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate)
        const data = buf.getChannelData(0)
        for (let i = 0; i < bufLen; i++) {
          const t = i / bufLen
          // ramp up then fade — like tape slowly lifting then snapping off
          data[i] = (Math.random() * 2 - 1) * Math.min(t * 4, 1) * (1 - t * 0.6)
        }
        const noise = ctx.createBufferSource()
        noise.buffer = buf

        const hp = ctx.createBiquadFilter()
        hp.type = 'highpass'
        hp.frequency.setValueAtTime(200, ctx.currentTime)
        hp.frequency.exponentialRampToValueAtTime(4000, ctx.currentTime + 0.15)

        const noiseGain = ctx.createGain()
        noiseGain.gain.setValueAtTime(0.28, ctx.currentTime)
        noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18)

        noise.connect(hp)
        hp.connect(noiseGain)
        noiseGain.connect(ctx.destination)
        noise.start(ctx.currentTime)

        // Release pop at the end (sticker snaps free)
        const pop = ctx.createOscillator()
        const popGain = ctx.createGain()
        pop.type = 'sine'
        pop.frequency.setValueAtTime(280, ctx.currentTime + 0.12)
        pop.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.18)
        popGain.gain.setValueAtTime(0, ctx.currentTime)
        popGain.gain.setValueAtTime(0.18, ctx.currentTime + 0.12)
        popGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18)
        pop.connect(popGain)
        popGain.connect(ctx.destination)
        pop.start(ctx.currentTime + 0.12)
        pop.stop(ctx.currentTime + 0.18)
      }
    } catch {
      // AudioContext unavailable — fail silently
    }
  }

  return {
    playAdd: () => play('add'),
    playRemove: () => play('remove'),
    playShutter: () => play('shutter'),
  }
}
