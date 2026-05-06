import express from 'express'
import { healthController } from '../controllers/health.js'

const router = express.Router()

export default router.get('/health', healthController)
