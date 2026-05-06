import { generatePdf } from '../../cv/generate/pdf.js'
import { getFormData } from '../../state/form-data.js'

export function generatePdfController (req, res) {
  generatePdf(getFormData(), res)
}
