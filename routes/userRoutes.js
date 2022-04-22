import express from 'express'
import {
  confirmUser,
  getUserByEmail,
  updatePassword,
  userSignIn,
} from '../controller-functions/userController.js'

const router = express.Router()

// /users

router.route('/signin').post(userSignIn)
router.route('/userbyemail').get(getUserByEmail)
router.route('/userconfirmation').post(confirmUser)
router.route('/passwordreset').put(updatePassword)
export const userRouter = router
