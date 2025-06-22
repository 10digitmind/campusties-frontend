// Explore.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import '../styles/explore.css';
import ExploreFilter from './Explorefilter';
import { useAppDispatch, useAppSelector } from '../store/hook'; 
import { getAllUser,likeUser} from '../Redux/Slices/Thunks/userThunks'; 
import { UserData, UserPublicProfile } from './AppTypes/User';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';




const Explore: React.FC = () => {
    const [localUsers, setLocalUsers] = useState<UserPublicProfile[]>([]);
    const [loading, setLoading] = useState<Boolean>(true)
    const dispatch = useAppDispatch();
  
    const allUsers = useAppSelector(state => state.user.getEveryUsers);
    const currentUser = useAppSelector(state => state.user.user);
  
    const userILiked =useAppSelector((state) => state.user.userILiked);

    const token = localStorage.getItem('token')

    const navigate=useNavigate()

    useEffect(() => {
      dispatch(getAllUser());
      setLoading(false)
    }, [dispatch]);
  
    useEffect(() => {

      if (!Array.isArray(allUsers)) return;
    
      if (currentUser?._id) {
        const filtered = allUsers.filter(user => user._id !== currentUser._id);
      
        setLocalUsers(filtered);
      } else {
        setLocalUsers(allUsers); // show all if no user is logged in
      }
    
    }, [allUsers, currentUser]);
    

    


  
    const toggleLike = async (id: string) => {
        try {

          const token = localStorage.getItem('token')
          if(!token){
            toast.error('please log in to like user')
            return
          }
          const resultAction = await dispatch(likeUser(id));
          if (likeUser.fulfilled.match(resultAction)) {
            setLocalUsers(prev =>
              prev.map(user =>
                user._id === id ? { ...user, liked: !user.liked } : user
              )
            );
          } else {
            console.error("Failed to toggle like.");
          }
        } catch (error) {
          console.error("Error toggling like:", error);
        }
      };

      const calculateAge = (dob: string | Date | undefined | null): number | null => {
        if (!dob) return null;
      
        const birthDate = new Date(dob);
        const today = new Date();
      
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
      
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
      
        return age;
      };
      
      function navigateViewProfilw(userId:string){

        if(!token){
          toast.error('Log in to view profile')
          return
        }else{
          navigate(`/view-profile/${userId}`)
        }
      }
      
  
    return (
        <div>
          <ExploreFilter
            onApply={filters => {
              console.log('Applied filters:', filters);
            }}
          />
          <div className="explore-container">
            <h2>Explore Students</h2>
      
            {loading ? (
              <div className="loading-con">
                <p className="loading-text">loading...</p>
              </div>
            ) : (
              <div className="students-grid">
                {localUsers.length === 0 ? (
                  <p className="no-users-text">No users available to show.</p>
                ) : (
                  localUsers.map((user, index) => (
                    <motion.div
                      className="student-card"
                      key={`${user._id}-${index}`}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <div onClick={() => navigateViewProfilw(user._id)} className="student-image">
                        <img
                          src={user.profilePhoto || "/default-avatar.png"}
                          alt={`Profile of ${user.userName}`}
                        />
                        <span
                          className={`status-badge ${
                            user.isOnline ? "online" : "offline"
                          }`}
                        />
                        {user.isSubscribed && (
                          <span className="subscribed-badge">Boss</span>
                        )}
                      </div>
                      <div  onClick={() => navigateViewProfilw(user._id)} className="student-info">
                        <h3>{user.userName}</h3>
                        {user.dateOfBirth && (
    <span style={{ fontWeight: "bold", color: "#777", marginLeft: "6px" }}>
      {calculateAge(user.dateOfBirth)} year old
    </span>
  )}
                        <p>🎓 {user.institution || "No institution provided"}</p>
                        <p>
                          💬 Looking for:{" "}
                          <strong style={{color:"#bfa237"}}>{user.lookingFor}</strong>
                        </p>
                        <p>🎓 {user.isGraduate ? "Graduate" : "Student"}</p>
                      </div>
                      <button
                        type="button"
                        className={`like-button ${user.liked ? "liked" : ""}`}
                        onClick={(e) => {
                           
                            toggleLike(user._id);
                          }}
                        
                      >
                {userILiked?.some(u => u._id === user._id) ? "💛 Liked" : "🤍 Like"}

                      </button>
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      );
      
  };
  
  export default Explore;
