import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Profile.css';
import { useAppSelector } from '../store/hook'; 
import { UserData } from './AppTypes/User';
import { useRequireAuth } from './Utility/requireAuth';
import { GallerySection } from './GallerySection';
import { toast } from 'react-toastify';

const INTEREST_OPTIONS = [
  "Music",
  "Movies",
  "Travel",
  "Books",
  "Fitness",
  "Gaming",
  "Tech",
  "Fashion",
  "Food",
  "Art",
  "Sports",
  "Nature",
  "Spirituality",
  "Volunteering",
  "Politics",
  "Science"
];

const API_URL =process.env.REACT_APP_BACKEND_URL;
const ProfileDetails = () => {
  useRequireAuth()
  const [user, setUser] = useState<UserData | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedProfilePhotoFile, setSelectedProfilePhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [newPhotos, setNewPhotos] = useState<File[]>([]);
  

  const localuser = useAppSelector((state) => state.user.user);
  const users = useRequireAuth(); // Handles redirect if not authenticated

  useEffect(() => {
    if (localuser) setUser(localuser);
  }, [localuser]);

  if (!users || !user) return <div className="profile-container">Loading...</div>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUser(prev => prev ? { ...prev, [name]: value } : prev);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prev => prev ? { ...prev, location: { ...prev.location, [name]: value } } : prev);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedProfilePhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSuccessMsg('');

    try {
     // ✅ LIMIT TO 8 TOTAL IMAGES
    if ((user?.photos?.length || 0) + newPhotos.length > 8) {
      toast.error('You can only upload a total of 8 gallery images');
      setLoading(false);
      return;
    }
      let profilePhotoUrl = user?.profilePhoto;
      let galleryPhotos = user?.photos || [];

      // Upload new profile photo
      if (selectedProfilePhotoFile) {
        const { data } = await axios.get(`${API_URL}/imagekit-auth`);
        const { token, expire, signature } = data;

        const form = new FormData();
        form.append("file", selectedProfilePhotoFile);
        form.append("fileName", `${user._id}-profile-photo`);
        form.append("publicKey", `${process.env.REACT_APP_IMAGE_KEY}`);
        form.append("signature", signature);
        form.append("expire", expire);
        form.append("token", token);

        const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
          method: "POST",
          body: form,
        });

        const uploadedData = await uploadRes.json();

        profilePhotoUrl = uploadedData.url;
      }

      // Upload new gallery photos
      const newGalleryPhotos: string[] = [];

      for (const newUplaod of newPhotos ) {
        const { data } = await axios.get(`${API_URL}/imagekit-auth`);
        const { token, expire, signature } = data;

        const form = new FormData();
        form.append("file", newUplaod);
        form.append("fileName", `${user._id}-gallery-${Date.now()}`);
        form.append("publicKey",`${process.env.REACT_APP_IMAGE_KEY}`);
        form.append("signature", signature);
        form.append("expire", expire);
        form.append("token", token);

        const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
          method: "POST",
          body: form,
        });

        const uploadedData = await uploadRes.json();
   


    if (!uploadRes.ok) {
      continue;
    }
        newGalleryPhotos.push(uploadedData.url);
      }

      galleryPhotos = [...galleryPhotos, ...newGalleryPhotos];

      const updatedUserData = {
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        institution: user.institution,
        department: user.department,
        course: user.course,
        level: user.level,
        userType: user.userType,
        isGraduate: user.isGraduate,
        graduateSchool: user.graduateSchool,
        graduateCourse: user.graduateCourse,
        currentJob: user.currentJob,
        location: {
          state: user.location?.state,
          city: user.location?.city,
        },
        bio: user.bio,
        interests: user.interests,
        lookingFor: user.lookingFor,
        profilePhoto: profilePhotoUrl,
        photos: galleryPhotos,
      };
      const token = localStorage.getItem('token')
      await axios.put(
        `${API_URL}/updateuser`,
        updatedUserData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ correct spelling and spacing
          },
        }
      );
      setSuccessMsg("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <h2>Profile Details</h2>

      <div className="photo-section">
        <img src={photoPreview || user.profilePhoto || '/default-avatar.png'} alt="Profile" />
        <input type="file" accept="image/*" onChange={handlePhotoChange} />
      </div>

      <GallerySection
  photos={user?.photos || []}
  onPhotosChange={(updated) => {
    setUser((prev) => prev ? { ...prev, photos: updated } : prev);
  }}
  onNewPhotosSelected={(files) => {
   
    setNewPhotos(files); // store them to upload later
  }}
/>

      <div className="form-grid">
        <input name="fullName" value={user.fullName} onChange={handleChange} placeholder="Full Name" />
        <input name="username" value={user.userName || ''} onChange={handleChange} type='text' placeholder="Username" />
        <input name="email" disabled value={user.email || ''} placeholder="Email" />
        <input name="phone" value={user.phone || ''} onChange={handleChange} placeholder="Phone" />

        <select name="gender" value={user.gender || ''} onChange={handleChange}>
          <option value="">Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="non-binary">Non-binary</option>
        </select>

        <input name="dateOfBirth" type="date" value={user.dateOfBirth?.slice(0, 10) || ''} onChange={handleChange} />
        <input name="institution" value={user.institution || ''} onChange={handleChange} placeholder="University" />
        <input name="department" value={user.department || ''} onChange={handleChange} placeholder="Department" />
        <input name="course" value={user.course || ''} onChange={handleChange} placeholder="Course" />

        <select name="level" value={user.level || ''} onChange={handleChange}>
          <option value="">Select Level</option>
          <option value="100">100</option>
          <option value="200">200</option>
          <option value="300">300</option>
          <option value="400">400</option>
          <option value="500">500</option>
          <option value="Graduate">Graduate</option>
        </select>

        <select name="lookingFor" value={user.lookingFor || ''} onChange={handleChange}>
          <option value="">Looking For</option>
          <option value="friendship">Friendship</option>
          <option value="serious relationship">Serious Relationship</option>
          <option value="one night stand">One Night Stand</option>
          <option value="fling">Fling</option>
          <option value="read buddy">Read Buddy</option>
        </select>

     <select name="userType" value={user.userType || ''} onChange={handleChange}>
          <option value="">User Type</option>
          <option value="student">Student</option>
          <option value="graduate">Graduate</option>
        </select>
        {user.userType !== 'student' && (
  <>
    <input
      name="graduateSchool"
      value={user.graduateDetails?.school || ''}
      onChange={handleChange}
      placeholder="Graduate School"
    />
    <input
      name="graduateCourse"
      value={user.graduateDetails?.course || ''}
      onChange={handleChange}
      placeholder="Graduate Course"
    />
    <input
      name="currentJob"
      value={user.graduateDetails?.currentJob || ''}
      onChange={handleChange}
      placeholder="Current Job"
    />
  </>
)}


        <input name="state" value={user.location?.state || ''} onChange={handleLocationChange} placeholder="State" />
        <input name="city" value={user.location?.city || ''} onChange={handleLocationChange} placeholder="City" />

        <p>Bio</p>
        <textarea name="bio" value={user.bio || ''} onChange={handleChange} placeholder="Your bio..." />

        <p>Interests</p>
        <div className="interest-options">
          {INTEREST_OPTIONS.map((interest) => (
            <label key={interest} style={{ display: 'flex', marginBottom: 4 }}>
              <input
                type="checkbox"
                value={interest}
                checked={user.interests?.includes(interest) || false}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setUser((prev) => {
                    if (!prev) return prev;
                    let updatedInterests = prev.interests ? [...prev.interests] : [];
                    if (checked) {
                      if (!updatedInterests.includes(interest)) {
                        updatedInterests.push(interest);
                      }
                    } else {
                      updatedInterests = updatedInterests.filter((i) => i !== interest);
                    }
                    return { ...prev, interests: updatedInterests };
                  });
                }}
              />
              {interest}
            </label>
          ))}
        </div>
      </div>

      <button className="save-btn" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Saving...' : 'Save Changes'}
      </button>

      {successMsg && <p className="success-msg">{successMsg}</p>}
    </div>
  );
};

export default ProfileDetails;
