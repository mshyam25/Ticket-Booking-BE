import express from 'express'
import {
  getUserByEmail,
  getUsers,
  resendVerificationMail,
  resetPassword,
  resetPasswordLink,
  userRegistration,
  userSignIn,
  verifyResetLink,
  verifyUser,
} from '../controller-functions/userController.js'
import { adminAuth, auth } from '../middleware/auth.js'

const router = express.Router()

// /users
router.route('/').post(userRegistration).get(auth, adminAuth, getUsers)
router.route('/signin').post(userSignIn)
router.route('/verification/:email/:token').get(verifyUser)
router.route('/resendverificationmail/:email').get(resendVerificationMail)
router.route('/userbyemail').post(getUserByEmail)
router.route('/resetpasswordlink/:email').get(resetPasswordLink)
router.route('/resetpassword/:email/:passwordResetToken').get(verifyResetLink)
router.route('/passwordreset').put(resetPassword)

export const userRouter = router
