import express from 'express'
import PDFDocument from 'pdfkit'
const router = express.Router()

let formData = null

router.get('/download', (req, res) => {
  res.render('download', { formData })
})

router.post('/download', (req, res) => {
  formData = req.body
  console.log('Form data received:', formData)

  res.redirect('/download')
})

router.get('/generate-pdf', (req, res) => {
  res.setHeader('Content-Disposition', 'attachment; filename="draft_my_cv.pdf"')
  res.setHeader('Content-Type', 'application/pdf')

  const doc = new PDFDocument()

  doc.pipe(res)

  doc.fontSize(20).text('User Information', { underline: true })
  doc.moveDown()

  Object.entries(formData).forEach(([key, value]) => {
    doc.fontSize(14).text(`${key}: ${value}`)
    doc.moveDown(0.5)
  })

  doc.end()
})

export default router
