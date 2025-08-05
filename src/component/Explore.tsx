// Explore.tsx
import React, { use, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import '../styles/explore.css';
import ExploreFilter from './Explorefilter';
import { useAppDispatch, useAppSelector } from '../store/hook'; 
import { getAllUser} from '../Redux/Slices/Thunks/userThunks'; 
import { LikeItem,  UserPublicProfile,SlimUser } from './AppTypes/User';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getSocket } from './Utility/socketutility/Socket';




const Explore: React.FC = () => {
    const [localUsers, setLocalUsers] = useState<UserPublicProfile[]>([]);
    const [loading, setLoading] = useState<Boolean>(true)
    const [likedUser, setLikedUser] = useState<{ [key: string]: boolean }>({});
   
    const dispatch = useAppDispatch();
  
    const allUsers = useAppSelector(state => state.user.getEveryUsers);
    const currentUser = useAppSelector(state => state.user.user);
  
    const userILiked =useAppSelector((state) => state.user.userILiked);
    const likedUserIds = useAppSelector((state) => state.likes.likedUserIds);
    const token = localStorage.getItem('token')

    const navigate=useNavigate()

    useEffect(() => {
     
        dispatch(getAllUser());
        setLoading(false)
      
    }, [dispatch,token,currentUser]);


  // Map the _ids of liked users into an object for fast lookup
  useEffect(() => {
    if (userILiked) {
      const likedMap: { [key: string]: boolean } = {};
      userILiked.forEach((item) => {
        likedMap[item.likedUser?._id] = true;
      });
      setLikedUser(likedMap);
    }
  }, [userILiked]);
  

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
      setLikedUser((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
      
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please log in to like a user");
          return;
        }
    
        const socket = getSocket();
        if (!socket || !socket.connected) {
          toast.error("Socket not connected");
          return;
        }
    
        // Emit the like event to backend via socket
        socket.emit("like", { likedUserId: id });
    
        // Optionally: listen to a socket response for confirmation or updated data
        // and dispatch setUserILiked/setUsersWhoLikedMe if needed for syncing full data.
    
      } catch (error) {
        console.error("Like toggle failed:", error);
    
        // Revert optimistic update if error
       
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
                      key={`${user?._id}-${index}`}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <div onClick={() => navigateViewProfilw(user?._id)} className="student-image">
                        <img
                          src={user?.profilePhoto || "/default-avatar.png"}
                          alt={`Profile of ${user?.userName}`}
                        />
                        <span
                          className={`status-badge ${
                            user?.isOnline ? "online" : "offline"
                          }`}
                        />
                        {user?.isSubscribed && (
                          <span className="subscribed-badge">Boss</span>
                        )}
                      </div>
                      <div  onClick={() => navigateViewProfilw(user?._id)} className="student-info">
                        <h3>{user.userName}</h3>
                        {user.dateOfBirth && (
    <span style={{ fontWeight: "bold", color: "#777", marginLeft: "6px" }}>
      {calculateAge(user.dateOfBirth)} year old
    </span>
  )}
                        <p>🎓 {user.institution || "No institution provided"}</p>
                        <p>
                          💬 Looking for:{" "}
                          <strong style={{color:"#bfa237"}}>{user?.lookingFor}</strong>
                        </p>
                        <p>🎓 {user?.isGraduate ? "Graduate" : "Student"}</p>
                      </div>
                      <button
  type="button"
  className={`like-button ${likedUser[user?._id] ? "liked" : ""}`}
  onClick={() => toggleLike(user?._id)}
  style={{
    backgroundColor: likedUser[user?._id] && token ? 'gold' : 'white',
  }}
>
{likedUser[user?._id] && token ? "💛 Liked" : "🤍 Like"}

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
