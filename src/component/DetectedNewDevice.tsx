import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from '../store/hook'; 
import { verifyNewDevice,getUser ,getUserILiked,getUsersWhoLikedMe,fetchMatches} from '../Redux/Slices/Thunks/userThunks'; 
import axios from 'axios';
import '../styles/newdevice.css';

const DetectedNewDevice: React.FC = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { email } = useParams<{ email: string }>(); // typed param
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Email parameter is missing.');
      return;
    }

    try {
      const result = await dispatch(verifyNewDevice({ code, email }));

      if (verifyNewDevice.fulfilled.match(result)) {
        dispatch(getUser())
         dispatch(getUserILiked())
            dispatch(getUsersWhoLikedMe())
            dispatch(fetchMatches())
            
        setSuccess('Device verified. Redirecting...');
      
          navigate('/explore');
    
      } else {
        setError(result.payload || 'Verification failed');
      }
    } catch {
      setError('Verification failed');
    }
  };

  const handleResend = async () => {
    try {
      await axios.post('/api/resend-device-code', { email });
      setSuccess('New code sent.');
      setError('');
    } catch {
      setError('Failed to resend code.');
      setSuccess('');
    }
  };

  return (
    <div className="verify-email-container">
      <h2>New Device Detected</h2>

      <p className="info-text">Enter the 6-digit code sent to your email or phone.</p>

      {error && <p className="error-text">{error}</p>}
      {success && <p className="success-text">{success}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="code"
          placeholder="6-digit code"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          pattern="\d{6}"
          title="Please enter a 6-digit code"
        />

        <button type="submit" className="btn-primary">Verify</button>
      </form>

      <p className="info-text" style={{ marginTop: '1rem' }}>
        Didn’t get a code?{' '}
        <span onClick={handleResend} style={{ cursor: 'pointer', color: 'gold' }}>
          Resend
        </span>
      </p>
    </div>
  );
};

export default DetectedNewDevice;
