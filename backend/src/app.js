import cookieParser from 'cookie-parser';
import express from 'express';
import authRoute from './router/auth.route.js';

const app = express();

// ------- middlewares ---------
app.use(express.json());
app.use(cookieParser());


// ------ routes -------
app.use('/api/auth', authRoute);


export default app