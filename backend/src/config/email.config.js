import nodeMailer from 'nodemailer';
import config from './config.js';

// ----- create a transpoter using SMTP
const transpoter = nodeMailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: config.BREVO_USER,
    pass:config.BREVO_SMTP_KEY,
  }
});

export default transpoter;