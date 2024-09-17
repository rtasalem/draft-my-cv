import { app, port } from './server.js'

app.listen(port, () => {
  console.log(`Server running on https://localhost:${port}`)
})