import express from 'express'
import { disclaimerController } from '../controllers/disclaimer.js'

const router = express.Router()

router.get('/', disclaimerController)

export default router
