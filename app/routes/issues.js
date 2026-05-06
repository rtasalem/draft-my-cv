import express from 'express'
import { issuesController } from '../controllers/issues.js'

const router = express.Router()

router.get('/', issuesController)

export default router
