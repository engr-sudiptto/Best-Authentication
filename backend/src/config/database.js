import mongoose from "mongoose";
import config from "./config.js";

const connectDB = async () => {
  try {
    // ------ success ------
    mongoose.connection.on("connected", () => {
      console.log("Database connection established successfully.")
    })
    // ------ error --------
    mongoose.connection.on("error", (err) => {
      console.log("Database connection error after initial connect:", err)
    })
    await mongoose.connect(config.MONGODB_URL)
  } catch (error) {
    console.error("Initial databse connection failed:", error)
  }
}

export default connectDB