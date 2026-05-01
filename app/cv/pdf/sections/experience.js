import { fonts, fontSizes, spacing } from '../styles.js'
import { addSectionTitle, addBulletPoint } from '../utils.js'

export const createExperience = (doc, formData) => {
  addSectionTitle(doc, 'Experience')

  for (let i = 1; i <= 3; i++) {
    const jobTitle = formData[`jobTitle${i}`]
    const jobCompany = formData[`jobCompany${i}`]
    const jobStart = formData[`jobStart${i}`]
    const jobEnd = formData[`jobEnd${i}`]
    const jobSummary = formData[`jobSummary${i}`]

    if (jobTitle) {
      doc.fontSize(fontSizes.body).font(fonts.bold).text(`${jobCompany} (${jobStart} – ${jobEnd})`)
      doc.fontSize(fontSizes.body).font(fonts.roman).text(jobTitle)

      if (jobSummary) {
        const lines = jobSummary.split('\n').filter(line => line.trim())
        doc.moveDown(spacing.bulletBefore)
        lines.forEach(line => addBulletPoint(doc, line))
        doc.moveDown(spacing.bulletAfter)
      }
    }
  }
}
