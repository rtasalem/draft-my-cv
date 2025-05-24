import express from 'express'
import { disclaimerController } from '../controllers/disclaimer.js'

const router = express.Router()

export default router.get('/disclaimer', disclaimerController)
