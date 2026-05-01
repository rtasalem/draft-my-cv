import { fonts, fontSizes, spacing, layout } from '../styles.js'

export const createHeader = (doc, formData) => {
  doc
    .fontSize(fontSizes.header)
    .font(fonts.bold)
    .text(`${formData.firstName} ${formData.lastName}`, { align: 'center' })

  doc.moveDown(spacing.headerAfter)
  doc.moveTo(doc.x, doc.y).lineTo(layout.lineEnd, doc.y).stroke()
  doc.moveDown(spacing.headerAfter)

  const city = formData.city || ''
  const country = formData.country || ''
  const location = city + (country ? `, ${country}` : '')
  const contact = [
    location,
    formData.emailAddress,
    `${formData.callingCode || ''} ${formData.phoneNumber}`
  ].filter(Boolean).join(' • ')

  doc
    .fontSize(fontSizes.body)
    .font(fonts.roman)
    .text(contact, { align: 'center' })

  doc.moveDown(spacing.contactAfter)
}
