import userModel from './../models/user.model.js';
import config from './../config/config.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'



// ------ register controller --------
const registerController = async (req, res) => {
  try {
    
  } catch (error) {
    console.log('Error:', error);
    return res.status(500).json({success:false, message:error.message})
  }
}





// ------ verify OTP controller --------
const verifyOtpController = async (req, res) => {
  try {
    
  } catch (error) {
    console.log('Error:', error);
    return res.status(500).json({success:false, message:error.message})
  }
}




// ------ resend OTP controller --------
const resendOtpController = async (req, res) => {
  try {
    
  } catch (error) {
    console.log('Error:', error);
    return res.status(500).json({success:false, message:error.message})
  }
}





// ------ login controller --------
const loginController = async (req, res) => {
  try {
    
  } catch (error) {
    console.log('Error:', error);
    return res.status(500).json({success:false, message:error.message})
  }
}






// ------ logout controller --------
const logoutController = async (req, res) => {
  try {
    
  } catch (error) {
    console.log('Error:', error);
    return res.status(500).json({success:false, message:error.message})
  }
}





// ------ check availabliy controller --------
const checkAvailablityController = async (req, res) => {
  try {
    
  } catch (error) {
    console.log('Error:', error);
    return res.status(500).json({success:false, message:error.message})
  }
}





export {registerController, verifyOtpController, resendOtpController, loginController, logoutController, checkAvailablityController}