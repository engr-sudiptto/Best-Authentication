import dotenv from 'dotenv';

dotenv.config();

if(!process.env.MONGODB_URL){
  throw new Error('MONGODB_URL environment variable is missing or undefined.');
}
if(!process.env.JWT_SECRET){
  throw new Error('JWT_SECRET environment variable is missing or undefined.');
}
if(!process.env.NODE_ENV){
  throw new Error('NODE_ENV environment variable is missing or undefined.');
}
if(!process.env.BREVO_USER){
  throw new Error('BREVO_USER environment variable is missing or undefined.');
}
if(!process.env.BREVO_SMTP_KEY){
  throw new Error('BREVO_SMTP_KEY environment variable is missing or undefined.');
}
if(!process.env.SENDER_MAIL){
  throw new Error('SENDER_MAIL environment variable is missing or undefined.');
}


const config = {
  MONGODB_URL: process.env.MONGODB_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV,
  BREVO_USER: process.env.BREVO_USER,
  BREVO_SMTP_KEY: process.env.BREVO_SMTP_KEY,
  SENDER_MAIL: process.env.SENDER_MAIL,
};



export default config