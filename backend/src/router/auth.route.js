import express from "express";
import { checkAvailablityController, loginController, logoutController, registerController, resendOtpController, verifyOtpController } from "../controller/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const authRoute = express.Router();


// ---- all routes ------
authRoute.post('/register', registerController)
authRoute.post('/verify-otp', verifyOtpController)
authRoute.post('/resend-otp', resendOtpController)
authRoute.post('/login', loginController)
authRoute.post('/logout',authMiddleware, logoutController)
authRoute.get('check-availablity', checkAvailablityController)


export default authRoute