import {
  Paragraph,
  TextRun,
  BorderStyle
} from 'docx'

export const createHeader = (formData) => {
  const fullName = `${formData.firstName} ${formData.lastName}`

  return [
    new Paragraph({
      style: 'header',
      children: [
        new TextRun(fullName)
      ]
    }),
    new Paragraph({
      border: {
        bottom: {
          colour: 'auto',
          space: 1,
          style: BorderStyle.SINGLE,
          size: 6
        }
      },
      spacing: {
        before: 120,
        after: 120
      }
    }),
    new Paragraph({
      style: 'contactInformation',
      children: [
        new TextRun(
          [
            formData.city || '',
            formData.country ? `, ${formData.country}` : '',
            formData.emailAddress ? ` • ${formData.emailAddress}` : '',
            formData.phoneNumber ? ` • ${formData.callingCode || ''} ${formData.phoneNumber}` : ''
          ].join('')
        )
      ]
    })
  ]
}
