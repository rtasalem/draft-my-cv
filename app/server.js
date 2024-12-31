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

  app.use(healthy)
  app.use(healthz)
  app.use(submit)
  app.use(download)

  app.listen(port, () => {
    console.log(`Application listening on http://localhost:${port}`)
  })
}

export { server }
