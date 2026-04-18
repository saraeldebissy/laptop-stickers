import html2canvas from 'html2canvas'

export function Actions({ onClear, containerRef }) {
  const handleScreenshot = async () => {
    if (!containerRef.current) return
    const canvas = await html2canvas(containerRef.current, {
      backgroundColor: '#0a0a0a',
      scale: window.devicePixelRatio,
      useCORS: true,
    })
    const link = document.createElement('a')
    link.download = 'my-stickers.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="actions">
      <button className="action-btn" onClick={onClear}>Clear All</button>
      <button className="action-btn" onClick={handleScreenshot}>Screenshot</button>
      <div className="auto-save-hint">auto-saved<br />to browser</div>
    </div>
  )
}
