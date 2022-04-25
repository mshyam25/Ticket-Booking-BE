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

    theatre.seatAvailability.map((showDate) => {
      if (showDate.date === date) {
        showDate.shows.map((show) => {
          if (show.showTiming === time) {
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

// Description : Clearing the reserved seats
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

      theatre.seatAvailability.map((showDate) => {
        if (showDate.date === date) {
          showDate.shows.map((show) => {
            if (show.showTiming === time) {
              show.seats.map((seatRow) => {
                seatRow.map((seat) => {
                  if (seatId.includes(seat._id.toString())) {
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
      }
    }
  }
  setTimeout(reservedSeatsClearance, 30000)
})

// Description : Marking the confirmed seats as reserved
// Route :  POST /seats/confirmation
// Access : Public

const bookSeats = expressAsyncHandler(async (request, response) => {
  const { theatreId, date, time, seatId } = request.body

  const theatre = await Theatre.findById(theatreId)
  if (!theatre) {
    throw new Error('Theatre not found')
  } else {
    let count = 0
    console.log('Theatre match found :', theatre.theatreName)
    theatre.seatAvailability.map((showDate) => {
      if (showDate.date === date) {
        showDate.shows.map((show) => {
          if (show.showTiming === time) {
            show.seats.map((seatRow) => {
              seatRow.map((seat) => {
                if (seatId.includes(seat._id.toString())) {
                  seat.isReserved = false
                  seat.isBooked = true
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
      throw new Error('Error in seat controller')
    }
  }
})

export { confirmSeats, clearReservedSeats, bookSeats }
