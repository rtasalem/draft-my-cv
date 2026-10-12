import {
  ExternalHyperlink,
  Paragraph,
  Tab,
  TabStopType,
  TextRun
} from 'docx'
import { linkColour, textWidth } from './styles.js'

export const createBlankLine = () => new Paragraph({})

export const createSectionTitle = (title) => new Paragraph({
  style: 'sectionTitle',
  children: [new TextRun(title)]
})

export const createTwoColumnParagraph = (left, right, bold = false) => {
  const children = [new TextRun({ text: left, bold })]
  if (right) children.push(new TextRun({ children: [new Tab(), right] }))

  return new Paragraph({
    style: 'entry',
    tabStops: [{ type: TabStopType.RIGHT, position: textWidth }],
    children
  })
}

export const createText = (text) => new Paragraph({
  style: 'entry',
  children: [new TextRun(text)]
})

export const createLink = (text, url) => new Paragraph({
  style: 'entry',
  children: [
    new ExternalHyperlink({
      link: url,
      children: [new TextRun({ text, color: linkColour, underline: {} })]
    })
  ]
})

export const createBullet = (text) => new Paragraph({
  numbering: { reference: 'bullet', level: 0 },
  children: [new TextRun(text)]
})

export const createLabelledLine = (label, text) => new Paragraph({
  style: 'entry',
  children: [
    new TextRun({ text: `${label}: `, bold: true }),
    new TextRun(text)
  ]
})

export const createSection = (section) => {
  if (!section) return []

  const paragraphs = [createSectionTitle(section.title)]

  section.entries.forEach(entry => {
    entry.lines.forEach(line => {
      if (line.type === 'row') paragraphs.push(createTwoColumnParagraph(line.left, line.right, line.bold))
      if (line.type === 'text') paragraphs.push(createText(line.text))
      if (line.type === 'link') paragraphs.push(createLink(line.text, line.url))
      if (line.type === 'labelled') paragraphs.push(createLabelledLine(line.label, line.text))
    })
    entry.bullets?.forEach(bullet => paragraphs.push(createBullet(bullet)))
    paragraphs.push(createBlankLine())
  })

  return paragraphs
}
