import { addSection } from '../utils.js'
import { buildSkillsAndInterests } from '../../content.js'

export const createInterests = (doc, formData) => {
  addSection(doc, buildSkillsAndInterests(formData))
}
