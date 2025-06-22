import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hook'; // Your typed hooks
import { createUser } from '../Redux/Slices/Thunks/userThunks'; // Adjust path to match your project
import '../styles/signup.css';
import { toast } from 'react-toastify';

const SignUp: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setName] = useState('');
  const [showpassword, setShowPassword] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.user);

  const getPasswordStrength = () => {
    if (password.length > 8 && /[A-Z]/.test(password) && /\d/.test(password)) {
      return 'Strong';
    } else if (password.length >= 6) {
      return 'Moderate';
    } else {
      return 'Weak';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await dispatch(createUser({ userName, email, password }));

    sessionStorage.setItem('signupEmail', email);

    if (createUser.fulfilled.match(result)) {
        toast.success('Sign up successful')
        setTimeout(() => {
            navigate('/signup-success');
        }, 2000);
      
    }
    // error is handled from Redux state
  };

  return (
    <div className='signup-parent'>
      <div className="signup-container">
        <h2>Create Account</h2>

        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            required
            value={userName}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="password-field">
            <input
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setShowPassword(true);
              }}
            />
            <span
              className="toggle-password"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? '🙈' : '👁️'}
            </span>
          </div>

        { showpassword && password.length>0? <div className={`password-strength ${getPasswordStrength().toLowerCase()}`}>
            Password Strength: {getPasswordStrength()}
          </div>:""}

          {error && <div className="error-message">⚠️ {error}</div>}

          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <p className="signup-footer">
          Already have an account? <span onClick={() => navigate('/login')}>Log In</span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
