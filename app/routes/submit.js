import express from 'express'
const router = express.Router()

router.get('/', (req, res) => {
  res.send('submit your details here')
})

export default router