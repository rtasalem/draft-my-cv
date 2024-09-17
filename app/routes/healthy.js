import express from 'express'

const healthyRouter = express.Router()

healthyRouter.get('/healthy', (req, res) => {
  res.status(200).send('draft-my-cv is ok')
})

export default healthyRouter
