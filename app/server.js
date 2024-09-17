import express from 'express'
import healthyRouter from './routes/healthy.js'
import healthzRouter from './routes/healthz.js'

const app = express()
const port = 3000

app.use(healthyRouter)
app.use(healthzRouter)

export { app, port }