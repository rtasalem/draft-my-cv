import express from 'express'
import PDFDocument from 'pdfkit'
import {
  Document, Paragraph, TextRun,
  BorderStyle, AlignmentType, Packer
} from 'docx'
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

router.get('/generate-word', (req, res) => {
  if (!formData) {
    return res.status(400).send('No data available to generate the Word document')
  }

  try {
    const doc = new Document({
      sections: [],
      styles: {
        paragraphStyles: [
          {
            id: 'sectionTitle',
            name: 'Section Title',
            basedOn: 'Normal',
            next: 'Normal',
            run: {
              size: 28,
              bold: true,
              font: 'Calibri'
            },
            paragraph: {
              alignment: AlignmentType.CENTER,
              spacing: {
                before: 240,
                after: 120
              }
            }
          },
          {
            id: 'header',
            name: 'Header Name',
            basedOn: 'Normal',
            next: 'Normal',
            run: {
              size: 36,
              bold: true,
              font: 'Times New Roman'
            },
            paragraph: {
              alignment: AlignmentType.CENTER
            }
          },
          {
            id: 'contactInfo',
            name: 'Contact Info',
            basedOn: 'Normal',
            next: 'Normal',
            run: {
              size: 22,
              font: 'Times New Roman'
            },
            paragraph: {
              alignment: AlignmentType.CENTER,
              spacing: {
                after: 200
              }
            }
          },
          {
            id: 'entryTitle',
            name: 'Entry Title',
            basedOn: 'Normal',
            next: 'Normal',
            run: {
              size: 22,
              bold: true,
              font: 'Calibri'
            }
          },
          {
            id: 'entryText',
            name: 'Entry Text',
            basedOn: 'Normal',
            next: 'Normal',
            run: {
              size: 22,
              font: 'Calibri'
            }
          }
        ]
      }
    })

    const createBulletPoint = (text) => {
      return new Paragraph({
        style: 'entryText',
        bullet: {
          level: 0
        },
        children: [
          new TextRun(text)
        ]
      })
    }

    const fullName = `${formData.firstName} ${formData.lastName}`
    const sections = [
      new Paragraph({
        style: 'header',
        children: [
          new TextRun(fullName)
        ]
      }),

      new Paragraph({
        border: {
          bottom: {
            color: 'auto',
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6
          }
        },
        spacing: {
          before: 120,
          after: 120
        }
      }),

      new Paragraph({
        style: 'contactInfo',
        children: [
          new TextRun({
            text: [
              formData.city ? formData.city : '',
              formData.country ? (formData.city ? `, ${formData.country}` : formData.country) : '',
              formData.emailAddress ? ` • ${formData.emailAddress}` : '',
              formData.phoneNumber ? ` • ${formData.callingCode || ''} ${formData.phoneNumber}` : ''
            ].join('')
          })
        ]
      })
    ]

    sections.push(
      new Paragraph({
        style: 'sectionTitle',
        children: [
          new TextRun('Education')
        ]
      })
    )

    if (formData.ugUniversity) {
      sections.push(
        new Paragraph({
          style: 'entryTitle',
          children: [
            new TextRun(`${formData.ugUniversity} (${formData.ugLocation})`)
          ]
        }),
        new Paragraph({
          style: 'entryText',
          children: [
            new TextRun(`${formData.ugDegree} • Graduation: ${formData.ugGraduationYear}`)
          ]
        })
      )

      if (formData.ugDissertationTitle) {
        sections.push(
          new Paragraph({
            style: 'entryText',
            children: [
              new TextRun(`Thesis: ${formData.ugDissertationTitle}`)
            ]
          })
        )
      }

      if (formData.ugGrade) {
        sections.push(
          new Paragraph({
            style: 'entryText',
            children: [
              new TextRun(`Grade: ${formData.ugGrade}`)
            ]
          })
        )
      }

      sections.push(
        new Paragraph({
          spacing: {
            after: 120
          }
        })
      )
    }

    if (formData.pgUniversity) {
      sections.push(
        new Paragraph({
          style: 'entryTitle',
          children: [
            new TextRun(`${formData.pgUniversity} (${formData.pgCityOrState})`)
          ]
        }),
        new Paragraph({
          style: 'entryText',
          children: [
            new TextRun(`${formData.pgDegree} • Graduation: ${formData.pgGraduationYear}`)
          ]
        })
      )

      if (formData.pgDissertationTitle) {
        sections.push(
          new Paragraph({
            style: 'entryText',
            children: [
              new TextRun(`Thesis: ${formData.pgDissertationTitle}`)
            ]
          })
        )
      }

      if (formData.pgGrade) {
        sections.push(
          new Paragraph({
            style: 'entryText',
            children: [
              new TextRun(`Grade: ${formData.pgGrade}`)
            ]
          })
        )
      }

      sections.push(
        new Paragraph({
          spacing: {
            after: 120
          }
        })
      )
    }

    if (formData.exchangeUniversity) {
      sections.push(
        new Paragraph({
          style: 'entryTitle',
          children: [
            new TextRun(`Study Abroad: ${formData.exchangeUniversity} (${formData.exchangeCityOrState})`)
          ]
        }),
        new Paragraph({
          style: 'entryText',
          children: [
            new TextRun(`${formData.exchangeDegreeProgramme} • ${formData.exchangeYear}`)
          ]
        }),
        new Paragraph({
          spacing: {
            after: 120
          }
        })
      )
    }

    if (formData.highSchool) {
      sections.push(
        new Paragraph({
          style: 'entryTitle',
          children: [
            new TextRun(`${formData.highSchool}`)
          ]
        }),
        new Paragraph({
          style: 'entryText',
          children: [
            new TextRun(`Graduation: ${formData.hsGraduationYear}`)
          ]
        }),
        new Paragraph({
          spacing: {
            after: 120
          }
        })
      )
    }

    sections.push(
      new Paragraph({
        style: 'sectionTitle',
        children: [
          new TextRun('Experience')
        ]
      })
    )

    for (let i = 1; i <= 3; i++) {
      const jobTitle = formData[`jobTitle${i}`]
      const jobCompany = formData[`jobCompany${i}`]
      const jobStart = formData[`jobStart${i}`]
      const jobEnd = formData[`jobEnd${i}`]
      const jobSummary = formData[`jobSummary${i}`]

      if (jobTitle && jobCompany) {
        sections.push(
          new Paragraph({
            style: 'entryTitle',
            children: [
              new TextRun(`${jobCompany} (${jobStart} – ${jobEnd})`)
            ]
          }),
          new Paragraph({
            style: 'entryText',
            children: [
              new TextRun(jobTitle)
            ]
          })
        )

        if (jobSummary) {
          const lines = jobSummary.split('\n').filter(line => line.trim())
          lines.forEach(line => {
            sections.push(createBulletPoint(line))
          })
        }

        // Add spacKing
        sections.push(
          new Paragraph({
            spacing: {
              after: 120
            }
          })
        )
      }
    }

    let hasProjects = false
    for (let i = 1; i <= 3; i++) {
      if (formData[`projectTitle${i}`]) {
        hasProjects = true
        break
      }
    }

    if (hasProjects) {
      sections.push(
        new Paragraph({
          style: 'sectionTitle',
          children: [
            new TextRun('Projects')
          ]
        })
      )

      for (let i = 1; i <= 3; i++) {
        const title = formData[`projectTitle${i}`]
        const url = formData[`projectUrl${i}`]
        const summary = formData[`projectSummary${i}`]

        if (title) {
          const titleParts = []
          titleParts.push(
            new TextRun({
              text: title,
              bold: true
            })
          )

          if (url) {
            titleParts.push(
              new TextRun({
                text: ` (${url})`,
                style: 'hyperlink',
                underline: true
              })
            )
          }

          sections.push(
            new Paragraph({
              style: 'entryText',
              children: titleParts
            })
          )

          if (summary) {
            const lines = summary.split('\n').filter(line => line.trim())
            lines.forEach(line => {
              sections.push(createBulletPoint(line))
            })
          }

          sections.push(
            new Paragraph({
              spacing: {
                after: 120
              }
            })
          )
        }
      }
    }

    sections.push(
      new Paragraph({
        style: 'sectionTitle',
        children: [
          new TextRun('Skills & Interests')
        ]
      })
    )

    const interests = []
    for (let i = 1; i <= 6; i++) {
      if (formData[`interest${i}`]) {
        interests.push(formData[`interest${i}`])
      }
    }

    if (interests.length) {
      interests.forEach(item => {
        sections.push(createBulletPoint(item))
      })
    }

    doc.addSection({
      properties: {},
      children: sections
    })

    Packer.toBuffer(doc).then(buffer => {
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
      res.setHeader('Content-Disposition', 'attachment; filename=resume.docx')
      res.send(buffer)
    }).catch(error => {
      console.error('Word document packing error:', error)
      res.status(500).send('Failed to pack Word document')
    })
  } catch (error) {
    console.error('Word document generation error:', error)
    res.status(500).send('Failed to generate Word document')
  }
})

export default router
