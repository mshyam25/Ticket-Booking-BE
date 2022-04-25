import nodemailer from 'nodemailer'
import expressAsyncHandler from 'express-async-handler'
import crypto from 'crypto'
import VerificationToken from './mongoose-models/tokenModel.js'

const verifyMail = expressAsyncHandler(async (user, request) => {
  const vToken = await VerificationToken.create({
    _userId: user._id,
    token: crypto.randomBytes(16).toString('hex'),
  })
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'noreplytestermail@gmail.com',
      pass: 'Nowuseeme@22',
    },
  })

  const mailOptions = {
    from: 'noreplytestermail@gmail.com',
    to: user.email,
    subject: 'Account Verification Link',
    text: `Hello <h1>${user.name}</h1>,\n\n 'Please verify your account by clicking the link : \n
   http://${request.headers.host}/users/verification/${user.email}/${vToken.token}   \n\nThank You\n`,
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.log(error)
    else {
      console.log('Mail sent')
      return true
    }
  })
})

const passwordReset = expressAsyncHandler(async (user, request) => {
  const pToken = await VerificationToken.create({
    _userId: user._id,

    passwordResetToken: crypto.randomBytes(32).toString('hex'),
  })
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'noreplytestermail@gmail.com',
      pass: 'Nowuseeme@22',
    },
  })

  const mailOptions = {
    from: 'noreplytestermail@gmail.com',
    to: user.email,
    subject: 'Password Reset Link',
    text: `Hello ${user.name},\n\n 'Please click the below link to reset your password: \n
   http://${request.headers.host}/users/resetpassword/${user.email}/${pToken.passwordResetToken}   \n\nThank You\n`,
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.log(error)
    else {
      console.log('Mail sent')
      return true
    }
  })
})

const sendBookingDetails = expressAsyncHandler(
  async (booking, user, request) => {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'noreplytestermail@gmail.com',
        pass: 'Nowuseeme@22',
      },
    })

    const mailOptions = {
      from: 'noreplytestermail@gmail.com',
      to: booking.userEmail,
      subject: 'Your Booking is Confirmed',
      text: `Hello <h1>${
        user.name
      }</h1>,\n\n 'Please find your Booking Details: \n
   Theatre : ${booking.theatreName}   \n 
   Movie : ${booking.movieName}   \n 
   Date : ${booking.date}   \n 
   Time : ${booking.showTime}   \n 
   Seats : ${booking.seatCount}   \n 
   SeatNumbers : ${booking.seats.map((seat) => seat)}   \n 
   TotalPrice : ${booking.totalPrice}   \n 
   
   
   \nThank You\n
   Ticket Booking App`,
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.log(error)
      else {
        console.log('Mail sent')
        return true
      }
    })
  }
)

export { passwordReset, verifyMail, sendBookingDetails }
