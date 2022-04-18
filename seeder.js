import Theatre from './mongoose-models/theatreModel.js'
import dotenv from 'dotenv'
import connectToDB from './db.js'
import { seatCreation } from './data/seatData.js'
import { theatres } from './data/theatreData.js'
dotenv.config()
await connectToDB()

const importData = async () => {
  try {
    console.log('Entered')
    seatCreation()
    await Theatre.deleteMany()
    await Theatre.insertMany(theatres)
    console.log('Data Imported')
    process.exit()
  } catch (error) {
    console.log(`Error : ${error.message}`)
    process.exit(1)
  }
}

importData()
