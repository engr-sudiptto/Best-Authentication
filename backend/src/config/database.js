import mongoose from 'mongoose';
import config from './config.js';

const connectDB = async () => {
  try {
    // ----- success message ------
    mongoose.connection.on('connected', () => {
      console.log('Database connection established successful.');
    });
    // ---- error message -----
    mongoose.connection.on('error', err => {
      console.log('Database connection error after initial connect:', err);
    });
    await mongoose.connect(config.mongodbURI);
  } catch (error) {
    console.log('Initial database connection failed:', error);
    // ----- turn off the server if the database connection fails -------
    process.exit(1);
  }
};

export default connectDB;
