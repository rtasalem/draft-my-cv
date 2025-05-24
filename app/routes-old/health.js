import express from 'express'
const router = express.Router()

router.get('/healthy', (req, res) => {
  res.send('draft-my-cv is ok')
})

router.get('/healthz', (req, res) => {
  res.send('draft-my-cv is ok')
})

export default router
