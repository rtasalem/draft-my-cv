import express from 'express'
import nunjucks from 'nunjucks'
import path from 'path'
import { staticDirs } from './constants/index.js'
import {
  healthy,
  healthz,
  about,
  submit,
  download
} from './routes/index.js'

const server = async () => {
  const app = express()
  const port = 3000

  nunjucks.configure('app/views', {
    autoescape: true,
    express: app
  })

  app.set('view engine', 'njk')

  const __dirname = path.dirname(new URL(import.meta.url).pathname)

  staticDirs.forEach(({ route, dir }) => {
    app.use(route, express.static(path.join(__dirname, dir)))
  })

  app.use(healthy)
  app.use(healthz)
  app.use(about)
  app.use(submit)
  app.use(download)

  app.listen(port, () => {
    console.log(`Application listening on http://localhost:${port}`)
  })
}

export { server }
