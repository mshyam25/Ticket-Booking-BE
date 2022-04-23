import User from '../mongoose-models/userModel.js'
import { generateToken } from '../generateToken.js'
import expressAsyncHandler from 'express-async-handler'
import { verifyMail, passwordReset } from '../verifyMail.js'
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

  const validToken = await VerificationToken.findOne({ token: token })
  if (validToken) {
    const user = await User.findById(validToken._userId)
    user.isVerified = true
    // await VerificationToken.deleteOne({ token })

    const updatedUser = await user.save()

    response.redirect(`http://localhost:3000/signin`)
  } else {
    response.status(404)
    response.redirect(`http://localhost:3000/verificationemail/${email}`)
  }
})

// Description : Resend Verification Mail
// Route :  GET /users/resendverification
// Access : Public

const resendVerificationMail = expressAsyncHandler(
  async (request, response) => {
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

  if (user) {
    response.status(200)
    response.send(user)
  } else {
    response.status(404)
    throw new Error('No Account found for this Email Id')
  }
})

// Description : Sending Password Reset Link
// Route :  GET /users/resetpasswordlink/:email
// Access : Public
const resetPasswordLink = expressAsyncHandler(async (request, response) => {
  const { email } = request.params
  const user = await User.findOne({ email })
  if (user) {
    if (passwordReset(user, request)) {
      response.status(200).send('Password Reset link is sent to your Email Id')
    }
  } else {
    response.status(404)
    throw new Error('No Account found for this Email Id')
  }
})

// Description : Verifying Password Reset Link
// Route :  GET /users/resetpassword/:email/:passwordResetToken
// Access : Public

const verifyResetLink = expressAsyncHandler(async (request, response) => {
  const { passwordResetToken } = request.params
  const validToken = await VerificationToken.findOne({
    passwordResetToken: passwordResetToken,
  })
  if (validToken) {
    const user = await User.findById(validToken._userId)
    // if (user.isVerified) {
    //   response.status(200).send('User has been already verified. Please Login')
    // }
    // validToken.passwordResetToken = ''
    // const updatedToken = await validToken.save()

    response.redirect(`http://localhost:3000/passwordreset/${user.email}`)
  } else {
    response.status(404)
    // response.send({
    //   message:
    //     'Your Password Reset link may have expired. Please click to resend link.',
    //   resendlink: `http://${request.headers.host}/users/resetpasswordlink/${email}`,
    // })
    response.redirect(`http://localhost:3000/signin`)
  }
})

// Description : Reset Password
// Route :  PUT /users/passwordreset
// Access : Public
const resetPassword = expressAsyncHandler(async (request, response) => {
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
  resetPasswordLink,
  verifyResetLink,
  getUserByEmail,
  resetPassword,
}
