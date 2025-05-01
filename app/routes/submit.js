import express from 'express'
// import nunjucks from 'nunjucks'
import PDFDocument from 'pdfkit'
// import htmlToDocx from 'html-to-docx'
import {
  Document, Paragraph, TextRun,
  BorderStyle, AlignmentType, Packer
} from 'docx'
// import { Buffer } from 'buffer'
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

// GET: Generate and stream Word version of CV
// router.get('/generate-word', (req, res) => {
//   if (!formData) {
//     return res.status(400).send('No data available to generate the Word document')
//   }

//   try {
//     // Create a new document
//     const doc = new Document({
//       styles: {
//         paragraphStyles: [
//           {
//             id: 'sectionTitle',
//             name: 'Section Title',
//             basedOn: 'Normal',
//             next: 'Normal',
//             run: {
//               size: 28, // 14pt
//               bold: true,
//               font: 'Calibri'
//             },
//             paragraph: {
//               alignment: AlignmentType.CENTER,
//               spacing: {
//                 before: 240, // 12pt
//                 after: 120 // 6pt
//               }
//             }
//           },
//           {
//             id: 'header',
//             name: 'Header Name',
//             basedOn: 'Normal',
//             next: 'Normal',
//             run: {
//               size: 36, // 18pt
//               bold: true,
//               font: 'Times New Roman'
//             },
//             paragraph: {
//               alignment: AlignmentType.CENTER
//             }
//           },
//           {
//             id: 'contactInfo',
//             name: 'Contact Info',
//             basedOn: 'Normal',
//             next: 'Normal',
//             run: {
//               size: 22, // 11pt
//               font: 'Times New Roman'
//             },
//             paragraph: {
//               alignment: AlignmentType.CENTER,
//               spacing: {
//                 after: 200 // 10pt
//               }
//             }
//           },
//           {
//             id: 'entryTitle',
//             name: 'Entry Title',
//             basedOn: 'Normal',
//             next: 'Normal',
//             run: {
//               size: 22, // 11pt
//               bold: true,
//               font: 'Calibri'
//             }
//           },
//           {
//             id: 'entryText',
//             name: 'Entry Text',
//             basedOn: 'Normal',
//             next: 'Normal',
//             run: {
//               size: 22, // 11pt
//               font: 'Calibri'
//             }
//           }
//         ]
//       }
//     })

//     // Helper function to create bullet points
//     const createBulletPoint = (text) => {
//       return new Paragraph({
//         style: 'entryText',
//         bullet: {
//           level: 0
//         },
//         children: [
//           new TextRun(text)
//         ]
//       })
//     }

//     // Name header
//     const fullName = `${formData.firstName} ${formData.lastName}`
//     const sections = [
//       new Paragraph({
//         style: 'header',
//         children: [
//           new TextRun(fullName)
//         ]
//       }),

//       // Horizontal line
//       new Paragraph({
//         border: {
//           bottom: {
//             color: 'auto',
//             space: 1,
//             style: BorderStyle.SINGLE,
//             size: 6
//           }
//         },
//         spacing: {
//           before: 120, // 6pt
//           after: 120 // 6pt
//         }
//       }),

//       // Contact info
//       new Paragraph({
//         style: 'contactInfo',
//         children: [
//           new TextRun({
//             text: [
//               formData.city ? formData.city : '',
//               formData.country ? (formData.city ? `, ${formData.country}` : formData.country) : '',
//               formData.emailAddress ? ` • ${formData.emailAddress}` : '',
//               formData.phoneNumber ? ` • ${formData.callingCode || ''} ${formData.phoneNumber}` : ''
//             ].join('')
//           })
//         ]
//       })
//     ]

//     // Education Section
//     sections.push(
//       new Paragraph({
//         style: 'sectionTitle',
//         children: [
//           new TextRun('Education')
//         ]
//       })
//     )

//     // Undergraduate
//     if (formData.ugUniversity) {
//       sections.push(
//         new Paragraph({
//           style: 'entryTitle',
//           children: [
//             new TextRun(`${formData.ugUniversity} (${formData.ugLocation})`)
//           ]
//         }),
//         new Paragraph({
//           style: 'entryText',
//           children: [
//             new TextRun(`${formData.ugDegree} • Graduation: ${formData.ugGraduationYear}`)
//           ]
//         })
//       )

//       if (formData.ugDissertationTitle) {
//         sections.push(
//           new Paragraph({
//             style: 'entryText',
//             children: [
//               new TextRun(`Thesis: ${formData.ugDissertationTitle}`)
//             ]
//           })
//         )
//       }

