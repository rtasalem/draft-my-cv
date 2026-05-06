import { generateWordDoc } from '../../cv/generate/word.js'
import { getFormData } from '../../state/form-data.js'

export async function generateWordDocController (req, res) {
  await generateWordDoc(getFormData(), res)
}
