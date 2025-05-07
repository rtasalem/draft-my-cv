import {
  Paragraph,
  TextRun
} from 'docx'

export const createBulletPoint = (text) => {
  return new Paragraph({
    style: 'entryText',
    bullet: {
      level: 0
    },
    children: [
      new TextRun(text)
    ]
  })
}
