import express from 'express'
import nunjucks from 'nunjucks'
import PDFDocument from 'pdfkit'
import htmlToDocx from 'html-to-docx'
const router = express.Router()

let formData = null

// GET: Form submission page
router.get('/', (req, res) => {
  res.render('submit')
})

// POST: Handle form submission and store data in memory
router.post('/download', (req, res) => {
  formData = req.body
  console.log('User successfully submitted formData')
  res.redirect('/download')
})

// GET: Download options page
router.get('/download', (req, res) => {
  res.render('download')
})

// GET: Generate and stream PDF version of CV
// router.get('/generate-pdf', async (req, res) => {
//   if (!formData) return res.status(400).send('No data available')

//   nunjucks.render('template.njk', formData, async (err, html) => {
//     if (err) {
//       console.error('Template error:', err)
//       return res.status(500).send('Failed to render')
//     }

//     try {
//       const file = { content: html }
//       const options = { format: 'A4' }

//       const pdfBuffer = await pdf.generatePdf(file, options)

//       res.setHeader('Content-Type', 'application/pdf')
//       res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf')
//       res.send(pdfBuffer)
//     } catch (e) {
//       console.error('PDF generation error:', e)
//       res.status(500).send('Failed to generate PDF')
//     }
//   })
// })

router.get('/generate-pdf', (req, res) => {
  if (!formData) return res.status(400).send('No data to generate PDF')

  const doc = new PDFDocument({ margin: 40 })
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf')
  doc.pipe(res)

  const addSectionTitle = (title) => {
    doc.moveDown(1).fontSize(14).font('Helvetica-Bold').text(title, { align: 'center' }).moveDown(0.5)
  }

  const addEntry = (lines = []) => {
    lines.forEach(line => {
      if (line) doc.fontSize(11).font('Helvetica').text(line)
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
      doc.fontSize(11).font('Helvetica-Bold').text(`${jobCompany} (${jobStart} – ${jobEnd})`)
      doc.fontSize(11).font('Helvetica').text(jobTitle)
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
        doc.fontSize(11).font('Helvetica-Bold').text(title, { continued: true })
        if (url) {
          doc.fontSize(11).font('Helvetica').text(` (${url})`, { link: url, underline: true, continued: false })
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

// GET: Generate and stream Word version of CV
router.get('/generate-word', (req, res) => {
  if (!formData) {
    return res.status(400).send('No data available to generate the Word document')
  }

  nunjucks.render('template.njk', formData, async (err, html) => {
    if (err) {
      console.error('Nunjucks render error (Word):', err)
      return res.status(500).send('Template rendering failed')
    }

    try {
      const fileBuffer = await htmlToDocx(html, null, {
        table: { row: { cantSplit: true } },
        footer: true,
        pageNumber: true
      })

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
      res.setHeader('Content-Disposition', 'attachment; filename=resume.docx')
      res.send(fileBuffer)
    } catch (e) {
      console.error('Word document generation error:', e)
      res.status(500).send('Failed to generate Word document')
    }
  })
})

export default router

// import express from 'express'
// import nunjucks from 'nunjucks'
// // import { Readable } from 'Stream'
// // import { Document, Packer, Paragraph } from 'docx'
// import htmlToDocx from 'html-to-docx'
// import puppeteer from 'puppeteer'
// // import {
// //   generatePdf,
// //   generateWordDoc
// // } from '../cv/generate/index.js'

// // const { renderFile } = pkg

// const router = express.Router()

// let formData = null

// router.get('/', (req, res) => {
//   res.render('submit')
// })

// router.post('/download', (req, res) => {
//   formData = req.body
//   console.log('User successfully submitted formData')
//   res.redirect('/download')
// })

// router.get('/download', (req, res) => {
//   res.render('download')
// })

// router.get('/generate-pdf', (req, res) => {
//   if (!formData) {
//     return res.status(400).send('No data available to generate the PDF document')
//   }

//   renderFile('views/cv.njk', formData, async (err, html) => {
//     if (err) {
//       return res.status(500).send('Template rendering failed')
//     }

//     try {
//       const browser = await puppeteer.launch()
//       const page = await browser.newPage()
//       await page.setContent(html, { waitUntil: 'networkidle0' })

//       const pdfBuffer = await page.pdf({ format: 'A4' })

//       await browser.close()

//       res.setHeader('Content-Type', 'application/pdf')
//       res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf')
//       res.send(pdfBuffer)
//     } catch (e) {
//       console.error('PDF generation error:', e)
//       res.status(500).send('Failed to generate PDF')
//     }
//   })
//   // if (!formData) {
//   //   return res.status(400).send('No data available to generate the PDF document')
//   // }
//   // generatePdf(res, formData)
// })

// router.get('/generate-word', async (req, res) => {
//   if (!formData) {
//     return res.status(400).send('No data available to generate the Word document')
//   }

//   // Render the Nunjucks template with the user data to HTML
//   nunjucks.render('template.njk', formData, async (err, html) => {
//     if (err) {
//       console.error('Error rendering Nunjucks template:', err)
//       return res.status(500).send('Template rendering failed')
//     }

//     try {
//       // Convert HTML to Word doc
//       const fileBuffer = await htmlToDocx(html, null, {
//         table: { row: { cantSplit: true } },
//         footer: true,
//         pageNumber: true
//       })

//       // Send the Word document to the user as a download
//       res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
//       res.setHeader('Content-Disposition', 'attachment; filename=resume.docx')
//       res.send(fileBuffer)
//     } catch (e) {
//       console.error('Word document generation error:', e)
//       res.status(500).send('Failed to generate Word document')
//     }
//     // if (!formData) {
//     //   return res.status(400).send('No data available to generate the Word document')
//     // }
//     // await generateWordDoc(res, formData)
//   })
// })

// export default router
