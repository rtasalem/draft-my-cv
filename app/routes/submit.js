import express from 'express'
import { generatePdf } from '../cv/generate/pdf.js'
import { generateWordDoc } from '../cv/generate/word.js'
const router = express.Router()

let formData = null

router.get('/', (req, res) => {
  res.render('submit')
})

router.post('/download', (req, res) => {
  formData = req.body
  console.log('User successfully submitted formData')
  res.redirect('/download')
})

router.get('/download', (req, res) => {
  res.render('download')
})

router.get('/generate-pdf', (req, res) => {
  generatePdf(formData, res)
})

router.get('/generate-word', async (req, res) => {
  await generateWordDoc(formData, res)
})

export default router
