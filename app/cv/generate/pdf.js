import PDFDocument from 'pdfkit'
import { layout } from '../pdf/styles.js'
import { createHeader } from '../pdf/sections/header.js'
import { createEducation } from '../pdf/sections/education.js'
import { createExperience } from '../pdf/sections/experience.js'
import { createProjects } from '../pdf/sections/projects.js'
import { createInterests } from '../pdf/sections/interests.js'

export const generatePdf = (formData, res) => {
  if (!formData) {
    return res.status(400).send('No data available to generate CV/resume as a PDF')
  }

  try {
    const doc = new PDFDocument({ margin: layout.margin })
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf')
    doc.pipe(res)

    createHeader(doc, formData)
    createEducation(doc, formData)
    createExperience(doc, formData)
    createProjects(doc, formData)
    createInterests(doc, formData)

    doc.end()
  } catch (error) {
    console.error('PDF generation error:', error)
    res.status(500).send('Failed to generate PDF')
  }
}
