import express from 'express'
import {
  generatePdf,
  generateWordDoc
} from '../generate/index.js'

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
  if (!formData) {
    return res.status(400).send('No data available to generate the PDF document')
  }
  generatePdf(res, formData)
})

router.get('/generate-word', async (req, res) => {
  if (!formData) {
    return res.status(400).send('No data available to generate the Word document')
  }
  await generateWordDoc(res, formData)
})

export default router