//       if (formData.ugGrade) {
//         sections.push(
//           new Paragraph({
//             style: 'entryText',
//             children: [
//               new TextRun(`Grade: ${formData.ugGrade}`)
//             ]
//           })
//         )
//       }

//       // Add spacing
//       sections.push(
//         new Paragraph({
//           spacing: {
//             after: 120 // 6pt
//           }
//         })
//       )
//     }

//     // Postgraduate
//     if (formData.pgUniversity) {
//       sections.push(
//         new Paragraph({
//           style: 'entryTitle',
//           children: [
//             new TextRun(`${formData.pgUniversity} (${formData.pgCityOrState})`)
//           ]
//         }),
//         new Paragraph({
//           style: 'entryText',
//           children: [
//             new TextRun(`${formData.pgDegree} • Graduation: ${formData.pgGraduationYear}`)
//           ]
//         })
//       )

//       if (formData.pgDissertationTitle) {
//         sections.push(
//           new Paragraph({
//             style: 'entryText',
//             children: [
//               new TextRun(`Thesis: ${formData.pgDissertationTitle}`)
//             ]
//           })
//         )
//       }

//       if (formData.pgGrade) {
//         sections.push(
//           new Paragraph({
//             style: 'entryText',
//             children: [
//               new TextRun(`Grade: ${formData.pgGrade}`)
//             ]
//           })
//         )
//       }

//       // Add spacing
//       sections.push(
//         new Paragraph({
//           spacing: {
//             after: 120 // 6pt
//           }
//         })
//       )
//     }

//     // Exchange Program
//     if (formData.exchangeUniversity) {
//       sections.push(
//         new Paragraph({
//           style: 'entryTitle',
//           children: [
//             new TextRun(`Study Abroad: ${formData.exchangeUniversity} (${formData.exchangeCityOrState})`)
//           ]
//         }),
//         new Paragraph({
//           style: 'entryText',
//           children: [
//             new TextRun(`${formData.exchangeDegreeProgramme} • ${formData.exchangeYear}`)
//           ]
//         }),
//         new Paragraph({
//           spacing: {
//             after: 120 // 6pt
//           }
//         })
//       )
//     }

//     // High School
//     if (formData.highSchool) {
//       sections.push(
//         new Paragraph({
//           style: 'entryTitle',
//           children: [
//             new TextRun(`${formData.highSchool}`)
//           ]
//         }),
//         new Paragraph({
//           style: 'entryText',
//           children: [
//             new TextRun(`Graduation: ${formData.hsGraduationYear}`)
//           ]
//         }),
//         new Paragraph({
//           spacing: {
//             after: 120 // 6pt
//           }
//         })
//       )
//     }

//     // Experience Section
//     sections.push(
//       new Paragraph({
//         style: 'sectionTitle',
//         children: [
//           new TextRun('Experience')
//         ]
//       })
//     )

//     // Job Entries
//     for (let i = 1; i <= 3; i++) {
//       const jobTitle = formData[`jobTitle${i}`]
//       const jobCompany = formData[`jobCompany${i}`]
//       const jobStart = formData[`jobStart${i}`]
//       const jobEnd = formData[`jobEnd${i}`]
//       const jobSummary = formData[`jobSummary${i}`]

//       if (jobTitle && jobCompany) {
//         sections.push(
//           new Paragraph({
//             style: 'entryTitle',
//             children: [
//               new TextRun(`${jobCompany} (${jobStart} – ${jobEnd})`)
//             ]
//           }),
//           new Paragraph({
//             style: 'entryText',
//             children: [
//               new TextRun(jobTitle)
//             ]
//           })
//         )

//         if (jobSummary) {
//           const lines = jobSummary.split('\n').filter(line => line.trim())
//           lines.forEach(line => {
//             sections.push(createBulletPoint(line))
//           })
//         }

//         // Add spacing
//         sections.push(
//           new Paragraph({
//             spacing: {
//               after: 120 // 6pt
//             }
//           })
//         )
//       }
//     }

//     // Projects Section
//     let hasProjects = false
//     for (let i = 1; i <= 3; i++) {
//       if (formData[`projectTitle${i}`]) {
//         hasProjects = true
//         break
//       }
//     }

//     if (hasProjects) {
//       sections.push(
//         new Paragraph({
//           style: 'sectionTitle',
//           children: [
//             new TextRun('Projects')
//           ]
//         })
//       )

//       for (let i = 1; i <= 3; i++) {
//         const title = formData[`projectTitle${i}`]
//         const url = formData[`projectUrl${i}`]
//         const summary = formData[`projectSummary${i}`]

//         if (title) {
//           const titleParts = []
//           titleParts.push(
//             new TextRun({
//               text: title,
//               bold: true
//             })
//           )

