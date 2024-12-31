import express from 'express'
const router = express.Router()

router.get('/download', (req, res)=> {
  res.render('download')
})

export default router