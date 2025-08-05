import React from 'react';
import { useAppSelector ,useAppDispatch} from '../store/hook'; 
import { profileView } from './AppTypes/User';
import { useNavigate } from 'react-router-dom';
import { useRequireAuth } from './Utility/requireAuth';


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


  
  const WhoViewedMe: React.FC = () => {
    useRequireAuth()
    // Selectors from Redux or state management with correct type annotation
    const viewedProfiles = useAppSelector((state): profileView[]| null => state.user.viewers);
    const loading = useAppSelector((state) => state.user.loading);
    const navigate = useNavigate()

  
    if (loading) {
    
      return <p style={{backgroundColor:'black',width:"100%", height:"100vh", color:"white", display:'flex',alignItems:'center',justifyContent:'center'}}>Loading...</p>;
    }
  
    if (!viewedProfiles || viewedProfiles.length === 0) {
      return<div style={{height:'50vh', display:"flex",justifyContent:'center',alignItems:'center'}}>
<p style={{color:"white"}}>No one has viewed your profile yet.</p>;
      </div> 
    }
  
    return (
        <div style={{ height: '100vh', padding: '1rem' }}>
          <h2 style={{ marginBottom: '0.5rem' }}>Who Viewed You</h2>
          <p style={{ color: '#555', marginBottom: '1.5rem' }}>
            These users have recently viewed your profile.
          </p>
      
          {(!viewedProfiles || viewedProfiles.length === 0) ? (
            <p>No one has viewed your profile yet.</p>
          ) : (
            <div
              className="viewers-container"
              style={{
                display: 'grid',
                gap: '1rem',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                marginTop: '1rem',
              }}
            >
              {viewedProfiles.map(({ viewer, viewedAt, _id }) => {
                const viewedDate = viewedAt
                  ? new Date(viewedAt).toLocaleString()
                  : 'Unknown';
      
                return (
                  <div
                    key={_id}
                    className="viewer-card"
                    style={{
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      padding: '1rem',
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'center',
                      backgroundColor: '#fff',
                      cursor: 'pointer',
                      transition: 'box-shadow 0.2s ease-in-out',
                    }}
                    onClick={() => navigate(`/view-profile/${viewer?._id}`)}
                    onMouseEnter={(e) =>
                      ((e.currentTarget.style.boxShadow =
                        '0 4px 12px rgba(0,0,0,0.1)'))
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget.style.boxShadow = 'none'))
                    }
                  >
                    <img
                      src={viewer?.profilePhoto}
                      alt={`${viewer?.userName}'s profile`}
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid gold',
                      }}
                    />
                    <div>
                      <h3 style={{ margin: 0 }}>
                        {viewer?.userName}
                        {viewer?.dateOfBirth && (
                          <span> ({calculateAge(viewer?.dateOfBirth)} yrs old)</span>
                        )}
                      </h3>
                      <p style={{ margin: '0.25rem 0', color: '#444' }}>
                        {viewer?.gender} &bull; {viewer?.institution}
                      </p>
                      <small style={{ color: '#888' }}>Viewed on {viewedDate}</small>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
      
  };
  
  export default WhoViewedMe;