import mongoose from 'mongoose';
import config from './config.js';


const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => {
      console.log('MongoDB database connection established successfully.');
    })
    mongoose.connection.on('error', (err) => {
      console.log('An error occurred right after connecting to the database.');
    })
    await mongoose.connect(config.MONGODB_URL)
    
  } catch (error) {
    console.log('Internal server error:', error);
  }
}

export default connectDB