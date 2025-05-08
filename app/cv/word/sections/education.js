import {
  Paragraph,
  TextRun
} from 'docx'

export const createEducation = (formData) => {
  const sections = []

  sections.push(
    new Paragraph({
      style: 'sectionTitle',
      children: [
        new TextRun('Education')
      ]
    })
  )

  if (formData.ugUniversity) {
    sections.push(
      new Paragraph({
        style: 'entryTitle',
        children: [
          new TextRun(`${formData.ugUniversity} ${formData.ugLocation}`)
        ]
      }),
      new Paragraph({
        style: 'entryText',
        children: [
          new TextRun(`${formData.ugDegree} • Graduation: ${formData.ugGraduationYear}`)
        ]
      })
    )

    if (formData.ugDissertationTitle) {
      sections.push(
        new Paragraph({
          style: 'entryText',
          children: [
            new TextRun(`Dissertation: ${formData.ugDissertationTitle}`)
          ]
        })
      )
    }

    if (formData.ugGrade) {
      sections.push(
        new Paragraph({
          style: 'entryText',
          children: [
            new TextRun(`Grade: ${formData.ugGrade}`)
          ]
        })
      )
    }

    sections.push(
      new Paragraph({
        spacing: {
          after: 120
        }
      })
    )
  }

  if (formData.pgUniversity) {
    sections.push(
      new Paragraph({
        style: 'entryTitle',
        children: [
          new TextRun(`${formData.pgUniversity} ${formData.pgLocation}`)
        ]
      }),
      new Paragraph({
        style: 'entryText',
        children: [
          new TextRun(`${formData.pgDegree} • Graduation: ${formData.pgGraduationYear}`)
        ]
      })
    )

    if (formData.pgDissertationTitle) {
      sections.push(
        new Paragraph({
          style: 'entryText',
          children: [
            new TextRun(`Dissertation: ${formData.pgDissertationTitle}`)
          ]
        })
      )
    }

    if (formData.pgGrade) {
      sections.push(
        new Paragraph({
          style: 'entryText',
          children: [
            new TextRun(`Grade: ${formData.pgGrade}`)
          ]
        })
      )
    }

    sections.push(
      new Paragraph({
        spacing: {
          after: 120
        }
      })
    )
  }

  if (formData.exchangeUniversity) {
    sections.push(
      new Paragraph({
        style: 'entryTitle',
        children: [
          new TextRun(`Study Abroad ${formData.exchangeUniversity} (${formData.exchangeCityOrState}, ${formData.exchangeCountry})`)
        ]
      }),
      new Paragraph({
        style: 'entryText',
        children: [
          new TextRun(`${formData.exchangeDegreeProgramme} • ${formData.exchangeYear}`)
        ]
      }),
      new Paragraph({
        spacing: {
          after: 120
        }
      })
    )
  }

  if (formData.highSchool) {
    sections.push(
      new Paragraph({
        style: 'entryTitle',
        children: [
          new TextRun(`${formData.highSchool}`)
        ]
      }),
      new Paragraph({
        style: 'entryText',
        children: [
          new TextRun(`Year completed: ${formData.hsGraduationYear}`)
        ]
      }),
      new Paragraph({
        spacing: {
          after: 120
        }
      })
    )
  }
}
