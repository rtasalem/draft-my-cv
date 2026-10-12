import { fonts, fontSize, indent, linkColour } from './styles.js'

const left = (doc) => doc.page.margins.left
const right = (doc) => doc.page.width - doc.page.margins.right

// Start a new page first so text drawn at a fixed y can't be split across pages.
const ensureLineFits = (doc) => {
  if (doc.y + doc.currentLineHeight(true) > doc.page.height - doc.page.margins.bottom) {
    doc.addPage()
  }
}

export const addBlankLine = (doc) => {
  doc.font(fonts.regular).fontSize(fontSize).moveDown(1)
}

export const addSectionTitle = (doc, title) => {
  ensureLineFits(doc)
  doc.font(fonts.bold).fontSize(fontSize)
    .text(title, left(doc), doc.y, { width: right(doc) - left(doc), align: 'center' })
}

export const addTwoColumnLine = (doc, leftText, rightText, leftFont = fonts.regular) => {
  ensureLineFits(doc)
  const x = left(doc) + indent.entry
  const y = doc.y
  const width = right(doc) - x
  doc.fontSize(fontSize)

  let rightWidth = 0
  let rightBottom = y
  if (rightText) {
    doc.font(fonts.regular).text(rightText, x, y, { width, align: 'right' })
    rightWidth = doc.widthOfString(rightText) + fontSize
    rightBottom = doc.y
  }

  doc.font(leftFont).text(leftText, x, y, { width: width - rightWidth })
  doc.y = Math.max(doc.y, rightBottom)
}

export const addText = (doc, text) => {
  ensureLineFits(doc)
  const x = left(doc) + indent.entry
  doc.font(fonts.regular).fontSize(fontSize).text(text, x, doc.y, { width: right(doc) - x })
}

export const addLink = (doc, text, url) => {
  ensureLineFits(doc)
  const x = left(doc) + indent.entry
  doc.font(fonts.regular).fontSize(fontSize).fillColor(linkColour)
    .text(text, x, doc.y, { width: right(doc) - x, link: url, underline: true })
    .fillColor('black')
}

export const addBullet = (doc, text) => {
  ensureLineFits(doc)
  const x = left(doc) + indent.bulletText
  const y = doc.y
  doc.font(fonts.regular).fontSize(fontSize)
    .text('•', left(doc) + indent.bullet, y, { lineBreak: false })
    .text(text, x, y, { width: right(doc) - x })
}

export const addLabelledLine = (doc, label, text) => {
  ensureLineFits(doc)
  const x = left(doc) + indent.entry
  doc.fontSize(fontSize)
    .font(fonts.bold).text(`${label}: `, x, doc.y, { width: right(doc) - x, continued: true })
    .font(fonts.regular).text(text)
}

export const addSection = (doc, section) => {
  if (!section) return

  addSectionTitle(doc, section.title)

  section.entries.forEach(entry => {
    entry.lines.forEach(line => {
      if (line.type === 'row') addTwoColumnLine(doc, line.left, line.right, line.bold ? fonts.bold : fonts.regular)
      if (line.type === 'text') addText(doc, line.text)
      if (line.type === 'link') addLink(doc, line.text, line.url)
      if (line.type === 'labelled') addLabelledLine(doc, line.label, line.text)
    })
    entry.bullets?.forEach(bullet => addBullet(doc, bullet))
    addBlankLine(doc)
  })
}
