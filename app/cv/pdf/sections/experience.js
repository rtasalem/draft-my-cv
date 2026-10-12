import { addSection } from '../utils.js'
import { buildExperience } from '../../content.js'

export const createExperience = (doc, formData) => {
  addSection(doc, buildExperience(formData))
}