//           if (url) {
//             titleParts.push(
//               new TextRun({
//                 text: ` (${url})`,
//                 style: 'hyperlink',
//                 underline: true
//               })
//             )
//           }

//           sections.push(
//             new Paragraph({
//               style: 'entryText',
//               children: titleParts
//             })
//           )

//           if (summary) {
//             const lines = summary.split('\n').filter(line => line.trim())
//             lines.forEach(line => {
//               sections.push(createBulletPoint(line))
//             })
//           }

//           // Add spacing
//           sections.push(
//             new Paragraph({
//               spacing: {
//                 after: 120 // 6pt
//               }
//             })
//           )
//         }
//       }
//     }

//     // Skills & Interests Section
//     sections.push(
//       new Paragraph({
//         style: 'sectionTitle',
//         children: [
//           new TextRun('Skills & Interests')
//         ]
//       })
//     )

//     const interests = []
//     for (let i = 1; i <= 6; i++) {
//       if (formData[`interest${i}`]) {
//         interests.push(formData[`interest${i}`])
//       }
//     }

//     if (interests.length) {
//       interests.forEach(item => {
//         sections.push(createBulletPoint(item))
//       })
//     }

//     // Add all sections to the document
//     doc.addSection({
//       properties: {},
//       children: sections
//     })

//     // Generate the document buffer
//     const buffer = doc.save()

//     // Send the document
//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
//     res.setHeader('Content-Disposition', 'attachment; filename=resume.docx')
//     res.send(buffer)
//   } catch (error) {
//     console.error('Word document generation error:', error)
//     res.status(500).send('Failed to generate Word document')
//   }
// })

router.get('/generate-word', (req, res) => {
  if (!formData) {
    return res.status(400).send('No data available to generate the Word document')
  }

  try {
    // Create a new document
    const doc = new Document({
      sections: [], // Initialize with an empty sections array
      styles: {
        paragraphStyles: [
          {
            id: 'sectionTitle',
            name: 'Section Title',
            basedOn: 'Normal',
            next: 'Normal',
            run: {
              size: 28, // 14pt
              bold: true,
              font: 'Calibri'
            },
            paragraph: {
              alignment: AlignmentType.CENTER,
              spacing: {
                before: 240, // 12pt
                after: 120 // 6pt
              }
            }
          },
          {
            id: 'header',
            name: 'Header Name',
            basedOn: 'Normal',
            next: 'Normal',
            run: {
              size: 36, // 18pt
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
              size: 22, // 11pt
              font: 'Times New Roman'
            },
            paragraph: {
              alignment: AlignmentType.CENTER,
              spacing: {
                after: 200 // 10pt
              }
            }
          },
          {
            id: 'entryTitle',
            name: 'Entry Title',
            basedOn: 'Normal',
            next: 'Normal',
            run: {
              size: 22, // 11pt
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
              size: 22, // 11pt
              font: 'Calibri'
            }
          }
        ]
      }
    })

    // Helper function to create bullet points
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

    // Name header
    const fullName = `${formData.firstName} ${formData.lastName}`
    const sections = [
      new Paragraph({
        style: 'header',
        children: [
          new TextRun(fullName)
        ]
      }),

      // Horizontal line
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
          before: 120, // 6pt
          after: 120 // 6pt
        }
      }),

      // Contact info
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

    // Education Section
    sections.push(
      new Paragraph({
        style: 'sectionTitle',
        children: [
          new TextRun('Education')
        ]
      })
    )

    // Undergraduate
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

      // Add spacing
      sections.push(
        new Paragraph({
          spacing: {
            after: 120 // 6pt
          }
        })
      )
    }

    // Postgraduate
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

      // Add spacing
      sections.push(
        new Paragraph({
          spacing: {
            after: 120 // 6pt
          }
        })
      )
    }

    // Exchange Program
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
            after: 120 // 6pt
          }
        })
      )
    }

    // High School
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
            after: 120 // 6pt
          }
        })
      )
    }

    // Experience Section
    sections.push(
      new Paragraph({
        style: 'sectionTitle',
        children: [
          new TextRun('Experience')
        ]
      })
    )

    // Job Entries
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

        // Add spacing
        sections.push(
          new Paragraph({
            spacing: {
              after: 120 // 6pt
            }
          })
        )
      }
    }

    // Projects Section
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

          // Add spacing
          sections.push(
            new Paragraph({
              spacing: {
                after: 120 // 6pt
              }
            })
          )
        }
      }
    }

    // Skills & Interests Section
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

    // Create document section and add all paragraphs to it
    doc.addSection({
      properties: {},
      children: sections
    })

    // Generate the document buffer
    Packer.toBuffer(doc).then(buffer => {
      // Send the document
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
