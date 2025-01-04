import express from 'express'
const router = express.Router()

router.get('/', (req, res) => {
  res.render('submit')
})

router.post('/download', (req, res) => {
  const formData = req.body
  console.log('User input:', formData)
  res.redirect('/download')
})

export default router
