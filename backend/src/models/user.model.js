import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: { type: String, required: [true, 'Password is required'] },
  },
  { timestamps: true },
);

const userModel = mongoose.models.User || mongoose.model('User', userSchema);

export default userModel;
