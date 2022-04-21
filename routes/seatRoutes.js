import express from 'express'
import {
  clearReservedSeats,
  confirmSeats,
} from '../controller-functions/seatController.js'

const router = express.Router()

export const seatRouter = router
// /seats
router.route('/confirmation').post(confirmSeats)

router.route('/clearingreserved').post(clearReservedSeats)
