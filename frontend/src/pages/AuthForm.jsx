import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';

const AuthForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // const [isLoginBtnClick, setIsLoginBtnClick] = useState(false);
  const [submitClick, setSubmitClick] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isLoginBtnClick = location.pathname === '/login';

  // ------- timer variables ---------
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);


  const {
    availablityCheck,
    registerUser,
    verifyOtpController,
    resendOtpController,
    loginController
  } = useContext(AuthContext);

  const [availability, setAvailability] = useState({
    userName: { available: true, message: '' },
    email: { available: true, message: '' },
  });

  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [data, setData] = useState({
    userName: '',
    email: '',
    password: '',
    usernameOrEmail: '',
  });

  // -------- input on change handelr ---------
  const inputOnChangeHandler = async e => {
    const name = e.target.name;
    let value = e.target.value;

    if (name === 'userName') {
      if (value.trim() !== '' && !value.startsWith('@')) {
        value = `@${value}`;
      }
    }

    const updateData = { ...data, [name]: value };
    setData(updateData);

    // ------- send backend request only for username & email ----------
    if (name === 'userName') {
      if (value.trim() !== '' && value !== '@') {
        const res = await availablityCheck(value, '');
        if (res.success && res.availablity?.userName) {
          setAvailability(prev => ({
            ...prev,
            userName: res.availablity.userName,
          }));
        }
      } else {
        setAvailability(prev => ({
          ...prev,
          userName: { available: true, message: '' },
        }));
      }
    }

    if (name === 'email') {
      if (value.trim() !== '') {
        const res = await availablityCheck('', value);
        if (res.success && res.availablity?.email) {
          setAvailability(prev => ({ ...prev, email: res.availablity.email }));
        }
      } else {
        setAvailability(prev => ({
          ...prev,
          email: { available: true, message: '' },
        }));
      }
    }
  };

  // -------- only number input & next input focus functionality ---------
  const handleChange = (e, index) => {
    const value = e.target.value;

    // ----- only number ------
    if (value === ' ' || isNaN(value)) return;

    const lastChar = value.slice(-1);

    const newOtp = [...otp];
    newOtp[index] = lastChar;
    setOtp(newOtp);

    // -------- next input focus functionality ---------
    if (lastChar && e.target.nextSibling) {
      e.target.nextSibling.focus();
    }
  };

  // ----------- prev input box focus functionality -------------
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        e.target.previousSibling.focus();
      }
    }
  };

  // ---------- copy paste controller -------------
  const handlePaste = e => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 6);

    // ------ only number can paste -------
    if (!isNaN(pasteData)) {
      const newOtp = pasteData.split('');

      // ----- if number is less than 6, another box will be empty --------
      const paddedOtp = [
        ...newOtp,
        ...new Array(6 - newOtp.length).fill(''),
      ].slice(0, 6);

      setOtp(paddedOtp);

      // ------  move focus to the last box --------
      const lastBoxIndex = Math.min(newOtp.length, 5);
      const inputs = e.target.parentElement.querySelectorAll('input');
      inputs[lastBoxIndex].focus();
    }
  };

  // --------- form submit handler -----------
  const handleSubmit = async e => {
    e.preventDefault();

    // ===========================================================
    // ============ verifyOtpController function call ============
    // ===========================================================

    if (submitClick) {
      const otpString = otp.join('');
      const otpRes = await verifyOtpController(data.email, otpString);

      if (otpString.length !== 6) {
        toast.error(otpRes.message || 'Please enter a valid 6-digit OTP.');
        return;
      }

      if (otpRes.success) {
        toast.success(
          otpRes.message || 'Verification successful! You can now log in.',
        );
        navigate('/');
      } else {
        toast.error(otpRes.message || 'Verification failed. Please try again.');
      }
      return;
    }

    // =========================================
    // ======= login user function call ========
    // =========================================

    if (isLoginBtnClick) {
      const res = await loginController(data.usernameOrEmail, data.password);
      if (res.success) {
        toast.success(res.message || 'Login successful!');
        navigate('/');
      } else {
        toast.error(res.message || 'Login failed. Please try again.');
      }
      return;
    }

    // =================================================
    // ========= register user function call ===========
    // =================================================

    if (!availability.userName.available || !availability.email.available) {
      toast.error('Username or email is already taken!');
      return;
    }

    const res = await registerUser(data.userName, data.email, data.password);
    if (res.success) {
      toast.success(
        res.message || 'Registration successful! Verification code sent.',
      );
      setSubmitClick(true);
    } else {
      toast.error(res.message || 'Registration failed. Please try again.');
    }
  };


  // ==================================================
  // ======= resend otp timer controller  =============
  // ==================================================

  useEffect(() => {
    let interval = null;

    if (submitClick && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000)
    } else if (timer === 0) {
      setCanResend(true);
      clearInterval(interval);
    }

    return () => clearInterval(interval)
  },[submitClick, timer])


  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0':''}${remainingSeconds}`;
  }


  // ============ resendOtpController function call ============
  const handleResendOtp = async () => {
    if (!canResend) return
    

    const res = await resendOtpController(data.email);
    if (res.success) {
      toast.success(res.message || 'OTP resent successfully!');
      setTimer(300); // Reset timer to 5 minutes
      setCanResend(false); // Disable resend until timer reaches 0 again
    } else {
      toast.error(res.message || 'Failed to resend OTP. Please try again.');
    }
  }

  return (
    <div className="h-screen content-center">
      <form
        onSubmit={handleSubmit}
        className="w-[90%] max-w-120 px-8 py-10 rounded-xl shadow-lg border border-gray-100 m-auto bg-white"
      >
        {submitClick ? (
          // =========================================================
          // --------------- OTP FORM VERIFICATION VIEW --------------
          // =========================================================
          <>
            <div>
              {/* ----------- otp section head line --------------  */}
              <div className="mb-6 text-center">
                <h2 className="text-3xl font-bold text-gray-700 tracking-tight">
                  Verify OTP
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  We have sent a verification OTP to your email.
                </p>
              </div>

              {/* ------------- otp box ------------ */}
              <div className="flex gap-3 justify-center mt-6">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    inputMode="numeric"
                    onChange={e => handleChange(e, index)}
                    onKeyDown={e => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    autoFocus={index === 0}
                    maxLength="1"
                    value={data}
                    required
                    type="text"
                    className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  ></input>
                ))}
              </div>

              {/* ------------ timer fot otp -------------  */}
              <div>
                <p className="text-center text-xs text-gray-600 mt-10 tracking-wide">
                  OTP will expire in
                  <span className="font-semibold ml-1">
                    {formatTime(timer)}
                  </span>
                </p>
                <p className="text-center text-gray-600 text-xs mt-2 tracking-wide">
                  Didn't receive the OTP?
                  <span
                    onClick={handleResendOtp}
                    className={`font-semibold underline ml-0.5 ${
                      canResend
                        ? 'text-blue-600 cursor-pointer hover:text-blue-800'
                        : 'text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Resend OTP
                  </span>
                </p>
              </div>

              {/* ------------ otp submit button --------------  */}
              <button className="w-50 h-10 block mx-auto cursor-pointer bg-blue-600/50 rounded-lg mt-5 text-white hover:bg-blue-600/60">
                Verify OTP
              </button>

              {/* ---------- back button -------------  */}
              <button
                onClick={() => setSubmitClick(false)}
                className="text-xs text-gray-600 flex m-auto mt-10 items-center justify-center cursor-pointer hover:-translate-x-2 transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-4 mt-0.5 mr-0.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                  />
                </svg>
                Back to register
              </button>
            </div>
          </>
        ) : (
          // =========================================================
          // ----------- REGISTER & LOGIN FORM VIEW ------------------
          // =========================================================
          <>
            {/* -------- auth head line ----------  */}
            <div className="mb-6 text-center">
              <h1 className="text-3xl font-bold text-gray-700 tracking-tight">
                {isLoginBtnClick ? 'Login Now' : 'Register Now'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {isLoginBtnClick
                  ? 'Welcome back! Please enter your details.'
                  : 'Create an account to get started.'}
              </p>
            </div>
            {/* ---------- form section -----------  */}
            {isLoginBtnClick ? (
              <div>
                <label className="block text-sm my-2 text-gray-800">
                  Username or Email
                </label>
                <input
                  type="text"
                  name="usernameOrEmail"
                  onChange={inputOnChangeHandler}
                  value={data.usernameOrEmail}
                  required
                  placeholder="@username or email"
                  className="w-full h-11 border px-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-500"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm mb-2 mt-5 text-gray-800">
                  Username
                </label>
                <input
                  type="text"
                  name="userName"
                  onChange={inputOnChangeHandler}
                  value={data.userName}
                  required
                  placeholder="@username"
                  className="w-full h-11 border px-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-500"
                />
                {availability.userName.message && (
                  <p
                    className={`text-xs mt-1 ${availability.userName.available ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {availability.userName.message}
                  </p>
                )}

                <label className="block text-sm my-2 text-gray-800">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  onChange={inputOnChangeHandler}
                  value={data.email}
                  required
                  placeholder="Email"
                  className="w-full h-11 border px-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-500"
                />
                {availability.email.message && (
                  <p
                    className={`text-xs mt-1 ${availability.email.available ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {availability.email.message}
                  </p>
                )}
              </div>
            )}
            <label className="block text-sm my-2 text-gray-800">Password</label>
            <div className="relative">
              <input
                name="password"
                onChange={inputOnChangeHandler}
                value={data.password}
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Password"
                className={`w-full h-11 border px-2 border-gray-300 rounded-lg ${showPassword ? 'text-sm' : 'text-xs'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-500`}
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-2.5 right-2.5 text-gray-600 cursor-pointer"
              >
                {showPassword ? (
                  <i className="fa-regular fa-eye-slash text-sm"></i>
                ) : (
                  <i className="fa-regular fa-eye text-sm"></i>
                )}
              </div>
            </div>
            {/* --------- submit button -------  */}
            <button
              className="w-full h-11 bg-blue-700/50 rounded-sm mt-7 text-white cursor-pointer hover:bg-blue-700/60"
              type="submit"
            >
              {isLoginBtnClick ? 'Login' : 'Register'}
            </button>
            {/* --------- Toggle Login / Register ------- */}
            <div className="mt-6 text-center text-sm text-gray-600">
              {isLoginBtnClick
                ? "Don't have an account? "
                : 'Already have an account? '}
              <button
                type="button"
                onClick={() =>
                  navigate(isLoginBtnClick ? '/register' : '/login')
                }
                className="text-blue-600/50 cursor-pointer hover:text-blue-600/70 font-semibold hover:underline focus:outline-none"
              >
                {isLoginBtnClick ? 'Register' : 'Login'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

export default AuthForm