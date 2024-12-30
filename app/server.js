import express from 'express'

const server = async () => {
  const app = express()
  const port = 3000
  
  app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Application listening on port ${port}`)
  })
}

export { server }
