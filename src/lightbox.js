// Tap-to-enlarge viewer for the "Our work" gallery.
// It reads every <img> inside .gallery-open buttons, so adding a photo to the
// gallery in index.html is all it takes; nothing here needs to change.
// Uses a native <dialog>, so Esc closes it and focus stays inside while it's open.

export function setupLightbox(gallery, dialog) {
  if (!gallery || !dialog || typeof dialog.showModal !== 'function') return

  const buttons = [...gallery.querySelectorAll('.gallery-open')]
  const img = dialog.querySelector('.lightbox-img')
  const caption = dialog.querySelector('.lightbox-caption')
  const count = dialog.querySelector('.lightbox-count')
  let current = 0
  let opener = null

  function show(index) {
    current = (index + buttons.length) % buttons.length
    const thumb = buttons[current].querySelector('img')
    const figcaption = buttons[current].closest('figure')?.querySelector('figcaption')

    img.removeAttribute('srcset')
    img.src = thumb.getAttribute('src')
    // Reuse the thumbnail's srcset so the browser fetches the full-size photo.
    if (thumb.getAttribute('srcset')) {
      img.sizes = '100vw'
      img.srcset = thumb.getAttribute('srcset')
    }
    img.alt = thumb.alt
    caption.textContent = figcaption ? figcaption.textContent : ''
    count.textContent = `Photo ${current + 1} of ${buttons.length}`
  }

  buttons.forEach((button, index) => {
    const alt = button.querySelector('img')?.alt
    button.setAttribute('aria-label', `Enlarge photo: ${alt}`)
    button.setAttribute('aria-haspopup', 'dialog')
    button.addEventListener('click', () => {
      opener = button
      show(index)
      dialog.showModal()
      document.documentElement.classList.add('no-scroll')
    })
  })

  dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close())
  dialog.querySelector('.lightbox-prev').addEventListener('click', () => show(current - 1))
  dialog.querySelector('.lightbox-next').addEventListener('click', () => show(current + 1))

  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') show(current - 1)
    if (event.key === 'ArrowRight') show(current + 1)
  })

  // Clicking the dark backdrop (outside the photo and buttons) closes it.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close()
  })

  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('no-scroll')
    opener?.focus()
  })
}
