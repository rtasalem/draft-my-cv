import { addSectionTitle, addBulletPoint } from '../utils.js'

export const createInterests = (doc, formData) => {
  addSectionTitle(doc, 'Skills & Interests')

  const interests = []
  for (let i = 1; i <= 6; i++) {
    if (formData[`interest${i}`]) {
      interests.push(formData[`interest${i}`])
    }
  }

  if (interests.length) {
    interests.forEach(item => addBulletPoint(doc, item))
  }
}
