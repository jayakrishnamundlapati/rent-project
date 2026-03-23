import { useState } from 'react';
import './Auth.css';

const Auth = ({ onLoginSuccess }) => {
  const [view, setView] = useState('login'); // 'login', 'signup', 'forgot', 'otp'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  
  // Handlers
  const handleSendOtp = (e) => {
    e.preventDefault();
    const phoneRegex = /^\d{10}$/;
    
    if (!phoneRegex.test(phoneNumber)) {
      alert("Security Error: Phone number must be exactly 10 numeric digits with no letters.");
      return;
    }
    // Generate a mock 6-digit OTP
    const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(mockOtp);
    setView('otp');
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp === generatedOtp) {
      onLoginSuccess();
    } else {
      alert("Invalid OTP, please try again.");
    }
  };

  const renderLogin = () => (
    <form onSubmit={handleSendOtp} className="auth-form">
      <h2>Welcome Back</h2>
      <p className="auth-subtitle">Login to PG Management Systems</p>
      
      <div className="form-group">
        <label>Phone Number</label>
        <div className="phone-input-group">
          <span className="country-code">+91</span>
          <input 
            type="tel" 
            placeholder="Enter 10-digit phone number" 
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
            maxLength="10"
            required
          />
        </div>
      </div>
      
      <button type="submit" className="btn-primary w-100 mb-3">Send OTP</button>
      
      <div className="auth-links">
        <button type="button" className="link-btn" onClick={() => setView('forgot')}>Forgot Password?</button>
        <p>Don't have an account? <button type="button" className="link-btn highlight" onClick={() => setView('signup')}>Sign Up</button></p>
      </div>
    </form>
  );

  const renderOtp = () => (
    <form onSubmit={handleVerifyOtp} className="auth-form">
      <h2>Verify OTP</h2>
      <p className="auth-subtitle">Enter the 6-digit code sent to {phoneNumber}</p>
      
      {/* MOCK OTP DISPLAY AS REQUESTED */}
      <div className="mock-otp-display">
        Your login OTP is: <strong>{generatedOtp}</strong>
      </div>
      
      <div className="form-group">
        <label>Enter OTP</label>
        <input 
          type="text" 
          placeholder="6-digit OTP" 
          maxLength="6"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
      </div>
      
      <button type="submit" className="btn-primary w-100 mb-3">Verify & Login</button>
      
      <div className="auth-links">
        <button type="button" className="link-btn" onClick={() => { setView('login'); setOtp(''); }}>← Back to Login</button>
      </div>
    </form>
  );

  const renderSignup = () => (
    <form onSubmit={handleSendOtp} className="auth-form">
      <h2>Create Account</h2>
      <p className="auth-subtitle">Join PG Management Systems</p>
      
      <div className="form-group">
        <label>Full Name</label>
        <input type="text" placeholder="Enter your full name" required />
      </div>

      <div className="form-group">
        <label>Phone Number</label>
        <div className="phone-input-group">
          <span className="country-code">+91</span>
          <input 
            type="tel" 
            placeholder="Enter 10-digit phone number" 
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
            maxLength="10"
            required
          />
        </div>
      </div>
      
      <button type="submit" className="btn-primary w-100 mb-3">Register & Send OTP</button>
      
      <div className="auth-links">
        <p>Already have an account? <button type="button" className="link-btn highlight" onClick={() => setView('login')}>Log In</button></p>
      </div>
    </form>
  );

  const renderForgot = () => (
    <form onSubmit={(e) => { e.preventDefault(); alert("Reset link sent!"); setView('login'); }} className="auth-form">
      <h2>Reset Password</h2>
      <p className="auth-subtitle">We will send a reset link to your email</p>
      
      <div className="form-group">
        <label>Email Address</label>
        <input type="email" placeholder="Enter your email" required />
      </div>
      
      <button type="submit" className="btn-primary w-100 mb-3">Send Reset Link</button>
      
      <div className="auth-links">
        <button type="button" className="link-btn" onClick={() => setView('login')}>← Back to Login</button>
      </div>
    </form>
  );

  return (
    <div className="auth-wrapper">
      <div className="auth-container glass-panel">
        <div className="auth-brand">
          <h1>PG Management<span className="highlight-text">Systems</span></h1>
        </div>
        
        <div className="auth-content">
          {view === 'login' && renderLogin()}
          {view === 'signup' && renderSignup()}
          {view === 'forgot' && renderForgot()}
          {view === 'otp' && renderOtp()}
        </div>
      </div>
    </div>
  );
};

export default Auth;
