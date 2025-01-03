import express from 'express'
const router = express.Router()

router.get('/disclaimer', (req, res) => {
  res.render('disclaimer')
})

export default router
