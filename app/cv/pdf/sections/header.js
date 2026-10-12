import { fonts, fontSize, rule } from '../styles.js'
import { addBlankLine } from '../utils.js'
import { buildHeader } from '../../content.js'

export const createHeader = (doc, formData) => {
  const { name, contact } = buildHeader(formData)
  const left = doc.page.margins.left
  const right = doc.page.width - doc.page.margins.right
  const width = right - left

  doc.font(fonts.bold).fontSize(fontSize).text(name, left, doc.y, { width, align: 'center' })

  const ruleY = doc.y + rule.gapBefore
  doc.lineWidth(rule.width).moveTo(left, ruleY).lineTo(right, ruleY).stroke()

  doc.font(fonts.regular).text(contact, left, ruleY + rule.gapAfter, { width, align: 'center' })
  addBlankLine(doc)
}
