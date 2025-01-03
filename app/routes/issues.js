import express from 'express'
const router = express.Router()

router.get('/issues', (req, res) => {
  res.render('issues')
})

export default router
