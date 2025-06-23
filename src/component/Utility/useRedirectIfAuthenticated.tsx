import { useEffect } from 'react';
import { useAppSelector } from '../../store/hook'; 
import { useNavigate } from 'react-router-dom';

const useRedirectIfAuthenticated = () => {
   const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);;
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home'); // or whatever your home/dashboard route is
    }
  }, [isAuthenticated, navigate]);
};

export default useRedirectIfAuthenticated;
