import { createSection } from '../utils.js'
import { buildProjects } from '../../content.js'

export const createProjects = (formData) => createSection(buildProjects(formData))
