import {
  Document,
  Packer
} from 'docx'
import { styles } from '../word/styles.js'
import { createHeader } from '../word/sections/header.js'
import { createEducation } from '../word/sections/education.js'
import { createExperience } from '../word/sections/experience.js'
import { createProjects } from '../word/sections/projects.js'
import { createInterests } from '../word/sections/interests.js'

export const generateWordDoc = async (formData, res) => {
  if (!formData) {
    return res.status(400).send('No data available to generate CV/resume as a Word document')
  }

  try {
    const header = createHeader(formData)
    const education = createEducation(formData)
    const experience = createExperience(formData)
    const projects = createProjects(formData)
    const interests = createInterests(formData)

    const sections = [
      ...header,
      ...education,
      ...experience,
      ...projects,
      ...interests
    ]

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: sections
        }
      ],
      styles
    })

    Packer.toBuffer(doc).then(buffer => {
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
      res.setHeader('Content-Disposition', 'attachment; filename=resume.docx')
      res.end(buffer)
    }).catch(error => {
      console.error('Word document packing error:', error)
      res.status(500).send('Failed to pack Word document')
    })
  } catch (error) {
    console.error('Word document generation error:', error)
    res.status(500).send('Failed to generate Word document')
  }
}
