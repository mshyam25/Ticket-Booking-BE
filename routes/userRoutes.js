import express from 'express'
import {
  getUsers,
  resendVerificationMail,
  userRegistration,
  userSignIn,
  verifyUser,
} from '../controller-functions/userController.js'
import { adminAuth, auth } from '../middleware/auth.js'

const router = express.Router()

// /users
router.route('/').post(userRegistration).get(auth, adminAuth, getUsers)
router.route('/signin').post(userSignIn)
router.route('/verification/:email/:token').get(verifyUser)
router.route('/resendverificationmail/:email').get(resendVerificationMail)
// router.route('/userbyemail').get(getUserByEmail)
// router.route('/userconfirmation').post(confirmUser)
// router.route('/passwordreset').put(updatePassword)
export const userRouter = router
