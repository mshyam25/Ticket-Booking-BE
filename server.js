import express from 'express'
import dotenv from 'dotenv'
import connectToDB from './db.js'
import { theatreRouter } from './routes/theatreRoutes.js'
import { errorHandler, notFound } from './middleware/error.js'

dotenv.config()
const app = express()
connectToDB()
app.use(express.json())
app.get('/', async (req, res) => {
  res.send('Welcome')
})

app.use('/theatres', theatreRouter)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server started in Development mode on port ${PORT}`)
})
