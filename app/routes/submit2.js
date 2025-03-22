import express from 'express'
const router = express.Router()

router.get('/submit2', (req, res) => {
  res.render('submit2')
})

export default router
