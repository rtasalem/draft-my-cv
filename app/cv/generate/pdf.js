// router.get('/generate-word', (req, res) => {
//   if (!formData) {
//     return res.status(400).send('No data available to generate the Word document')
//   }

//   try {
//     const doc = new Document({
//       sections: [],
//       styles: {
//         paragraphStyles: [
//           {
//             id: 'sectionTitle',
//             name: 'Section Title',
//             basedOn: 'Normal',
//             next: 'Normal',
//             run: {
//               size: 28,
//               bold: true,
//               font: 'Calibri'
//             },
//             paragraph: {
//               alignment: AlignmentType.CENTER,
//               spacing: {
//                 before: 240,
//                 after: 120
//               }
//             }
//           },
//           {
//             id: 'header',
//             name: 'Header Name',
//             basedOn: 'Normal',
//             next: 'Normal',
//             run: {
//               size: 36,
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
//               size: 22,
//               font: 'Times New Roman'
//             },
//             paragraph: {
//               alignment: AlignmentType.CENTER,
//               spacing: {
//                 after: 200
//               }
//             }
//           },
//           {
//             id: 'entryTitle',
//             name: 'Entry Title',
//             basedOn: 'Normal',
//             next: 'Normal',
//             run: {
//               size: 22,
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
//               size: 22,
//               font: 'Calibri'
//             }
//           }
//         ]
//       }
//     })

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

//     const fullName = `${formData.firstName} ${formData.lastName}`
//     const sections = [
//       new Paragraph({
//         style: 'header',
//         children: [
//           new TextRun(fullName)
//         ]
//       }),

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
//           before: 120,
//           after: 120
//         }
//       }),

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

//     sections.push(
//       new Paragraph({
//         style: 'sectionTitle',
//         children: [
//           new TextRun('Education')
//         ]
//       })
//     )

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

//       sections.push(
//         new Paragraph({
//           spacing: {
//             after: 120
//           }
//         })
//       )
//     }

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

//       sections.push(
//         new Paragraph({
//           spacing: {
//             after: 120
//           }
//         })
//       )
//     }

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
//             after: 120
//           }
//         })
//       )
//     }

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
//             after: 120
//           }
//         })
//       )
//     }

//     sections.push(
//       new Paragraph({
//         style: 'sectionTitle',
//         children: [
//           new TextRun('Experience')
//         ]
//       })
//     )

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

//         // Add spacKing
//         sections.push(
//           new Paragraph({
//             spacing: {
//               after: 120
//             }
//           })
//         )
//       }
//     }

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

//           sections.push(
//             new Paragraph({
//               spacing: {
//                 after: 120
//               }
//             })
//           )
//         }
//       }
//     }

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

//     doc.addSection({
//       properties: {},
//       children: sections
//     })

//     Packer.toBuffer(doc).then(buffer => {
//       res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
//       res.setHeader('Content-Disposition', 'attachment; filename=resume.docx')
//       res.send(buffer)
//     }).catch(error => {
//       console.error('Word document packing error:', error)
//       res.status(500).send('Failed to pack Word document')
//     })
//   } catch (error) {
//     console.error('Word document generation error:', error)
//     res.status(500).send('Failed to generate Word document')
//   }
// })
