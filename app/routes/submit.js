import express from 'express'
import PDFDocument from 'pdfkit'
import * as docx from 'docx'
const router = express.Router()

let formData = null

router.get('/', (req, res) => {
  res.render('submit')
})

router.post('/download', (req, res) => {
  formData = req.body
  console.log('Form data received:', formData)
  res.redirect('/download')
})

router.get('/download', (req, res) => {
  res.render('download')
})

router.post('/download', (req, res) => {
  formData = req.body
  console.log('User input:', formData)
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

router.get('/generate-word', async (req, res) => {
  if (!formData) {
    return res.status(400).send('No data available to generate the Word document')
  }

  const doc = new docx.Document({
    creator: 'Draft My CV',
    title: 'CV',
    sections: [
      {
        children: [
          new docx.Paragraph({
            children: [
              new docx.TextRun({
                text: 'User Information',
                bold: true,
                size: 28
              })
            ]
          }),
          ...Object.entries(formData).map(([key, value]) =>
            new docx.Paragraph({
              text: `${key}: ${value}`
            })
          )
        ]
      }
    ]
  })

  const buffer = await docx.Packer.toBuffer(doc)

  res.setHeader(
    'Content-Disposition',
    'attachment; filename="draft_my_cv.docx"'
  )
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  )

  res.send(buffer)
})

export default router
