import {
  Document, 
  Paragraph, 
  TextRun,
  BorderStyle, 
  AlignmentType, 
  Packer
} from 'docx'

export const generateWordDoc = async (formData, res) => {
  if (!formData) {
    return res.status(400).send('No data available to generate CV/resume as a Word document')
  }

  try {
    const doc = new Document({
      sections: [],
      styles: {
        
      }
    })
  } catch (error) {

  }
}
