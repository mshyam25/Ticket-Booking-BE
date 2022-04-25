import express from 'express'
import {
  bookSeats,
  clearReservedSeats,
  confirmSeats,
} from '../controller-functions/seatController.js'

const router = express.Router()

export const seatRouter = router
// /seats
router.route('/confirmation').post(confirmSeats)

router.route('/clearingreserved').post(clearReservedSeats)

router.route('/bookseats').post(bookSeats)
