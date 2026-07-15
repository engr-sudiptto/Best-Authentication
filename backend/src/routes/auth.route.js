import express from 'express'
import { checkUsernameAndEmailController, loginController, logoutController, registerController } from '../controllers/auth.controller.js'


const authRoute = express.Router()


authRoute.post('/register', registerController)
authRoute.post('/login', loginController)
authRoute.post('/logout', logoutController)
authRoute.get('/check-user', checkUsernameAndEmailController)


export default authRoute