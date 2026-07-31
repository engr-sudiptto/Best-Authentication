import React, { useState } from 'react'

const AuthForm = () => {
  const [isLoginBtnClick, setIsLoginBtnClick] = useState(false);
  const [submitClick, setSubmitClick] = useState(false)
  const [otp, setOtp] = useState(new Array(6).fill(''));

  // -------- only number input & next input focus functionality ---------
  const handleChange = (e, index) => {
    const value = e.target.value;

    // ----- only number ------
    if (value === ' ' || isNaN(value)) return;

    const lastChar = value.slice(-1)

    const newOtp = [...otp];
    newOtp[index] = lastChar
    setOtp(newOtp);

    // -------- next input focus functionality --------- 
    if (lastChar && e.target.nextSibling) {
      e.target.nextSibling.focus()
    }
  }


  // ----------- prev input box focus functionality -------------
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0 ) {
        e.target.previousSibling.focus();
      }
    }
  }


  // ---------- copy paste controller -------------
  const handlePaste = e => {
    e.preventDefault()
    const pasteData = e.clipboardData.getData('text').slice(0, 6);

    // ------ only number can paste -------
    if (!isNaN(pasteData)) {
      const newOtp = pasteData.split('')

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
  }

  // --------- form submit handler -----------
  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitClick(true)
  }

  return (
    <div className="h-screen content-center">
      <form
        onSubmit={handleSubmit}
        className="w-[90%] max-w-120 px-8 py-10 rounded-xl shadow-lg border border-gray-100 m-auto bg-white"
      >
        {submitClick ? (
          // --------- otp form section ------
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

              {/* ------------ otp submit button --------------  */}
              <button className="w-50 h-10 block mx-auto cursor-pointer bg-blue-600/50 rounded-lg mt-10 text-white hover:bg-blue-600/60">
                Verify OTP
              </button>
            </div>
          </>
        ) : (
          // ------------- register & login form section --------------
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
                  placeholder="@username or email"
                  className="w-full h-11 border px-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm mb-2 mt-5 text-gray-800">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="@username"
                  className="w-full h-11 border px-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <label className="block text-sm my-2 text-gray-800">
                  Email
                </label>
                <input
                  type="text"
                  placeholder="Email"
                  className="w-full h-11 border px-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            )}
            <label className="block text-sm my-2 text-gray-800">Password</label>
            <input
              type="text"
              placeholder="Password"
              className="w-full h-11 border px-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
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
                onClick={() => setIsLoginBtnClick(!isLoginBtnClick)}
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