import express from 'express'
import { issuesController } from '../controllers/issues.js'

const router = express.Router()

export default router.get('/issues', issuesController)
