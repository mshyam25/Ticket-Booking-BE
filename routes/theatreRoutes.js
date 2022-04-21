import express from 'express'
import {
  addNewTheatre,
  getAllTheatres,
  getTheatreById,
} from '../controller-functions/theatreController.js'

const router = express.Router()
// /theatres

router.route('/list').get(getAllTheatres)
router.route('/:id').get(getTheatreById)
router.route('/addtheatre').post(addNewTheatre)

export const theatreRouter = router
