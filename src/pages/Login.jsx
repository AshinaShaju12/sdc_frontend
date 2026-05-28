import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 1000);
  };

  const isFormValid = email.trim() !== '' && password.trim() !== '';

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-white text-slate-900 font-sans">
      {/* Left Splash Side - Blue Gradient */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1a66cc] to-[#4c9cf2] flex-col justify-between p-16 text-white relative overflow-hidden">
        {/* Decorative Grid Patterns for Premium Look */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        {/* Top Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-wider uppercase">SalesIntel</span>
        </div>

        {/* Brand Text */}
        <div className="my-auto relative z-10 flex flex-col gap-6">
          <h1 className="text-5xl xl:text-6xl font-bold leading-[1.1] tracking-tight">
            Sales <br /> Intelligence
          </h1>
          <p className="text-lg xl:text-xl text-blue-100/90 leading-relaxed font-light max-w-lg">
            Sign in to continue into the Sales Intelligence workspace and access sales leads, reports, and insights.
          </p>
        </div>

        {/* Footer Area */}
        <div className="text-sm text-blue-100/70 relative z-10">
          © {new Date().getFullYear()} Sales Intelligence Inc. All rights reserved.
        </div>
      </div>

      {/* Right Form Side - White background */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-20 bg-white min-h-screen">
        <div className="w-full max-w-[420px] flex flex-col">
          {/* Header Mobile Logo (visible on small screens only) */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2b7de9] text-white">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-wider text-slate-800 uppercase">SalesIntel</span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-2">
            Sign in
          </h2>
          <button 
            type="button" 
            className="text-[#2b7de9] hover:underline text-left text-sm font-medium mb-10 transition-colors w-fit focus:outline-none"
          >
            Sign in if you have an account here
          </button>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-slate-500 font-semibold text-xs uppercase tracking-wider">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-900 placeholder:text-slate-300 w-full focus:outline-none focus:border-[#2b7de9] focus:ring-1 focus:ring-[#2b7de9] shadow-sm transition-all text-base"
                required
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-slate-500 font-semibold text-xs uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="rounded-2xl border border-slate-200 bg-white pl-5 pr-14 py-4 text-slate-900 placeholder:text-slate-300 w-full focus:outline-none focus:border-[#2b7de9] focus:ring-1 focus:ring-[#2b7de9] shadow-sm transition-all text-base"
                  required
                />
                {/* Toggle Password Visibility Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <button 
                type="button"
                className="text-[#2b7de9] hover:underline text-right text-sm font-medium self-end focus:outline-none"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`w-full py-4 text-white font-semibold rounded-2xl transition-all shadow-md mt-6 text-center select-none ${
                isFormValid && !isLoading
                  ? 'bg-[#2b7de9] hover:bg-[#1a61cc] active:scale-[0.98] cursor-pointer shadow-blue-500/10'
                  : 'bg-[#cbd5e1] cursor-not-allowed shadow-none'
              }`}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Sign Up Footer Link */}
          <div className="text-center mt-10 text-slate-600 text-sm font-medium">
            Not a member?{' '}
            <button 
              type="button" 
              className="text-[#2b7de9] font-semibold hover:underline focus:outline-none"
            >
              Sign-up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
