import React, { useEffect,useState } from 'react';
import { useAppSelector } from '../store/hook';
import { useNavigate } from 'react-router-dom';
import { useRequireAuth } from './Utility/requireAuth';
import Chat from './Chat';
 // assuming you already use this

const Matches: React.FC = () => {
    useRequireAuth()
const matches = useAppSelector((state) => state.user.matches);
  const loading = useAppSelector((state) => state.user.loading);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const navigate = useNavigate();

  if (loading) {
    return (
      <p style={{ backgroundColor: 'black', width: "100%", height: "100vh", color: "white", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading...
      </p>
    );
  }
 function calculateAge(dob: string | Date): number {
    const birthDate = new Date(dob);
    const diff = Date.now() - birthDate.getTime();
    const ageDt = new Date(diff);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  }
  
 
  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '2rem 1rem',
        backgroundColor: '#f9f9f9',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Your Matches 💖</h2>
        <p style={{ fontSize: '1rem', color: '#555' }}>
          These are users who liked you back — a perfect match! Start a conversation now.
        </p>
      </div>
  
      {(!matches || matches.length === 0) ? (
        <p style={{ textAlign: 'center', color: '#888' }}>No matches found.</p>
      ) : (
        <div
          className="matches-container"
          style={{
            display: 'grid',
            gap: '1.5rem',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          }}
        >
          {matches.map((match) => {
            const user = match.otherUser;
            const date = new Date(match.matchedAt).toLocaleString();
  
            return (
              <div
                key={match._id}
                className="match-card"
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '10px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 8px black',
                  transition: 'transform 0.2s',
                  cursor: 'pointer',
                }}
                onClick={() => navigate(`/view-profile/${user._id}`)}
              >
                <img
                  src={user.profilePhoto}
                  alt={`${user.userName}'s profile`}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginBottom: '1rem',
                    border: '2px solid gold',
                  }}
                />
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ margin: 0 }}>
                    {user.userName}
                    {user.dateOfBirth && (
                      <span> ({calculateAge(user.dateOfBirth)} yrs)</span>
                    )}
                  </h3>
                  <p style={{ margin: '0.25rem 0', color: '#666' }}>
                    {user.gender} &bull; {user.institution}
                  </p>
                  <small style={{ color: '#999' }}>Matched on {date}</small>
                </div>
  
              {match.isActive?  <button
               onClick={(e) => {
                e.stopPropagation(); // ✅ stops navigation to profile
                setSelectedUserId(user._id); // ✅ opens chat
              }}

                  style={{
                    marginTop: '1rem',
                    padding: '0.5rem 1.2rem',
                    backgroundColor: '#000',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                >
                  💬 Chat
                </button>:<h5 style={{color:"gold"}}>No longer a match cant chat</h5>}
              </div>
              
            );
          })}
        </div>
        
      )}
      {selectedUserId && (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    }}
    onClick={() => setSelectedUserId(null)}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        background: '#fff',
        borderRadius: '10px',
        padding: '1rem',
        width: '95%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative',
      }}
    >
      <button
        onClick={() => setSelectedUserId(null)}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          background: 'transparent',
          border: 'none',
          fontSize: '1.5rem',
          cursor: 'pointer',
        }}
      >
        ×
      </button>

      <Chat OtherUserId={selectedUserId} />
    </div>
  </div>
)}

    </div>
  );
  
};

export default Matches;
