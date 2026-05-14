import { setFormData } from '../state/form-data.js'

export function downloadController (req, res) {
  res.render('download')
}

export function downloadFormController (req, res) {
  setFormData(req.body)
  console.log('user has successfully submitted form data')
  res.redirect('/download')
}
