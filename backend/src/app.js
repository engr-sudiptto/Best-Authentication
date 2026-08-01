import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import authRoute from './router/auth.route.js';

const app = express();

// ------- middlewares ---------
app.use(express.json());
// ------------- CORS Configuration ---------
app.use(
  cors({
    origin: [
      'https://saffrona.netlify.app',
      'https://saffrona-admin.netlify.app',
      'http://localhost:5173',
      'http://localhost:5174',
    ],
    credentials: true,
  }),
);
app.use(cookieParser());


// ------ routes -------
app.use('/api/auth', authRoute);


export default app