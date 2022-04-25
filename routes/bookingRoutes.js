import { newBooking } from '../controller-functions/bookingController.js'

import { auth } from '../middleware/auth.js'
import express from 'express'
const router = express.Router()

// /bookings

router.route('/').post(auth, newBooking)

export const bookingRouter = router
