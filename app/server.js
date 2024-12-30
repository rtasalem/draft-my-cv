import express from 'express'
import {
  healthy,
  healthz,
  submit,
  download
} from './routes/index.js'

const server = async () => {
  const app = express()
  const port = 3000

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  app.use(healthy)
  app.use(healthz)
  app.use(submit)
  app.use(download)

  app.listen(port, () => {
    console.log(`Application listening on port ${port}`)
  })
}

export { server }
