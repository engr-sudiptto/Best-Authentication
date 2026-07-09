import userModel from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from './../config/config.js';

// ----- register controller -------
const registerController = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    // ----- required fields -------
    const requiredFields = { userName: "UserName", email: "Email", password: "Password" }
    for (const [key, label] of Object.entries(requiredFields)) {
      if (!req.body[key] || req.body[key]?.trim() === "") {
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

    // ---- structure remove password from user response for security --------
    const userResponse = {
      _id: newUser._id,
      userName: newUser.userName,
      email: newUser.email,
    };

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: userResponse,
    });
  } catch (error) {
    console.log('Registration Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};





// ------- login controller --------
const loginController = async (req, res) => {
  try {
  } catch (error) {}
};









export { registerController, loginController };
