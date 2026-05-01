import { fonts, fontSizes, spacing, bullet } from './styles.js'

export const addSectionTitle = (doc, title) => {
  doc
    .moveDown(spacing.sectionBefore)
    .fontSize(fontSizes.sectionTitle)
    .font(fonts.bold)
    .text(title, { align: 'center' })
    .moveDown(spacing.sectionAfter)
}

export const addEntry = (doc, lines = []) => {
  lines.forEach(line => {
    if (line) doc.fontSize(fontSizes.body).font(fonts.roman).text(line)
  })
  doc.moveDown(spacing.entryAfter)
}

export const addBulletPoint = (doc, text) => {
  doc
    .circle(doc.x + bullet.xOffset, doc.y + bullet.yOffset, bullet.radius)
    .fill()
    .text(`  ${text}`, { continued: false })
    .fillColor('black')
}
