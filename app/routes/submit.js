import express from 'express'
import {
  submitController,
  downloadFormController,
  downloadController,
  generatePdfController,
  generateWordDocController
} from '../controllers/submit.js'

const router = express.Router()

router.get('/', submitController)
router.post('/download', downloadFormController)
router.get('/download', downloadController)
router.get('/generate-pdf', generatePdfController)
router.get('/generate-word', generateWordDocController)

export default router
