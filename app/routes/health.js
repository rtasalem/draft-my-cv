import express from 'express'
import { healthController } from '../controllers/health.js'

const router = express.Router()

router.get('/', healthController)

export default router
