import express from 'express'
import { countriesController } from '../controllers/countries.js'

const router = express.Router()

router.get('/', countriesController)

export default router
