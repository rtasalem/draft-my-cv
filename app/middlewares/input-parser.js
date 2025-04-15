import bodyParser from 'body-parser'

const inputParser = (app) => {
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
}

export default inputParser
