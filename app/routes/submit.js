import express from 'express'
import PDFDocument from 'pdfkit'
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
  if (!formData) return res.status(400).send('No data to generate PDF')

  const doc = new PDFDocument({ margin: 40 })
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf')
  doc.pipe(res)

  const addSectionTitle = (title) => {
    doc.moveDown(1).fontSize(14).font('Times-Bold').text(title, { align: 'center' }).moveDown(0.5)
  }

  const addEntry = (lines = []) => {
    lines.forEach(line => {
      if (line) doc.fontSize(11).font('Times-Roman').text(line)
    })
    doc.moveDown(0.5)
  }

  // Header
  doc.fontSize(18).font('Times-Bold').text(`${formData.firstName} ${formData.lastName}`, { align: 'center' })
  doc.moveDown(0.5)
  doc.moveTo(doc.x, doc.y).lineTo(550, doc.y).stroke()
  doc.moveDown(0.5)

  // Contact Info
  const city = formData.city || ''
  const country = formData.country || ''
  const location = city + (country ? `, ${country}` : '')
  const contact = [location, formData.emailAddress, `${formData.callingCode || ''} ${formData.phoneNumber}`].filter(Boolean).join(' • ')
  doc.fontSize(11).font('Times-Roman').text(contact, { align: 'center' })
  doc.moveDown(1)

  // Education
  addSectionTitle('Education')
  if (formData.ugUniversity) {
    addEntry([
      `${formData.ugUniversity} (${formData.ugLocation})`,
      `${formData.ugDegree} • Graduation: ${formData.ugGraduationYear}`,
      formData.ugDissertationTitle && `Thesis: ${formData.ugDissertationTitle}`,
      formData.ugGrade && `Grade: ${formData.ugGrade}`
    ])
  }
  if (formData.pgUniversity) {
    addEntry([
      `${formData.pgUniversity} (${formData.pgCityOrState})`,
      `${formData.pgDegree} • Graduation: ${formData.pgGraduationYear}`,
      formData.pgDissertationTitle && `Thesis: ${formData.pgDissertationTitle}`,
      formData.pgGrade && `Grade: ${formData.pgGrade}`
    ])
  }
  if (formData.exchangeUniversity) {
    addEntry([
      `Study Abroad: ${formData.exchangeUniversity} (${formData.exchangeCityOrState})`,
      `${formData.exchangeDegreeProgramme} • ${formData.exchangeYear}`
    ])
  }
  if (formData.highSchool) {
    addEntry([
      `${formData.highSchool} • Graduation: ${formData.hsGraduationYear}`
    ])
  }

  // Experience
  addSectionTitle('Experience')
  for (let i = 1; i <= 3; i++) {
    const jobTitle = formData[`jobTitle${i}`]
    const jobCompany = formData[`jobCompany${i}`]
    const jobStart = formData[`jobStart${i}`]
    const jobEnd = formData[`jobEnd${i}`]
    const jobSummary = formData[`jobSummary${i}`]

    if (jobTitle) {
      doc.fontSize(11).font('Times-Bold').text(`${jobCompany} (${jobStart} – ${jobEnd})`)
      doc.fontSize(11).font('Times-Roman').text(jobTitle)
      if (jobSummary) {
        const lines = jobSummary.split('\n').filter(line => line.trim())
        doc.moveDown(0.2)
        lines.forEach(line => doc.circle(doc.x - 5, doc.y + 4, 1).fill().text(`  ${line}`, { continued: false }).fillColor('black'))
        doc.moveDown(0.5)
      }
    }
  }

  // Projects
  if (formData.projectTitle1 || formData.projectTitle2 || formData.projectTitle3) {
    addSectionTitle('Projects')
    for (let i = 1; i <= 3; i++) {
      const title = formData[`projectTitle${i}`]
      const url = formData[`projectUrl${i}`]
      const summary = formData[`projectSummary${i}`]

      if (title) {
        doc.fontSize(11).font('Times-Bold').text(title, { continued: true })
        if (url) {
          doc.fontSize(11).font('Times-Roman').text(` (${url})`, { link: url, underline: true, continued: false })
        } else {
          doc.text('', { continued: false })
        }

        if (summary) {
          const lines = summary.split('\n').filter(line => line.trim())
          lines.forEach(line => doc.circle(doc.x - 5, doc.y + 4, 1).fill().text(`  ${line}`, { continued: false }).fillColor('black'))
          doc.moveDown(0.5)
        }
      }
    }
  }

  // Skills & Interests
  addSectionTitle('Skills & Interests')
  const interests = []
  for (let i = 1; i <= 6; i++) {
    if (formData[`interest${i}`]) interests.push(formData[`interest${i}`])
  }
  if (interests.length) {
    interests.forEach(item => {
      doc.circle(doc.x - 5, doc.y + 4, 1).fill().text(`  ${item}`, { continued: false }).fillColor('black')
    })
  }

  doc.end()
})

router.get('/generate-word', async (req, res) => {
  await generateWordDoc(formData, res)
})

export default router
