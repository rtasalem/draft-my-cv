import { generatePdf } from '../cv/generate/pdf.js'
import { generateWordDoc } from '../cv/generate/word.js'

let formData = null

function submitController (req, res) {
  res.render('submit')
}

function downloadFormController (req, res) {
  formData = req.body
  console.log('user successfully submitted formData')
  res.redirect('/download')
}

function downloadController (req, res) {
  res.render('/download')
}

function generatePdfController (req, res) {
  generatePdf(formData, res)
}

async function generateWordDocController (req, res) {
  generateWordDoc(formData, res)
}

export {
  submitController,
  downloadFormController,
  downloadController,
  generatePdfController,
  generateWordDocController
}
