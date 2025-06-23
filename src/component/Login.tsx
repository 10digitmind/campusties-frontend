import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hook'; 
import { loginUser,getUser,getUserILiked,getUsersWhoLikedMe,fetchMatches} from '../Redux/Slices/Thunks/userThunks'; 
import '../styles/login.css';
import { toast } from 'react-toastify';
import { useRequireAuth } from './Utility/requireAuth';
import useRedirectIfAuthenticated from './Utility/useRedirectIfAuthenticated';

const Login: React.FC = () => {
  useRedirectIfAuthenticated()
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const { loading, error } = useAppSelector((state) => state.user);

  const token =useAppSelector((state) => state.user.token);
  const user =useAppSelector((state) => state.user.user);

  const dispatch = useAppDispatch()
 const navigate = useNavigate();
  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const result = await dispatch(loginUser(form));  
     dispatch(getUser());
    dispatch(getUserILiked())
    dispatch(getUsersWhoLikedMe())
    dispatch(fetchMatches())


    if (loginUser.fulfilled.match(result)) {
      navigate('/explore');
    } else {
      const errorMessage = result.payload as string;
  
      if (errorMessage === 'New device detected.') {
        navigate(`/dectected-new-device/${form.email}`, { state: { email: form.email } });
      } else {
        toast.error( errorMessage);
        // Optional: Show error message in UI
      }
    }
  };

  const mostLogin = useRequireAuth()


  return (

    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Welcome Back</h2>

        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password</label>
        <div className="password-field">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <span className="password-toggle" onClick={togglePassword}>
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>

        <div className="forgot-password">
          <a href="/forgot-password">Forgot Password?</a>
        </div>

        <button type="submit">Log In</button>

        <div className="signup-link">
          Don't have an account? <a href="/sign-up">Sign up</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
