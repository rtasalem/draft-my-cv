import express from 'express'
import { aboutController } from '../controllers/about.js'

const router = express.Router()

export default router.get('/about', aboutController)
