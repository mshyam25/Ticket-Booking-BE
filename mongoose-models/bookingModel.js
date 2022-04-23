import mongoose from 'mongoose'

const bookingSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    userName: {
      type: String,
      required: true,
    },
    bookingDetails: [
      {
        theatre: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Theatre',
        },
        date: { type: String, required: true },
        showTime: { type: String, required: true },

        qty: { type: Number, required: true },
      },
    ],

    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
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

export default Order
