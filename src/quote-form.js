// Sends the quote form to Web3Forms in the background and shows the result on
// the page, so the visitor never leaves the site.

const SUCCESS_MESSAGE =
  "Thanks, your quote request has been sent. We'll be in touch soon. If it's urgent, call 0477 265 777."
const ERROR_MESSAGE =
  "Sorry, your request didn't go through. Please try again, or call or text 0477 265 777."

export function setupQuoteForm(form, status) {
  if (!form || !status) return
  const submitButton = form.querySelector('[type="submit"]')
  const buttonLabel = submitButton.textContent

  function showStatus(message, type) {
    status.textContent = message
    status.className = `form-status form-status--${type}`
    status.hidden = false
    status.focus()
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    submitButton.disabled = true
    submitButton.textContent = 'Sending…'
    status.hidden = true

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      })
      const result = await response.json()

      if (response.ok && result.success) {
        form.reset()
        showStatus(SUCCESS_MESSAGE, 'success')
      } else {
        console.error('Web3Forms error:', result.message)
        showStatus(ERROR_MESSAGE, 'error')
      }
    } catch (error) {
      console.error('Quote form failed to send:', error)
      showStatus(ERROR_MESSAGE, 'error')
    } finally {
      submitButton.disabled = false
      submitButton.textContent = buttonLabel
    }
  })
}
