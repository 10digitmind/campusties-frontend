import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/hook'; // adjust path

export const useRequireOnBoarding = () => {
  const user = useAppSelector(state => state.user.user);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token')

  useEffect(() => {

    if (user && !user.hasCompletedOnboarding && token && location.pathname !== '/onboarding') {
      navigate('/onboarding');
    }
  }, [user, navigate, location,token]);

  return user;
};
