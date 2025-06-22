import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/hook'; // adjust path

export const useRequireOnBoarding = () => {
  const user = useAppSelector(state => state.user.user);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token')

  useEffect(() => {

    if (user && !user.hasCompletedOnboarding  && location.pathname !== '/onboarding' ) {
      navigate('/onboarding');
      console.log(user)
    }
  }, [user, navigate, location]);

  return user;
};
