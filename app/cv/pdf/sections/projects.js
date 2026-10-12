import { addSection } from '../utils.js'
import { buildProjects } from '../../content.js'

export const createProjects = (doc, formData) => {
  addSection(doc, buildProjects(formData))
}
