import express from 'express'
import nunjucks from 'nunjucks'
import {
  healthy,
  healthz,
  home,
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

  app.use(healthy)
  app.use(healthz)
  app.use(home)
  app.use(submit)
  app.use(download)

  app.listen(port, () => {
    console.log(`Application listening on http://localhost:${port}`)
  })
}

export { server }
