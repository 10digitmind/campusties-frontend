import React, { useEffect, useRef, useState } from 'react';
import '../styles/header.css'
import { useNavigate } from 'react-router-dom';
import { useAppSelector ,useAppDispatch} from '../store/hook'; 
import { logout, } from '../Redux/Slices/userSlices'; 
import {  getUserILiked, getUsersWhoLikedMe, fetchMatches, getProfileView } from '../Redux/Slices/Thunks/userThunks';

const Header: React.FC = () =>{

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [totalLikes, setTotalLikes] = useState<number>(0)
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch()
  const toggleDropdown = () => setDropdownOpen(prev => !prev);
  const toggleMenu = () => setMenuOpen(prev => !prev);

  const navigate = useNavigate()
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
const user = useAppSelector((state) => state.user.user);
const userILiked =useAppSelector((state) => state.user.userILiked);
const getUsersWhoLikedMeToo =useAppSelector((state) => state.user.getUsersWhoLikedMe);
const matches = useAppSelector((state) => state.user.matches);
const viwedProfile = useAppSelector((state) => state.user.viewers);
const token = localStorage.getItem('token')

useEffect(()=>{

    if(token){

       dispatch(getUserILiked())
        dispatch(getUsersWhoLikedMe())
        dispatch(fetchMatches())
        dispatch(getProfileView(user?._id))
       
    }
},[token, dispatch,user?._id])

;





useEffect(() => {
    const likedCount = userILiked?.length || 0;
    const likedMeCount = getUsersWhoLikedMeToo?.length || 0;
    setTotalLikes(likedCount + likedMeCount);

  }, [userILiked, getUsersWhoLikedMeToo,matches]);
  
  


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
    💕 Matches <span className="count">{matches?.length}</span>
  </a>
  
  
  <a href="/who-viewed-me" className="messages-link">
  👁️ Viewed me <span className="count">{viwedProfile?.length}</span>
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