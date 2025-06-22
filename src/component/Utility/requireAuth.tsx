// utils/requireAuth.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {  useAppSelector } from '../../store/hook';  // adjust path if needed

export const useRequireAuth = () => {
  const navigate = useNavigate();
     const user = useAppSelector(state => state.user.user);
     const token = localStorage.getItem('token')
  
  useEffect(() => {
    if (!user && !token) {
      navigate('/login'); // or '/auth/login'
    }
  }, [user, navigate,token]);

  return user;
};
