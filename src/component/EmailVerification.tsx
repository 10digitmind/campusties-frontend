import React, { useEffect, useState } from 'react';
import {  useNavigate,useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { verifyEmail } from '../Redux/Slices/Thunks/userThunks';
import '../styles/verifyEmail.css';

const EmailVerification: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
  
    const { loading, error } = useAppSelector((state) => state.user);
    const [successMsg, setSuccessMsg] = useState('');
  
    useEffect(() => {
      const verifyEmailToken = async () => {
        if (token) {
          const resultAction = await dispatch(verifyEmail({ token }));
 
          if (verifyEmail.fulfilled.match(resultAction)) {
            setSuccessMsg(resultAction.payload.message);
          }
        }
      };
  
      verifyEmailToken();
    }, [dispatch, token]);
  
   
    return (
      <div style={{height:'35vh',marginTop:'60px', marginBottom:"60px"}}className="verify-email-container">
        <h2>Email Verification</h2>
  
        {loading && <p className="info-text">Verifying your email...</p>}
  
        {error && <p className="error-text">⚠️ {error}</p>}
  
        {successMsg && (
          <>
            <p className="success-text">✅ {successMsg}</p>
            <button className="btn-primary" onClick={() => navigate('/login')}>
              Go to Login
            </button>
          </>
        )}
  
        {!token && <p className="error-text">No verification token provided.</p>}
      </div>
    );
  };
  
  export default EmailVerification;
