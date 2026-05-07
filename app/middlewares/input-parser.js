import bodyParser from 'body-parser'

export const inputParser = (app) => {
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
}
