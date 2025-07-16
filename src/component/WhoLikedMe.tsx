import React, { useState } from 'react';
import { useAppSelector } from '../store/hook';
import { useNavigate } from 'react-router-dom';
import { LikeItem, SlimUser } from './AppTypes/User';
import { useRequireAuth } from './Utility/requireAuth';
// Ensure this contains user fields like userName, profilePhoto, etc.

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

// Optional: define types if not already


const WhoLiked: React.FC = () => {
    useRequireAuth()
 const userILiked =useAppSelector((state) => state.user.userILiked);
 const getUsersWhoLikedMeToo =useAppSelector((state) => state.user.getUsersWhoLikedMe);


  const loading = useAppSelector((state) => state.user.loading);

  const [activeTab, setActiveTab] = useState<'liked' | 'likedMe'>('liked');
  const navigate = useNavigate();

  const usersToShow = activeTab === 'liked' ? userILiked : getUsersWhoLikedMeToo;

  if (loading) {
    return (
      <p style={{ backgroundColor: 'black', width: "100%", height: "100vh", color: "white", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading...
      </p>
    );
  }

  return (
    <div style={{ height: '100vh', padding: '1rem' }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button
          onClick={() => setActiveTab('liked')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: activeTab === 'liked' ? ' #eee ' : '#000',
            color: activeTab === 'liked' ? ' #000' : '#fff',
            border: 'none',
            borderRadius: '5px',
             cursor:'pointer'
          }}
        >
          Who I Liked
        </button>
        <button
          onClick={() => setActiveTab('likedMe')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: activeTab === 'liked' ? '#000' : '#eee',
            color: activeTab === 'liked' ? '#fff' : '#000',
            border: 'none',
            borderRadius: '5px',
            cursor:'pointer'
          }}
        >
          Who Liked Me
        </button>
      </div>

      {(!usersToShow || usersToShow.length === 0) ? (
        <p style={{color:"white"}}>No users found in this section.</p>
      ) : (
        <div
          className="likes-container"
          style={{
            display: 'grid',
            gap: '1rem',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          }}
        >
          {usersToShow.map((like) => {
            const person: SlimUser = activeTab === 'liked' ? like.likedUser! : like.liker!;
            const date = new Date(like.likedAt).toLocaleString();

            return (
              <div
                key={like._id}
                className="like-card"
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '1rem',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                  cursor: 'pointer'
                }}
                onClick={() => navigate(`/view-profile/${person._id}`)}
              >
                <img
                  src={person.profilePhoto}
                  alt={`${person.userName}'s profile`}
                  style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h3 style={{ margin: 0 }}>
                    {person.userName}
                    {person.dateOfBirth && (
                      <span> ({calculateAge(person.dateOfBirth)} yrs old)</span>
                    )}
                  </h3>
                  <p style={{ margin: '0.25rem 0' }}>
                    {person.gender} &bull; {person.institution}
                  </p>
                  <small style={{ color: '#666' }}>
                    {activeTab === 'liked' ? 'Liked on' : 'Liked you on'} {date}
                  </small>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WhoLiked;
