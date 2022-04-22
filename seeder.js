import Theatre from './mongoose-models/theatreModel.js'
import User from './mongoose-models/userModel.js'
import dotenv from 'dotenv'
import connectToDB from './db.js'
import { seatCreation } from './data/seatData.js'
import { theatres } from './data/theatreData.js'
import { users } from './data/userData.js'
dotenv.config()
await connectToDB()

const importData = async () => {
  try {
    console.log('Entered')
    seatCreation()
    await Theatre.deleteMany()
    await User.deleteMany()
    await Theatre.insertMany(theatres)
    await User.insertMany(users)
    console.log('Data Imported')
    process.exit()
  } catch (error) {
    console.log(`Error : ${error.message}`)
    process.exit(1)
  }
}

importData()
