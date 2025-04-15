import PDFDocument from 'pdfkit'

export const generatePdf = (res, formData) => {
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
}
