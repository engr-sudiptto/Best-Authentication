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

  const contextValue = {
    availablityCheck
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
}


export default AuthContextProvider;