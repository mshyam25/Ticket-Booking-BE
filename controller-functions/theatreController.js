import Theatre from '../mongoose-models/theatreModel.js'
import expressAsyncHandler from 'express-async-handler'

// Description : Getting list of all theatres
// Route :  GET /theatres/list
// Access : Public

const getAllTheatres = expressAsyncHandler(async (request, response) => {
  const theatres = await Theatre.find({})
  if (theatres.length > 0) {
    response.status(200).send(theatres)
  } else {
    throw new Error('No theatre data exists')
  }
})
// Description : Get theatre by id
// Route :  GET /theatres/:id
// Access : Public now but should change to private

const getTheatreById = expressAsyncHandler(async (request, response) => {
  const theatre = await Theatre.findById(request.params.id)
  if (theatre) {
    response.status(200).send(theatre)
  } else {
    throw new Error('Theatre not Found or incorrect Theatre id')
  }
})

// Description : Add new Theatre
// Route :  POST /theatres/addtheatre
// Access : Private authAdmin

const addNewTheatre = expressAsyncHandler(async (request, response) => {
  const {
    theatreArea,
    theatreName,
    releaseDate,
    lastDate,
    movieName,
    poster,
    cast,
    director,
    language,
    runtime,
    rating,
    ticketPrice,
    runningDays,
    showTimings,
  } = request.body

  const theatre = await Theatre.findOne({ theatreName })
  if (theatre) {
    throw new Error('Theatre Already Exists')
  } else {
    const newTheatre = await Theatre.create({
      theatreName,
      theatreArea,
      runningDays,
      showTimings,
      ticketPrice,
      releaseDate: new Date(releaseDate),
      lastDate: new Date(lastDate),
      currentMovie: {
        movieName,
        poster,
        cast,
        director,
        language,
        runtime,
        rating,
      },
    })
    if (newTheatre) {
      response
        .status(200)
        .send('New Theatre Added. Please check your theatreslist')
    } else {
      throw new Error(
        'Theatre cannot be added due to 1 or more errors. Please check the theatre data you are trying to add.'
      )
    }
  }
})

// Description : Edit Theatre
// Route :  PUT /theatres/:theatreid
// Access : Private authAdmin

const editTheatre = expressAsyncHandler(async (request, response) => {
  const {
    theatreArea,
    theatreName,
    releaseDate,
    lastDate,
    movieName,
    poster,
    cast,
    director,
    language,
    runtime,
    rating,
    ticketPrice,
    runningDays,
    showTimings,
  } = request.body

  const theatre = await Theatre.findById(request.params.id)

  if (theatre) {
    theatre.theatreName = theatreName || theatre.theatreName
    theatre.theatreArea = theatreArea || theatre.theatreArea
    theatre.currentMovie.movieName = movieName
    theatre.currentMovie.director = director
    theatre.currentMovie.cast = cast
    theatre.currentMovie.poster = poster
    theatre.currentMovie.director = director
    theatre.currentMovie.language = language
    theatre.currentMovie.runtime = runtime
    theatre.currentMovie.rating = rating
    theatre.releaseDate = new Date(releaseDate)
    theatre.lastDate = new Date(lastDate)
    theatre.runningDays = runningDays
    theatre.ticketPrice = ticketPrice
    theatre.showTimings = showTimings

    const updatedTheatre = await theatre.save()
    if (updatedTheatre) {
      response.send('Theatre Updated')
    } else {
      throw new Error('Theatre Update failed')
    }
  }
})

export { getAllTheatres, getTheatreById, addNewTheatre, editTheatre }
