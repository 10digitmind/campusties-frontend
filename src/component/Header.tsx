import React, { useEffect, useRef, useState } from 'react';
import '../styles/header.css'
import { useNavigate } from 'react-router-dom';
import { useAppSelector ,useAppDispatch} from '../store/hook'; 
import { logout} from '../Redux/Slices/userSlices'; 
import {  getUserILiked, getUsersWhoLikedMe, fetchMatches, getProfileView } from '../Redux/Slices/Thunks/userThunks';
import { setLikedCount,setLikedMeCount } from '../Redux/Slices/Thunks/likesSlice';
import { getSocket } from './Utility/socketutility/Socket';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Socket } from 'socket.io-client';



const Header: React.FC = () =>{

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [totalLikes, setTotalLikes] = useState<number>(0)
  const [totalMatches, setTotalMatches] = useState<number>(0)
  const [totalView, setTotalView] = useState<number>(0)
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch()
  const toggleDropdown = () => setDropdownOpen(prev => !prev);
  const toggleMenu = () => setMenuOpen(prev => !prev);

  const navigate = useNavigate()
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
const user = useAppSelector((state) => state.user.user);



const matches = useAppSelector((state) => state.user.matches);
const viwedProfile = useAppSelector((state) => state.user.viewers);





const token = localStorage.getItem('token')




useEffect(() => {
  
}, [dispatch]);



useEffect(()=>{

    if(token){

       dispatch(getUserILiked())
        dispatch(getUsersWhoLikedMe())
        dispatch(fetchMatches())
        dispatch(getProfileView(user?._id))
       
    }
    

},[token, dispatch,user?._id])

const likeUpdate = () => {
  const trySubscribe = () => {
    const socket = getSocket();

    if (!socket || !socket.connected) {
      console.log("⏳ Waiting for socket connection...");
      setTimeout(trySubscribe, 500); // retry after 500ms
      return;
    }

    socket.on("countsUpdated", ({ total ,matches}) => {
    
      setTotalLikes(total);
      setTotalMatches(matches)
    });


    socket.on("profileViewsUpdated", ({ count}) => {
    
      setTotalView(count)
    });

    console.log("✅ Subscribed to likesCountsUpdated");
  };

  trySubscribe();
};

useEffect(() => {
 
  const getLikeCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        'http://localhost:5000/api/get-likes-counts',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if(res.data){
        setTotalLikes(res.data.total);
        setTotalMatches(res.data.matchCount)
        setTotalView(res.data.profileViewCount)
      }
    
    } catch (error) {
      console.error("getting likes count failed:", error);
    }
  };

  // Initial fetch
  if (token){
    getLikeCount();
    likeUpdate()
  } 

  if (!token) return;
  





}, [token]);


 
  


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setMenuOpen(false)
  };
  return (
    <header className="header">
      <div onClick={()=>navigate('/home')} className="logo">
        <span className="logo-bold">Campus</span>
        <span className="logo-gold">Ties</span>
      </div>

      <div className="burger" onClick={toggleMenu}>
        <div className={`line ${menuOpen ? 'open' : ''}`} />
        <div className={`line ${menuOpen ? 'open' : ''}`} />
        <div className={`line ${menuOpen ? 'open' : ''}`} />
      </div>

      <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
        {!isAuthenticated ? (
          <>
            <a href="/">Home</a>
            <a href="/explore">Explore</a>
            <a href="/how-it-works">How it Works</a>
            <a href="/login" className="cta-button">Login</a>
          </>
        ) : (
          <>
            <div className="header-profile-container" ref={dropdownRef}>
  {user?.profilePhoto ? (
    <img
      src={user.profilePhoto}
      alt="Profile"
      className="profile-image"
      onClick={toggleDropdown}
    />
  ) : (
    <div className="profile-image" onClick={toggleDropdown} style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#bfa041',
      color: 'black',
      fontWeight: 'bold',
      fontSize: '18px',
      borderRadius: '50%',
      cursor: 'pointer',
      userSelect: 'none',
      width: '50px',
      height: '50px',
    }}>
      {user?.userName?.slice(0, 2).toUpperCase() || 'NA'}
    </div>
  )}
  {dropdownOpen && (
    <div className="profile-dropdown">
      <p onClick={() => navigate('/myprofile')} className="dropdown-item">My Profile</p>
      <p className="dropdown-item">Settings</p>
      <p onClick={handleLogout} className="dropdown-item">Logout</p>
    </div>
  )}
</div>

            <a href="/who-liked-me" className="likes-link">❤️ Likes<span className='count'>{totalLikes}</span></a>
            <a href="/matches" className="matches-link">
    💕 Matches <span className="count">{totalMatches}</span>
  </a>
  
  
  <a href="/who-viewed-me" className="messages-link">
  👁️ Viewed me <span className="count">{totalView}</span>
</a>
  <a href="/messages" className="messages-link">
    💬 Messages <span className="count">1</span>
  </a>
  <a href="/spin" className="spin-link">🎰 Spin</a>

          </>
        )}
      </nav>
    </header>
  );
};

export default Header;