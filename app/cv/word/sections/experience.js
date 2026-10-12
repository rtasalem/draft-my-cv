import { createSection } from '../utils.js'
import { buildExperience } from '../../content.js'

export const createExperience = (formData) => createSection(buildExperience(formData))
