import express from 'express'
import pdf from './pdf.js'
import wordDoc from './word-doc.js'

const router = express.Router()

router.use('/pdf', pdf)
router.use('/word-doc', wordDoc)

export default router
