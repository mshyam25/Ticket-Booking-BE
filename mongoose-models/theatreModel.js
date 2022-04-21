import mongoose from 'mongoose'
import { seatsData } from '../data/seatData.js'
import Moment from 'moment'
const theatreSchema = mongoose.Schema({
  theatreName: {
    type: String,
    required: true,
  },
  currentMovie: {
    movieName: {
      type: String,
      required: true,
    },
    cast: {
      type: String,
      required: true,
    },
    poster: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    runtime: {
      type: String,
      required: true,
    },
    rating: {
      type: String,
      required: true,
    },
  },
  theatreArea: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  lastDate: {
    type: Date,
    required: true,
  },
  runningDays: {
    type: Number,
    required: true,
  },
  ticketPrice: {
    type: Number,
    required: true,
  },
  showTimings: {
    type: [String],
    required: true,
  },
  seatAvailability: [
    {
      date: {
        type: String,
      },
      shows: [
        {
          showTiming: {
            type: String,
          },
          seats: {
            type: [
              [
                {
                  name: {
                    type: String,
                  },
                  isBooked: {
                    type: Boolean,
                    default: false,
                  },
                  isReserved: {
                    type: Boolean,
                    default: false,
                  },
                },
              ],
            ],
            default: seatsData,
          },
        },
      ],
    },
  ],
})

// theatreSchema.pre('save', async function (next) {
//   const startDate = this.releaseDate
//   const days = this.runningDays
//   const showTimings = this.showTimings
//   const seatAvailability = []

//   for (let i = -1; i < days - 1; i++) {
//     const shows = []
//     for (let j = 0; j < showTimings.length; j++) {
//       const showTiming = showTimings[j]
//       const show = { showTiming }
//       shows.push(show)
//     }
//     const date = new Date(startDate)
//     date.setDate(startDate.getDate() + i)
//     const formatedDate = Moment(date).format('YYYY-MM-DD')
//     const seatsAvailable = { date: formatedDate, shows }
//     seatAvailability.push(seatsAvailable)
//   }
//   this.seatAvailability = seatAvailability
//   next()
// })

theatreSchema.pre('insertMany', async function (next, theatres) {
  theatres.map((t) => {
    const startDate = t.releaseDate
    const days = t.runningDays
    const showTimings = t.showTimings
    const seatAvailability = []

    for (let i = -1; i < days - 1; i++) {
      const shows = []
      for (let j = 0; j < showTimings.length; j++) {
        const showTiming = showTimings[j]
        const show = { showTiming }
        shows.push(show)
      }
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      const formatedDate = Moment(date).format('YYYY-MM-DD')
      const seatsAvailable = { date: formatedDate, shows }
      seatAvailability.push(seatsAvailable)
    }
    t.seatAvailability = seatAvailability
    next()
  })
})

const Theatre = mongoose.model('Theatre', theatreSchema)
export default Theatre
