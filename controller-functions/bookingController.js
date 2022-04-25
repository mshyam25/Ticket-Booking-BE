import Booking from '../mongoose-models/bookingModel.js'
import { sendBookingDetails } from '../verifyMail.js'
import User from '../mongoose-models/userModel.js'
import Theatre from '../mongoose-models/theatreModel.js'
import expressAsyncHandler from 'express-async-handler'
import { request } from 'express'

// Description : Creating a new Booking After Payment
// Route :  POST /booking
// Access : Private Auth

const newBooking = expressAsyncHandler(async (request, response) => {
  const { userId, theatreId, date, showTime, seatCount, seats, totalPrice } =
    request.body
  const user = await User.findById(userId)
  const theatre = await Theatre.findById(theatreId)
  if (user && theatre) {
    const booking = await Booking.create({
      userId,
      theatreId,
      userName: user.name,
      userEmail: user.email,
      theatreName: theatre.theatreName,
      movieName: theatre.currentMovie.movieName,
      date,
      showTime,
      seatCount,
      seats,
      totalPrice,
    })
    if (booking) {
      sendBookingDetails(booking, user)
      response.status(201)
      response.send('Success')
    } else {
      response.status(400)
      throw new Error(
        'Your Booking Cannot be Completed.Refund will be initiated in few hours.Sorry for the inconvinience.'
      )
    }
  } else {
    throw new Error('Error in booking controller')
  }
})

// Description : Creating a new Booking After Payment
// Route :  GET /booking/:theatreId
// Access : Private Auth Admin

const bookingsOfTheatre = expressAsyncHandler(async (req, res) => {
  const bookings = await Booking.find({ theatreId: req.params.id })
  if (bookings.length > 0) {
    res.status(200)
    res.send(bookings)
  } else {
    throw new Error('No Bookings made for this theatre.')
  }
})

// Description : Creating a new Booking After Payment
// Route :  GET /booking/:userId
// Access : Private Auth

const bookingsOfUser = expressAsyncHandler(async (req, res) => {
  const bookings = await Booking.find({ userId: req.params.id })
  if (bookings.length > 0) {
    res.status(200)
    res.send(bookings)
  } else {
    throw new Error('No Bookings yet !')
  }
})

export { newBooking, bookingsOfTheatre, bookingsOfUser }
