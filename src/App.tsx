import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SocketProvider } from "../src/component/Utility/socketutility/SocketContext";
import Home from './component/Home';
import Login from './component/Login';

import SignUp from './component/Signup';
import Explore from './component/Explore';
import SplashScreen from './component/Splashscreen';
import MainLayout from './component/Mainlayout';

import EmailVerification from './component/EmailVerification';
import DetectedNewDevice from './component/DetectedNewDevice';
import SignupSuccess from './component/SignupSuccess';
import ForgotPassword from './component/ForgotPassword';
import ResetPassword from './component/ResetPassword';
import { ToastContainer } from 'react-toastify';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../src/store/hook'; 
import { getUser } from '../src/Redux/Slices/Thunks/userThunks'; 
import FirstOnboarding from './component/FirstOnboarding';
import ProfileDetails from './component/ProfileDetails';
import useAutoLogout from './component/Utility/useAutoLogOut';
import { logout, } from '../src/Redux/Slices/userSlices';
import { useRequireOnBoarding } from './component/Utility/useRequireOnBoarding';
import ViewUserProfile from './component/ViewUserProfile';
import WhoViewedMe from './component/WhoViewedMe';
import WhoLiked from './component/WhoLikedMe';
import Matches from './component/Matches';
import { UserData } from './component/AppTypes/User';
import Chat from './component/Chat';





const token = localStorage.getItem('token');


function App() {
  const user = useRequireOnBoarding();
  useAutoLogout()

const dispatch = useAppDispatch();
const [localUsers, setLocalUsers] = useState<UserData[]>([]);








  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(getUser());
    } else {
    
      dispatch(logout()); // optional: clear user state
    }
  }, [dispatch]);
  return (
    <>
 <ToastContainer
  position="top-center"
  autoClose={3000}
  hideProgressBar={false}
  closeOnClick
  pauseOnFocusLoss
  draggable
  pauseOnHover
 theme="dark"
/>

<SocketProvider token={token!}>
      <Routes>
        {/* Splash route (no header/footer) */}
        <Route path="/" element={<SplashScreen />} />

        {/* All other routes (with Header & Footer) */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/email-verification/:token" element={<EmailVerification />} />
          <Route path="/dectected-new-device/:email" element={<DetectedNewDevice />} />
          <Route path="/signup-success" element={<SignupSuccess />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/onboarding" element={<FirstOnboarding />} />
          <Route path="/myprofile" element={<ProfileDetails />} />
          <Route path="/view-profile/:id" element={<ViewUserProfile />} />
          <Route path="/who-viewed-me" element={<WhoViewedMe />} />
          <Route path="/who-liked-me" element={<WhoLiked />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/chat/:OtherUserId" element={<Chat/>} />
        </Route>
      </Routes>
      </SocketProvider>

    </>
  );
}

export default App;