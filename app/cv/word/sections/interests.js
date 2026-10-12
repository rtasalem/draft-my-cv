import { createSection } from '../utils.js'
import { buildSkillsAndInterests } from '../../content.js'

export const createInterests = (formData) => createSection(buildSkillsAndInterests(formData))
