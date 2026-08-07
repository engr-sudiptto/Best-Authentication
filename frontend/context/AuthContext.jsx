import axios from "axios";
import { createContext } from "react";


export const AuthContext = createContext(null);


const AuthContextProvider = (props) => {
  const url = 'http://localhost:4000';

  // -------- check username or email availablity ---------
  const availablityCheck = async (userName, email) => {
    try {
      const response = await axios.post(`${url}/api/auth/check-availablity`, {userName, email});
      return response.data;
    } catch (error) {
      console.log("Error to get data")
      return error.response?.data || { success: false, message: "Error checking availability" };
    }
  };

  // --------- register user ----------
  const registerUser = async (userName, email, password) => {
    try {
      const response = await axios.post(`${url}/api/auth/register`, {userName, email, password});
      return response.data;
    } catch (error) {
      console.log('Error to register user')
      return error.response?.data || { success: false, message: "Error registering user" };
    }
  }

  // ----------- verifyOtpController -----------
  const verifyOtpController = async (email, otp) => {
    try {
      const response = await axios.post(`${url}/api/auth/verify-otp`, { email, otp });
      return response.data;
    } catch (error) {
      console.log('Error to verify OTP')
      return error.response?.data || { success: false, message: "Error verifying OTP" };
    }
  }

  // ----------- resendOtpController -----------
  const resendOtpController = async (email) => {
    try {
      const response = await axios.post(`${url}/api/auth/resend-otp`, { email });
      return response.data;
    } catch (error) {
      console.log('Error to resend OTP')
      return error.response?.data || { success: false, message: "Error resending OTP" };
    }
  }

  // ---------- login controller ----------
  const loginController = async (usernameOrEmail, password) => {
    try {
      const response = await axios.post(`${url}/api/auth/login`, { usernameOrEmail, password });
      return response.data;
    } catch (error) {
      console.log('Error to login user')
      return error.response?.data || { success: false, message: "Error logging in user" };
    }
  };

  const contextValue = {
    availablityCheck,
    registerUser,
    verifyOtpController,
    resendOtpController,
    loginController
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
}


export default AuthContextProvider;