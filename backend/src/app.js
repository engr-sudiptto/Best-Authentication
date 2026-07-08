import express from 'express';
import authRoute from './routes/auth.route.js';

const app = express()


// ---- middleware ----
app.use(express.json())


// ----- routes ------
app.use('/api/auth', authRoute);


export default app