import Booking from '../mongoose-models/bookingModel.js'
import { sendBookingDetails } from '../verifyMail.js'
import User from '../mongoose-models/userModel.js'
import Theatre from '../mongoose-models/theatreModel.js'
import expressAsyncHandler from 'express-async-handler'

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

export { newBooking }
