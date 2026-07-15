import userModel from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from './../config/config.js';
import cookie from 'cookie-parser';

// ----- register controller -------
const registerController = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    // ----- required fields -------
    const requiredFields = {
      userName: 'UserName',
      email: 'Email',
      password: 'Password',
    };
    for (const [key, label] of Object.entries(requiredFields)) {
      if (!req.body[key] || req.body[key]?.trim() === '') {
        return res
          .status(400)
          .json({ success: false, message: `${label} is required` });
      }
    }

    // ---- check existing user -----
    const existingUser = await userModel.findOne({
      $or: [{ email }, { userName }],
    });
    if (existingUser) {
      const field = existingUser.email === email ? 'Email' : 'Username';
      return res
        .status(400)
        .json({ success: false, message: `${field} is already registered` });
    }

    // ----- hashing password -----
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ---- creating new user object ----
    const newUser = new userModel({
      userName,
      email,
      password: hashedPassword,
    });

    // ---- save user in the database
    await newUser.save();

    // ----- token(7d) create ------
    const token = jwt.sign({ userId: newUser._id }, config.JSON_WEB_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: config.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ---- structure remove password from user response for security --------
    const userResponse = {
      _id: newUser._id,
      userName: newUser.userName,
      email: newUser.email,
    };

    res
      .status(201)
      .json({ success: true, message: 'User registered successfully' });
    
    
  } catch (error) {
    console.log('Registration Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};





// ------- login controller --------
const loginController = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    // ----- required fields -------
    const requiredFields = {
      userName: 'UserName',
      email: 'Email',
      password: 'Password',
    };
    for (const [key, label] of Object.entries(requiredFields)) {
      if (!req.body[key] || req.body[key]?.trim() === '') {
        return res
          .status(400)
          .json({ success: false, message: `${label} is required` });
      }
    }

    // ---- check existing user -----
    const existingUser = await userModel.findOne({
      $or: [{ email }, { userName }],
    });
    if (!existingUser) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid Username/Email or Password' });
    }

    // ----- checking password -----
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({success: false, message:'Invalid password'})
    }

        // ----- token(7d) create ------
    const token = jwt.sign({ userId: existingUser._id }, config.JSON_WEB_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: config.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({success: true, message: 'Login successful'})


  } catch (error) {
    res.status(500).json({success:false, message: error.message})
  }
};



// -------------- log out controller functionality ------------
const logoutController = async(req, res) =>{
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: config.NODE_ENV === 'production' ? 'none' : 'strict',
    });

    return res.json({success:true, message:'Logged Out'})
  } catch (error) {
    res.status(500).json({success:false, message: error.message})
  }
}





// ------------ check username availability controller -------------
const checkUsernameAndEmailController = async (req, res) => {
  try {
    const { userName, email } = req.body;

    // ----- checking userName in database ------
    const user = await userModel.findOne({ $or: [{ userName }, { email }] });

    if (user) {
      if (userName && user.userName === userName) {
        return res.status(200).json({
          available: false,
          type: 'username',
          message: 'Username is already taken',
        });
      }
      if (email && user.email === email) {
        return res.status(200).json({
          available: false,
          type: 'email',
          message: 'Email is already registered',
        });
      }
    }
    return res.status(200).json({
      available: true,
      message: userName ? 'Username is available' : 'Email is available',
    });
  } catch (error) {
    console.log('Check userName or email Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};








export { registerController, loginController, checkUsernameAndEmailController , logoutController};
