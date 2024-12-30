import express from 'express'
const router = express.Router()

router.get('/download', (req, res)=> {
  res.send('download your cv/resume')
})

export default router