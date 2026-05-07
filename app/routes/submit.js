import express from 'express'
import { submitController } from '../controllers/submit.js'
import { downloadFormController } from '../controllers/download.js'

const router = express.Router()

router.get('/', submitController)
router.post('/', downloadFormController)

export default router
