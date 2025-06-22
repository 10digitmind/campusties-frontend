import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const AUTO_LOGOUT_TIME = 1000 * 60 * 30; // 30 minutes

const useAutoLogout = () => {
 
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const logoutUser = () => {
    localStorage.removeItem('token');
    // Clear any other persisted user data
   navigate('/login')
  };

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(logoutUser, AUTO_LOGOUT_TIME);
  };

  useEffect(() => {
    // Watch user activity
    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];

    events.forEach(event => window.addEventListener(event, resetTimer));

    resetTimer(); // Initialize timer on mount

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
};

export default useAutoLogout;
