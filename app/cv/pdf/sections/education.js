import { addSection } from '../utils.js'
import { buildEducation } from '../../content.js'

export const createEducation = (doc, formData) => {
  addSection(doc, buildEducation(formData))
}
