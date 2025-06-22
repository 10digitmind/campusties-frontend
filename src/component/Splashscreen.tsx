import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/splashscreen.css"; // styling below

const SplashScreen = () => {
    const navigate = useNavigate();
  
    useEffect(() => {
      const timer = setTimeout(() => {
        navigate("/home"); // replace with your actual homepage path
      }, 2000);
      return () => clearTimeout(timer);
    }, [navigate]);
  
    return (
      <div className="splash-container">
        <h1 className="splash-logo">Campus<span>Ties</span></h1>
      </div>
    );
  };
  
  export default SplashScreen;
