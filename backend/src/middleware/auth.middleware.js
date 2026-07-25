import jwt from 'jsonwebtoken';
import config from '../config/config.js';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({success:false, message:'401 Unauthorized'})
    }

    const decode = jwt.verify(token, config.JWT_SECRET);
    req.userId = decode.userId
    next()

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({success:false, message:'Token expired, please login again'})
    }

    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
}

export default authMiddleware