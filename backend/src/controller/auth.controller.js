import userModel from './../models/user.model.js';
import config from './../config/config.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import transpoter from './../config/email.config.js';



// ------ register controller --------
const registerController = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    // ------ required fields -------
    const requiredFields = { userName: 'Username', email: 'Email', password: 'Password' };
    for (const [key, label] of Object.entries(requiredFields)) {
      if (!req.body[key] || req.body[key]?.trim() === '') {
        return res.status(400).json({success:false, message:`${label} is required`})
      }
    }

    // ------ checking exixting user -------
    const existingUserName = await userModel.findOne({ userName });
    if (existingUserName) {
      return res.status(400).json({success:false, message:'Username is already taken'})
    }
    const existingUserEmail = await userModel.findOne({ email });
    if (existingUserEmail) {
      return res.status(400).json({success:false, message:'Email is already registered'})
    }

    // ------- hashing password --------
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // -------- genarate 6 disit OTP --------
    const userOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const userOtpExpiredAt = Date.now() + 5 * 60 * 1000;

    // ------ creating new user object ---------
    const newUser = new userModel({
      userName,
      email,
      password:hashedPassword,
      otp: userOtp,
      otpExpiredAt: userOtpExpiredAt,
      isLoggedIn: false,
    });

    // -------- save user in the database ---------
    await newUser.save()

    // ---- email configuration -------
    const mailOption = {
      from: config.SENDER_MAIL,
      to: email,
      subject: 'Verify your account - OTP',
      text: `Your OTP for register is ${userOtp}. It will be expire in 5 minutes.`,
      html: `<h3>Welcome to our platform!</h3><p>Your OTP for registration is: <h1><b>${userOtp}</b></h1></p><p>This OTP will expire in <b>5</b> minutes.</p></br></br></br><p>Best regards</p><p>Web authority team</p>`,
    };

    // ----- send OTP via Email using Brevo ----------
    await transpoter.sendMail(mailOption)

    // ----- response ------
    return res.status(201).json({success:true, message:'Registration initiated. Please check your email for OTP.'})
    
  } catch (error) {
    console.log('Error:', error);
    return res.status(500).json({success:false, message:error.message})
  }
}





// ------ verify OTP controller --------
const verifyOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // ----- required fields ------
    if (!otp) {
      return res.status(400).json({success:false, message:'OTP is required'})
    }

    // ------- checking existing user --------
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({success:false, message:'User not found'})
    }

    // ------ OTP validity check --------
    if (Date.now() > existingUser.otpExpiredAt) {
      return res.status(400).json({success:false, message:'OTP has expired.'})
    }

    // ------ if OTP doesn't match -------
    if (existingUser.otp !== otp) {
      return res.status(400).json({success:false, message:'Invalid OTP'})
    }

    // ----- if OTP matched -------
    existingUser.otp = '';
    existingUser.otpExpiredAt = 0;
    existingUser.isLoggedIn = true;
    await existingUser.save()

    // ------ token(7d) create ------
    const token = await jwt.sign({ userId: existingUser._id }, config.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: config.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ------ mail configuration ------
    const mailOption = {
      from: config.SENDER_MAIL,
      to: email,
      subject: 'Account register successfully.',
      text: `<p>Your account has been create sucessfully.</p>`,
      html: `<p>Thank you</p>`,
    };

    // ----- send OTP via Email using Brevo ----------
    await transpoter.sendMail(mailOption)

    // ----- response -----
    return res.status(200).json({success:true, message:'Account register successfully.'})
    
  } catch (error) {
    console.log('Error:', error);
    return res.status(500).json({success:false, message:error.message})
  }
}




