import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import './Auth.css';

const Auth = ({ onLoginSuccess }) => {
  const [view, setView] = useState('login'); // 'login', 'signup', 'forgot'
  const [showPassword, setShowPassword] = useState(false);
  
  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Load existing mock users from localStorage to simulate a database
  const getRegisteredUsers = () => {
    const users = localStorage.getItem('registeredUsers');
    return users ? JSON.parse(users) : [];
  };
  const handleSignup = (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !password) {
      toast.error('Please fill out all fields.');
      return;
    }
    
    const users = getRegisteredUsers();
    // Check if user already exists
    if (users.find(u => u.email === email || u.phone === phone)) {
      toast.error('An account with this email/phone already exists.');
      return;
    }

    const newUser = { name, email, phone, password }; // Storing password raw just for mock UI purposes
    users.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    
    toast.success('Account created successfully! Logging you in...');
    onLoginSuccess({ name, email, phone });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter your email and password.');
      return;
    }

    const users = getRegisteredUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      onLoginSuccess({ name: user.name, email: user.email, phone: user.phone });
    } else {
      toast.error('Invalid email or password. Please try again.');
    }
  };

  const renderLogin = () => (
    <form onSubmit={handleLogin} className="auth-form">
      <h2>Welcome Back</h2>
      <p className="auth-subtitle">Login to your PG Account</p>
      
      <div className="form-group">
        <label>Email Address</label>
        <input 
          type="email" 
          placeholder="your.email@example.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Password</label>
        <div style={{ position: 'relative' }}>
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Enter your password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', paddingRight: '40px' }}
          />
          <button 
            type="button"
            onClick={(e) => { e.preventDefault(); setShowPassword(!showPassword); }}
            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, display: 'flex' }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
      
      <button type="submit" className="btn-primary w-100 mb-3">Login</button>
      
      <div className="auth-links">
        <button type="button" className="link-btn" onClick={() => setView('forgot')}>Forgot Password?</button>
        <p>Don't have an account? <button type="button" className="link-btn highlight" onClick={() => { setView('signup'); setEmail(''); setPassword(''); }}>Sign Up</button></p>
      </div>
    </form>
  );

  const renderSignup = () => (
    <form onSubmit={handleSignup} className="auth-form">
      <h2>Create Account</h2>
      <p className="auth-subtitle">Join PG Management Systems</p>
      
      <div className="form-group">
        <label>Full Name</label>
        <input 
          type="text" 
          placeholder="John Doe" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          required 
        />
      </div>

      <div className="form-group">
        <label>Email Address</label>
        <input 
          type="email" 
          placeholder="john@example.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
      </div>

      <div className="form-group">
        <label>Phone Number</label>
        <div className="phone-input-group">
          <span className="country-code">+91</span>
          <input 
            type="tel" 
            placeholder="10-digit number" 
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            maxLength="10"
            required
          />
        </div>
      </div>
      
      <div className="form-group">
        <label>Password</label>
        <div style={{ position: 'relative' }}>
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Create a password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
            style={{ width: '100%', paddingRight: '40px' }}
          />
          <button 
            type="button"
            onClick={(e) => { e.preventDefault(); setShowPassword(!showPassword); }}
            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, display: 'flex' }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
      
      <button type="submit" className="btn-primary w-100 mb-3">Create Account</button>
      
      <div className="auth-links">
        <p>Already have an account? <button type="button" className="link-btn highlight" onClick={() => { setView('login'); setEmail(''); setPassword(''); }}>Log In</button></p>
      </div>
    </form>
  );

  const renderForgot = () => (
    <form onSubmit={(e) => { e.preventDefault(); toast.success("Reset link sent to your email!"); setView('login'); }} className="auth-form">
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
        </div>
      </div>
    </div>
  );
};

export default Auth;
