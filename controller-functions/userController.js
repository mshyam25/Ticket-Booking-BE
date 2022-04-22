import User from '../mongoose-models/userModel.js'
import { generateToken } from '../generateToken.js'
import expressAsyncHandler from 'express-async-handler'

// Description : User Sign in
// Route :  GET /users/signin
// Access : Public
const userSignIn = expressAsyncHandler(async (request, response) => {
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

// Description : Confirming USer based on Security Question Response
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

export { userSignIn, getUserByEmail, confirmUser, updatePassword }
