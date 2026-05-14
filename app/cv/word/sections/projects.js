import {
  Paragraph,
  TextRun
} from 'docx'
import { createBulletPoint } from '../utils.js'

export const createProjects = (formData) => {
  let hasProjects = false
  const sections = []

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
              text: `(${url})`,
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
          const lines = summary.split('/\r?\n/').filter(line => line.trim())

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

  return sections
}
