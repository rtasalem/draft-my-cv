import express from 'express'

const healthzRouter = express.Router()

healthzRouter.get('/healthz', (req, res) => {
  res.status(200).send('draft-my-cv is ok')
})

export default healthzRouter
