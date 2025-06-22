import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/resetpassword.css';
import { Eye, EyeOff } from 'lucide-react'; 

const ResetPassword: React.FC = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [getPasswordStrengths, setShowPasswordStrenghts] = useState(false);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    try {
      const res = await axios.post(`http://localhost:5000/api/reset-password/${token}`, { newPassword });
      setSuccess(res.data.message || 'Password reset successful!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. Try again.');
      console.log(err)
    }
  };

  const getPasswordStrength = () => {
    if (newPassword.length > 8 && /[A-Z]/.test(newPassword) && /\d/.test(newPassword)) {
      return 'Strong';
    } else if (newPassword.length >= 6) {
      return 'Moderate';
    } else {
      return 'Weak';
    }
  };


  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      <p className="info-text">Enter your new password below.</p>

      {success && <p className="success-text">{success}</p>}
      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => {
                setNewPassword(e.target.value);
                setShowPasswordStrenghts(true);
              }}
            required
          />
          <span className="toggle-icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={20} color="gold" /> : <Eye size={20} color="gold" />}
          </span>
        </div>
        { getPasswordStrengths && newPassword.length>0? <div className={`password-strength ${getPasswordStrength().toLowerCase()}`}>
            Password Strength: {getPasswordStrength()}
          </div>:""}
        <button type="submit" className="btn-primary">Update Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
