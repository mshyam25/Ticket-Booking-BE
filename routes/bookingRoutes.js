import {
  bookingsOfTheatre,
  bookingsOfUser,
  newBooking,
} from '../controller-functions/bookingController.js'

import { auth, adminAuth } from '../middleware/auth.js'
import express from 'express'
const router = express.Router()

// /bookings

router.route('/').post(auth, newBooking)
router.route('/theatrebookings/:id').get(auth, adminAuth, bookingsOfTheatre)
router.route('/userbookings/:id').get(auth, bookingsOfUser)

export const bookingRouter = router
