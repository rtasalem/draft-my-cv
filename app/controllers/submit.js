import { setFormData } from '../state/form-data.js'

export function submitController (req, res) {
  res.render('submit')
}

export function downloadFormController (req, res) {
  setFormData(req.body)
  console.log('user successfully submitted formData')
  res.redirect('/download')
}
