import {
  Paragraph,
  TextRun
} from 'docx'
import { createBulletPoint } from '../utils.js'

export const createExperience = (formData) => {
  const sections = []

  sections.push({
    style: 'sectionTitle',
    children: [
      new TextRun('Experience')
    ]
  })

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
            new TextRun(`${jobCompany} (${jobStart} - ${jobEnd})`)
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

      sections.push(
        new Paragraph({
          spacing: {
            after: 120
          }
        })
      )
    }
  }

  return sections
}
