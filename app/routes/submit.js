import express from 'express'
const router = express.Router()

router.get('/submit', (req, res) => {
  res.render('submit')
})

export default router