// ------ resend OTP controller --------
const resendOtpController = async (req, res) => {
  try {
    const { email } = req.body;

    // ---- check exixting user -------
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({success:false, message:'User not Found'})
    }

    // --- genarate 6 disit OTP ------
    const userOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const UserOtpExpireAt = Date.now() + 5 * 60 * 1000;

    // -------- update otp in database ------
    existingUser.otp = userOtp;
    existingUser.otpExpiredAt = UserOtpExpireAt;
    await existingUser.save()

    // ----- mail configuration -----
    const mailOption = {
      from: config.SENDER_MAIL,
      to: email,
      subject: 'Resend Verification OTP',
      text: `Your new OTP is ${userOtp}`,
      html: `<p>Your new verification OTP is <b>${userOtp}</b>. It will expire in 5 minutes.</p>`
    };

    // ----- send mail -----
    await transpoter.sendMail(mailOption);

    // ----- response --------
    return res.status(200).json({ success: true, message: 'A new OTP has been sent to your email.' });
    
  } catch (error) {
    console.log('Error:', error);
    return res.status(500).json({success:false, message:error.message})
  }
}





// ------ login controller --------
const loginController = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    // -------- required fields ----------
    if (!usernameOrEmail || usernameOrEmail.trim() === '') {
      return res.status(400).json({success:false, message:'Username or Email is required'})
    }
    if (!password || password.trim() === '') {
      return res.status(400).json({success:false, message:'Password is required'})
    }

    // ------ checking existing user --------
    const existingUser = await userModel.findOne({ $or: [{ userName: usernameOrEmail }, { email: usernameOrEmail }] });
    if (!existingUser) {
      return res.status(400).json({ success: false, message:'User not found'})
    }

    // --------- password compear ---------
    const isPassMatch = await bcrypt.compare(password, existingUser.password);
    if (!isPassMatch) {
      return res.status(400).json({success:false, message:'Invalid Username/Email or Password'})
    }

    // ------- update login status in the database --------
    existingUser.isLoggedIn = true;
    await existingUser.save();

    // ------- token(7d) create -----
    const token = await jwt.sign({ userId: existingUser._id }, config.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: config.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // ------ response -------
    return res.status(200).json({success:true, message:'Login successful!'})
    
  } catch (error) {
    console.log('Error:', error);
    return res.status(500).json({success:false, message:error.message})
  }
}






// ------ logout controller --------
const logoutController = async (req, res) => {
  try {
        const token = req.cookies?.token;

        // ----- find and update login status in the database -----
        if (token) {
          try {
            const decoded = jwt.verify(token, config.JWT_SECRET);
            await userModel.findByIdAndUpdate(decoded.userId, {
              isLoggedIn: false,
            });
          } catch (jwtError) {
            console.log(
              'JWT Verification failed during logout:',
              jwtError.message,
            );
          }
        }

        // ----- clear cookie -------
        res.clearCookie('token', {
          httpOnly: true,
          secure: config.NODE_ENV === 'production',
          sameSite: config.NODE_ENV === 'production' ? 'none' : 'strict',
        });

        // ------- response --------
        return res
          .status(200)
          .json({ success: false, message: 'Logout successful!' });

  } catch (error) {
    console.log('Error:', error);
    return res.status(500).json({success:false, message:error.message})
  }
}





// ------ check availabliy controller --------
const checkAvailablityController = async (req, res) => {
  try {
    const { userName, email } = req.body;

    // ------- create response object --------
    const availablity = {
      userName:{available:true, message:`${userName} is available`},
      email:{available:true, message:`${email} is available`}
    }

    // ------- checking username in database --------
    if (userName && userName.trim() !== '') {
      const existingUser = await userModel.findOne({ userName });
      if (existingUser) {
        availablity.userName = {available:false, message:`${userName} is already taken`}
      }
    }

    // ------- checking email in database ----------
    if (email && email.trim() !== '') {
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        availablity.email = {available:false, message:`${email} is already taken`}
      }
    }

    // ------- response --------
    return res.status(200).json({success:true, availablity})
    
  } catch (error) {
    console.log('Error:', error);
    return res.status(500).json({success:false, message:error.message})
  }
}





export {registerController, verifyOtpController, resendOtpController, loginController, logoutController, checkAvailablityController}