import express from 'express'
import dotenv from 'dotenv'
import connectToDB from './db.js'
import { theatreRouter } from './routes/theatreRoutes.js'
import { errorHandler, notFound } from './middleware/error.js'
import cors from 'cors'
import { seatRouter } from './routes/seatRoutes.js'
import { userRouter } from './routes/userRoutes.js'
import { bookingRouter } from './routes/bookingRoutes.js'
dotenv.config()
const app = express()
connectToDB()
app.use(express.json())
app.use(cors())
app.get('/', async (req, res) => {
  res.send('Welcome')
})

app.use('/theatres', theatreRouter)
app.use('/seats', seatRouter)
app.use('/users', userRouter)
app.use('/bookings', bookingRouter)
app.get('/paypalclient', async (request, response) => {
  response.send(process.env.PAYPAL_CLIENT_ID)
})
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server started in Development mode on port ${PORT}`)
})
