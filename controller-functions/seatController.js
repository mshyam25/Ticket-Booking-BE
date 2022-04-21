import Theatre from '../mongoose-models/theatreModel.js'
import expressAsyncHandler from 'express-async-handler'

// Description : Marking the confirmed seats as reserved
// Route :  POST /seats/confirmation
// Access : Public

const confirmSeats = expressAsyncHandler(async (request, response) => {
  const { theatreId, date, time, seatId } = request.body

  const theatre = await Theatre.findById(theatreId)
  if (!theatre) {
    throw new Error('Invalid Theatre')
  } else {
    let count = 0
    console.log('Theatre match found :', theatre.theatreName)
    theatre.seatAvailability.map((showDate) => {
      if (showDate.date === date) {
        console.log('ShowDate matched', showDate.date)
        showDate.shows.map((show) => {
          if (show.showTiming === time) {
            console.log('Showtime matched', show.showTiming)
            console.log(seatId)
            show.seats.map((seatRow) => {
              seatRow.map((seat) => {
                if (seatId.includes(seat._id.toString())) {
                  console.log(seat.name)

                  seat.isReserved = true
                  count++
                }
              })
            })
          }
        })
      }
    })

    const updateTheatre = await theatre.save()
    if (count > 0) {
      response.status(200)
      response.json({
        message: 'Seats are Confirmed',
      })
    } else {
      throw new Error('Some error in marking the seats as confirmed')
    }
  }
})

// Description : CLearing the reserved seats
// Route :  POST /seats/clearingreserved
// Access : Public

const clearReservedSeats = expressAsyncHandler(async (request, response) => {
  const reservedSeatsClearance = async () => {
    const { theatreId, date, time, seatId } = request.body

    const theatre = await Theatre.findById(theatreId)
    if (!theatre) {
      throw new Error('Invalid Theatre')
    } else {
      let count = 0
      console.log('Theatre match found :', theatre.theatreName)
      theatre.seatAvailability.map((showDate) => {
        if (showDate.date === date) {
          console.log('ShowDate matched', showDate.date)
          showDate.shows.map((show) => {
            if (show.showTiming === time) {
              console.log('Showtime matched', show.showTiming)
              console.log(seatId)
              show.seats.map((seatRow) => {
                seatRow.map((seat) => {
                  if (seatId.includes(seat._id.toString())) {
                    console.log(seat.name)
                    if (!seat.isBooked) {
                      seat.isReserved = false
                      count++
                    }
                  }
                })
              })
            }
          })
        }
      })

      const updateTheatre = await theatre.save()
      if (count > 0) {
        response.status(200)
        response.json({
          message: 'Reserved Seats are Cleared',
        })
      } else {
        throw new Error('Some error in clearing the reserved seats')
      }
    }
  }
  setTimeout(reservedSeatsClearance, 30000)
})

export { confirmSeats, clearReservedSeats }
