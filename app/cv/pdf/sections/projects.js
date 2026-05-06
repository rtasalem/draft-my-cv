import { fonts, fontSizes, spacing } from '../styles.js'
import { addSectionTitle, addBulletPoint } from '../utils.js'

export const createProjects = (doc, formData) => {
  if (!formData.projectTitle1 && !formData.projectTitle2 && !formData.projectTitle3) return

  addSectionTitle(doc, 'Projects')

  for (let i = 1; i <= 3; i++) {
    const title = formData[`projectTitle${i}`]
    const url = formData[`projectUrl${i}`]
    const summary = formData[`projectSummary${i}`]

    if (title) {
      doc.fontSize(fontSizes.body).font(fonts.bold).text(title, { continued: true })

      if (url) {
        doc.fontSize(fontSizes.body).font(fonts.roman).text(` (${url})`, { link: url, underline: true, continued: false })
      } else {
        doc.text('', { continued: false })
      }

      if (summary) {
        const lines = summary.split('\n').filter(line => line.trim())
        lines.forEach(line => addBulletPoint(doc, line))
        doc.moveDown(spacing.bulletAfter)
      }
    }
  }
}
