import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import "../styles/onboarding.css";
import { useRequireAuth } from "./Utility/requireAuth";
import { useNavigate } from "react-router-dom";


type LookingFor =
  | ""
  | "read buddy 📖"
  | "serious relationship ❤️‍🔥"
  | "one night stand 🩶"
  | "friendship 💝"
  | "fling 🥒";

type UserType = "student" | "graduate" | "";

const API_URL =process.env.REACT_APP_BACKEND_URL;

const steps = ["Basic Info", "Preferences", "Profile Photo"];

const FirstOnboarding: React.FC = () => {
  const [step, setStep] = useState(0);

  const [institution, setInstitution] = useState("");
  const [dob, setDob] = useState("");
  const [lookingFor, setLookingFor] = useState<LookingFor>("");
  const [userType, setUserType] = useState<UserType>("");
  const [graduateDetails, setGraduateDetails] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [bio, setBio] = useState<string>('');
  const [gender, setGender] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);

  const loggedInUser = useRequireAuth();
const navigate = useNavigate()
  if (!loggedInUser) return null;

  const isGraduate = userType === "graduate";

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    if (step === 0) {
      if (!institution.trim()) newErrors.institution = "Required";
      if (!dob) newErrors.dob = "Required";
    }
    if (step === 1) {
      if (!lookingFor) newErrors.lookingFor = "Required";
      if (!userType) newErrors.userType = "Required";
      if (isGraduate && !graduateDetails.trim())
        newErrors.graduateDetails = "Required";
    }
    if (step === 2) {
      if (!photo) newErrors.photo = "Image required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const next = () => {
    if (validateStep()) setStep((prev) => prev + 1);
  };

  const back = () => setStep((prev) => prev - 1);


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
 
    if (!validateStep()) return;

    setLoading(true);
    setMessage(null);

    let uploadedPhotoUrl = "";

    try {
      // 1. Upload to ImageKit if photo exists
      if (photo) {
        const { data } = await axios.get(
          `${API_URL}/imagekit-auth`
        ); // Your backend route
        const { token, expire, signature } = data;

        const form = new FormData();
        form.append("file", photo);
        form.append("fileName", photo.name);
        form.append("publicKey", `${process.env.REACT_APP_IMAGE_KEY}`);
        form.append("useUniqueFileName", "true");
        form.append("token", token);
        form.append("expire", expire);
        form.append("signature", signature);

        const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
          method: "POST",
          body: form,
        });

        const uploadedData = await uploadRes.json();
      
        uploadedPhotoUrl = uploadedData.url;
      }

      // 2. Submit onboarding data
      const payload = {
        institution,
        dateOfBirth: dob,
        lookingFor,
        userType,
        isGraduate,
        graduateDetails: isGraduate ? graduateDetails : "",
        profilePhoto: uploadedPhotoUrl,
        bio,
        gender
      };


     
      
      const onb =await axios.put(
        `${API_URL}/complete-onboarding`,
        payload,
        {
          headers: {
            Authorization:  `Bearer ${token}`,
          },
        }
      );

      setMessage("Success! Onboarding complete.");
      setTimeout(() => {
        navigate('/explore')
      }, 2000);
    } catch (err) {
      console.error(err);
      setMessage("Error submitting form. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-header">
        {step === 0 && <h2>Ready to unlock awesome connections💞💞?</h2>}
        {step === 1 && <h2>Nice! Let’s fine-tune your experience 👩‍❤️‍👩👩‍❤️‍👩.</h2>}
        {step === 2 && <h2>All set? Hit submit and dive in! 🎉🎉</h2>}
      </div>

      <div className="progress-bar">
        {steps.map((s, i) => (
          <div key={i} className={`progress-step ${step >= i ? "active" : ""}`}>
            <span>{s}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="onboarding-form" >
        {step === 0 && (
          <>
            <label>
              Institution
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                disabled={loading}
              />
              {errors.institution && <small>{errors.institution}</small>}
            </label>

            <label>
              Date of Birth
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                disabled={loading}
              />
              {errors.dob && <small>{errors.dob}</small>}
            </label>

            <label>
              Gender
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as UserType)}
                disabled={loading}
              >
                <option value="">-- Select --</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.userType && <small>{errors.userType}</small>}
            </label>
          </>
        )}

        {step === 1 && (
          <>
            <label>
              What are you looking for?
              <select
                value={lookingFor}
                onChange={(e) => setLookingFor(e.target.value as LookingFor)}
                disabled={loading}
              >
                <option value="">-- Select --</option>
                <option value="read buddy">Read buddy 📖</option>
                <option value="serious relationship">
                  Serious relationship ❤️‍🔥
                </option>
                <option value="one night stand">One night stand 🩶</option>
                <option value="friendship">Friendship 💝</option>
                <option value="fling">Fling 🥒</option>
              </select>
              {errors.lookingFor && <small>{errors.lookingFor}</small>}
            </label>

            <label>
              User Type
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value as UserType)}
                disabled={loading}
              >
                <option value="">-- Select --</option>
                <option value="student">Student</option>
                <option value="graduate">Graduate</option>
              </select>
              {errors.userType && <small>{errors.userType}</small>}
            </label>


           

            {isGraduate && (
              <label>
                Graduate Details
                <input
                  type="text"
                  value={graduateDetails}
                  onChange={(e) => setGraduateDetails(e.target.value)}
                  disabled={loading}
                />
                {errors.graduateDetails && (
                  <small>{errors.graduateDetails}</small>
                )}
              </label>
            )}
          </>
        )}

{step === 2 && (
  <>
    <label>
      Profile Photo
      <input
        type="file"
        accept="image/*"
        onChange={handlePhotoChange}
        disabled={loading}
      />
      {errors.photo && <small>{errors.photo}</small>}
    </label>

    {photoPreview && (
      <div className="preview">
        <img src={photoPreview} alt="Preview" />
      </div>
    )}

    <label>
      Bio
      <input
        type="text"
        placeholder="About you"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        disabled={loading}
      />
      {errors.bio && <small>{errors.bio}</small>}
    </label>
  </>
)}


        <div className="form-buttons">
          {step > 0 && (
            <button type="button" onClick={back} disabled={loading}>
              Back
            </button>
          )}
          {step < steps.length - 1 ? (
            <button type="button" onClick={next} disabled={loading}>
              Next
            </button>
          ) : (
            <button  type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          )}
        </div>

        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default FirstOnboarding;
