import express from 'express'
import { checkUsernameAndEmailController, loginController, registerController } from '../controllers/auth.controller.js'


const authRoute = express.Router()


authRoute.post('/register', registerController)
authRoute.post('/login', loginController)
authRoute.get('/check-user', checkUsernameAndEmailController)


export default authRoute