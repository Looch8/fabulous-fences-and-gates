import './style.css'
import { setupLightbox } from './lightbox.js'
import { setupQuoteForm } from './quote-form.js'

document.querySelector('#year').textContent = new Date().getFullYear()

setupLightbox(document.querySelector('.gallery'), document.querySelector('#lightbox'))
setupQuoteForm(document.querySelector('#quote-form'), document.querySelector('#form-status'))
