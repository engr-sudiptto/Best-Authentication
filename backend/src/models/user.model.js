import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      unique: true,
      trim: true,
      required: [true, 'Username is required'],
      lowercase: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: [true, 'Email is required'],
      lowercase: true,
    },
    password: {
      type: String,
      trim: true,
      required: [true, 'Password is required'],
    },
    otp: { type: String, default: '' },
    otpExpiredAt: { type: Number, default: 0 },
    isLoggedIn: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const userModel = mongoose.models.User || mongoose.model('User', userSchema);

export default userModel;
