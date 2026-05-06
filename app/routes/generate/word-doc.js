import express from 'express'
import { generateWordDocController } from '../../controllers/generate/word-doc.js'

const router = express.Router()

router.get('/', generateWordDocController)

export default router
