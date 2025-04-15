import * as docx from 'docx'

export const generateWordDoc = async (res, formData) => {
  try {
    if (!formData) {
      return res.status(400).send('No data available to generate Word document')
    }

    const doc = new docx.Document({
      creator: 'Draft My CV',
      title: 'CV',
      sections: [
        {
          children: [
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: 'User Information',
                  bold: true,
                  size: 28
                })
              ]
            }),
            ...Object.entries(formData).map(([key, value]) =>
              new docx.Paragraph({
                text: `${key}: ${value}`
              }))
          ]
        }
      ]
    })

    const buffer = await docx.Packger.toBuffer(doc)

    res.setHeader(
      'Content-Disposition',
      'attachment; filename="draft_my_cv.docx"'
    )

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )

    res.send(buffer)
  } catch (error) {
    console.error(`Error processing Word doc: ${error.message}`)
    res.status(500).send('Error generating Word document')
  }
}
