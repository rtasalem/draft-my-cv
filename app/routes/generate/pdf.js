import express from 'express'
import { generatePdfController } from '../../controllers/generate/pdf.js'

const router = express.Router()

router.get('/', generatePdfController)

export default router
