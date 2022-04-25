import mongoose from 'mongoose'

const bookingSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    theatreId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Theatre',
    },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    theatreName: { type: String, required: true },
    movieName: { type: String, required: true },
    date: { type: String, required: true },
    showTime: { type: String, required: true },
    seatCount: { type: Number, required: true },
    seats: {
      type: [String],
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
  },
  { timestamps: true }
)

const Booking = mongoose.model('Booking', bookingSchema)

export default Booking
