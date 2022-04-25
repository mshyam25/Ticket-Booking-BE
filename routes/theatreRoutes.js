import express from 'express'
import {
  addNewTheatre,
  getAllTheatres,
  getTheatreById,
} from '../controller-functions/theatreController.js'
import { auth, adminAuth } from '../middleware/auth.js'
const router = express.Router()
// /theatres

router.route('/list').get(getAllTheatres)
router.route('/:id').get(auth, getTheatreById)
router.route('/addtheatre').post(auth, adminAuth, addNewTheatre)

export const theatreRouter = router
