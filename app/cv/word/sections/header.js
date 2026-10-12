import { Paragraph, TextRun } from 'docx'
import { nameRule } from '../styles.js'
import { createBlankLine } from '../utils.js'
import { buildHeader } from '../../content.js'

export const createHeader = (formData) => {
  const { name, contact } = buildHeader(formData)

  return [
    new Paragraph({
      style: 'name',
      border: { bottom: nameRule },
      children: [new TextRun(name)]
    }),
    new Paragraph({
      style: 'contact',
      children: [new TextRun(contact)]
    }),
    createBlankLine()
  ]
}
