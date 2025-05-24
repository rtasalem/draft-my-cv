import express from 'express'
import nunjucks from 'nunjucks'
import path from 'path'
import { staticDirs } from './constants/static-dirs.js'
import { inputParser } from './middlewares/index.js'
import {
  aboutRoute,
  disclaimerRoute,
  issuesRoute
} from './routes/index.js'

const server = async () => {
  const app = express()
  const port = 3000

  nunjucks.configure('app/views', {
    autoescape: true,
    express: app
  })

  app.set('view engine', 'njk')

  inputParser(app)

  const __dirname = path.dirname(new URL(import.meta.url).pathname)

  staticDirs.forEach(({ route, dir }) => {
    app.use(route, express.static(path.join(__dirname, dir)))
  })

  app.use(aboutRoute)
  app.use(disclaimerRoute)
  app.use(issuesRoute)

  app.listen(port, () => {
    console.log(`Application listening on http://localhost:${port}`)
  })
}

export { server }
