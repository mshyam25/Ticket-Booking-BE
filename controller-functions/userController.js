import User from '../mongoose-models/userModel.js'
import { generateToken } from '../generateToken.js'
import expressAsyncHandler from 'express-async-handler'
import verifyMail from '../verifyMail.js'
import VerificationToken from '../mongoose-models/tokenModel.js'

// Description : Get all users
// Route :  GET /users
// Access : Private auth,adminAuth
const getUsers = expressAsyncHandler(async (request, response) => {
  const users = await User.find({})
  if (users) {
    response.send(users)
  } else {
    response.status(404)
    throw new Error('Invalid request')
  }
})

// Description : User Sign in
// Route :  GET /users/signin
// Access : Public
const userSignIn = expressAsyncHandler(async (request, response) => {
  console.log()
  const { email, password } = request.body
  const user = await User.findOne({ email })

  if (user && (await user.passwordMatchCheck(password))) {
    if (user.isVerified) {
      response.status(200)
      response.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
        host: request.headers.host,
      })
    } else {
      response.status(401)
      throw new Error(
        'Your Account is not verified.Please check your email for Verification Link.'
      )
    }
  } else {
    response.status(404)
    throw new Error('Invalid User Credentials')
  }
})
// Description : User Sign Up
// Route :  POST /users
// Access : Public

const userRegistration = expressAsyncHandler(async (request, response) => {
  const { name, email, password } = request.body
  const userExists = await User.findOne({ email })

  if (userExists) {
    response.status(500)
    throw new Error(
      'This Email id is registered with another user. Please use a different Email id.'
    )
  } else {
    const user = await User.create({
      name,
      email,
      password,
    })
    if (user) {
      verifyMail(user, request)
      response.status(201)
      response.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      })
    } else {
      response.status(400)
      throw new Error('Invalid user data')
    }
  }
})

// Description : Verifying User
// Route :  PUT /users/verification
// Access : Public

const verifyUser = expressAsyncHandler(async (request, response) => {
  const { email, token } = request.params
  console.log(token)
  const validToken = await VerificationToken.findOne({ token: token })
  if (validToken) {
    const user = await User.findById(validToken._userId)
    // if (user.isVerified) {
    //   response.status(200).send('User has been already verified. Please Login')
    // }
    user.isVerified = true
    await VerificationToken.deleteOne({ token })
    const updatedUser = await user.save()

    response.redirect(`http://localhost:3000/signin`)
  } else {
    response.status(404)
    // response.send({
    //   message:
    //     'Your verification link may have expired. Please click to resend Verification Email',
    //   resendlink: `http://${request.headers.host}/users/resendverificationmail/${email}`,
    // })
    response.redirect(`http://localhost:3000/verificationemail/${email}`)
  }
})

// Description : Resend Verification Mail
// Route :  GET /users/resendverification
// Access : Public

const resendVerificationMail = expressAsyncHandler(
  async (request, response) => {
    console.log('Entered')
    const { email } = request.params
    const user = await User.findOne({ email: email })
    if (user) {
      if (user.isVerified) {
        response.status(201).send('Your Account is already Verified')
      } else {
        if (verifyMail(user, request)) {
          response
            .status(200)
            .send('Verification email sent.Please check your inbox')
        }
      }
    } else {
      response.status(500)
      throw new Error('Invalid user')
    }
  }
)

// Description : Find User by Email Id
// Route :  GET /users/userbyemail
// Access : Public
const getUserByEmail = expressAsyncHandler(async (request, response) => {
  const { email } = request.body
  const user = await User.findOne({ email })
  console.log(user)
  if (user) {
    response.status(200)
    response.send(user)
  } else {
    response.status(404)
    throw new Error('Email does not belong to any user')
  }
})

// Description : Confirming User based on Security Question Response
// Route :  POST /users/userconfirmation
// Access : Public
const confirmUser = expressAsyncHandler(async (request, response) => {
  const { securityAnswer, email } = request.body
  const user = await User.findOne({ email })
  if (user.securityQuestionAnswer === securityAnswer) {
    response.status(200)
    response.send('User Confirmed')
  } else {
    response.status(404)
    throw new Error('Invalid Security Question Answer')
  }
})

// Description : Update Password
// Route :  PUT /users/passwordreset
// Access : Public
const updatePassword = expressAsyncHandler(async (request, response) => {
  const { email, password } = request.body
  const user = await User.findOne({ email })
  if (user) {
    user.password = password
    const updatedUser = await user.save()
    response.send('Password Updated.Please signin with your new password')
  } else {
    response.status(404)
    throw new Error('User not found')
  }
})

export {
  userSignIn,
  getUsers,
  userRegistration,
  verifyUser,
  resendVerificationMail,
  confirmUser,
  updatePassword,
  getUserByEmail,
}
