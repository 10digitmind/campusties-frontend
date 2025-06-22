import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/signupsuccess.css'; // Optional: Create this for styling

const SignupSuccess: React.FC = () => {
  const navigate = useNavigate();
 const email = sessionStorage.getItem('signupEmail');
  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="signup-success-container">
      <h2>🎉 Welcome to Thriftify!</h2>

      <p className="info-text">
        Your account has been created successfully.
      </p>

      <p className="info-text">
        Please check your <strong style={{color:"gold"}}>email inbox {email}</strong> (or <strong>spam</strong>) to confirm your email address before logging in.
      </p>

      <button onClick={handleGoToLogin} className="btns-primary" style={{ marginTop: '1.5rem' }}>
        Go to Login
      </button>
    </div>
  );
};

export default SignupSuccess;
