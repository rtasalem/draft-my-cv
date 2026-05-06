import express from 'express'
import { submitController, downloadFormController } from '../controllers/submit.js'

const router = express.Router()

router.get('/', submitController)
router.post('/', downloadFormController)

export default router
