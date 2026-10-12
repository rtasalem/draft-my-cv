import { createSection } from '../utils.js'
import { buildEducation } from '../../content.js'

export const createEducation = (formData) => createSection(buildEducation(formData))
