import {
  Paragraph,
  TextRun
} from 'docx'
import { createBulletPoint } from '../utils.js'

export const createInterests = (formData) => {
  const interests = []
  const sections = []

  sections.push(
    new Paragraph({
      style: 'sectionTitle',
      children: [
        new TextRun('Interests')
      ]
    })
  )

  for (let i = 1; i <= 6; i++) {
    if (formData[`interest${i}`]) {
      interests.push(formData[`interest${i}`])
    }
  }

  if (interests.length) {
    interests.forEach(item => {
      sections.push(createBulletPoint(item))
    })
  }
}
