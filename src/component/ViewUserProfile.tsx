import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserData } from './AppTypes/User';
import { useParams } from 'react-router-dom';
import '../styles/viewprofile.css'

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

  const token = localStorage.getItem('token')


  
  const ViewUserProfile = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalPhoto, setModalPhoto] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const { id } = useParams();

  const handleLike = (userId: string | undefined) => {

    // Optional: Trigger API call here
  };
  
  const handleSendGift = (userId: string | undefined ) => {
    console.log(`Send gift to user ${userId}`);
    // Optional: Show gift modal
  };
  
  const handleMessage = (userId: string | undefined) => {
    console.log(`Open chat with user ${userId}`);
    // Optional: Navigate to chat
  };
  
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/view-user-profile/${id}`);
        setUser(res.data);
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);


  useEffect(() => {
    const profileView = async () => {
      try {
        const res = await axios.post(
          `http://localhost:5000/api/create-profile-viewers/${id}`,
          {}, // empty body since you don't seem to send any data
          {
            headers: {
              Authorization: `Bearer ${token}`  // note the space after 'Bearer'
            }
          }
        );
     
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    };
    profileView()
   
  },[id]);
  




  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div className="user-profile">
      <img className="profile-photo" src={user.profilePhoto || "/default-avatar.png"} alt="Profile" />
      <h2>
        {user.fullName} {user.dateOfBirth && <span>({calculateAge(user.dateOfBirth)} yrs)</span>}
      </h2>
      <div className="action-buttons" style={{ margin: "0.5rem 0" }}>
  <button className="action-button like" onClick={() => handleLike(user._id)}>
    ❤️ Like
  </button>
  <button className="action-button gift" onClick={() => handleSendGift(user._id)}>
    🎁 show workings
  </button>
  <button className="action-button gift" onClick={() => handleMessage(user._id)}>
    💬 chat
  </button>
</div>
      <p className="username">@{user.userName}</p>
      <p>🎓 {user.institution}</p>
      {user.isGraduate && (
        <>
          <p>
            🎓 Graduate of {user.graduateCourse} from {user.graduateSchool}
          </p>
          <p>💼 {user.currentJob}</p>
        </>
      )}
      <p>📖 Bio: {user.bio || "No bio yet."}</p>
      <p>💬 Looking for: {user.lookingFor}</p>
      <div>
        <h4>Interests:</h4>
        <ul>
          {user.interests?.map((interest, idx) => (
            <li key={idx}>{interest}</li>
          ))}
        </ul>
      </div>
      <div className="gallery">
        <h4>Gallery:</h4>
        {user.photos && user.photos.length > 0 ? (
          user.photos.map((photo, i) => (
            <img
              key={i}
              className="gallery-photo"
              src={photo}
              alt={`gallery-${i}`}
              onClick={() => setCurrentIndex(i)}
              role="button"
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === "Enter") setModalPhoto(photo);
              }}
            />
          ))
        ) : (
          <p>No gallery photos yet.</p>
        )}
      </div>

      {currentIndex !== null && (
  <div
    className="modal"
    onClick={() => setCurrentIndex(null)}
    role="dialog"
    aria-modal="true"
  >
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <button
        className="modal-close"
        onClick={() => setCurrentIndex(null)}
        aria-label="Close"
      >
        &times;
      </button>

      <img
  src={user?.photos?.[currentIndex]}
  alt={`Photo ${currentIndex! + 1}`}
  className="modal-image"
/>

      {user.photos && user.photos.length >  1 && (
        <>
          <button
            className="nav-button prev"
            onClick={() =>
              setCurrentIndex((prev) =>
                (prev! - 1 + user!.photos!.length) % user!.photos!.length
              )
            }
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            className="nav-button next"
            onClick={() =>
              setCurrentIndex((prev) => (prev! + 1) % user!.photos!.length)
            }
            aria-label="Next"
          >
            ›
          </button>
        </>
      )}
    </div>
  </div>
)}

    </div>
  );
};



  export default ViewUserProfile;