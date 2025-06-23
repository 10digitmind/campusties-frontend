import React, { useEffect, useState } from 'react';

import { motion } from "framer-motion";
import '../styles/hero2.css'
import { useAppSelector ,useAppDispatch} from '../store/hook'; 

import { useNavigate } from 'react-router-dom';
const testimonialData = [
  {
    text: "“I never thought I’d meet someone this special. Thank you CampusTies!” – Tolu, UI",
    image: "https://plus.unsplash.com/premium_photo-1731430625073-5619de1e8008?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHlvdW5nJTIwbG92ZSUyMGJsYWNrJTIwY291cGxlfGVufDB8fDB8fHww",
  },
  {
    text: "“Legit and clean! Feels way better than Tinder.” – Chidi, UNILAG",
    image: "https://images.unsplash.com/photo-1739289671650-622eaee2d480?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHlvdW5nJTIwbG92ZSUyMGJsYWNrJTIwY291cGxlfGVufDB8fDB8fHww",
  },
  {
    text: "“One chat led to a 2-year relationship! ❤️” – Ada, OAU",
    image: "https://media.istockphoto.com/id/1385796318/photo/students-on-avenida-paulista-in-s%C3%A3o-paulo.webp?a=1&b=1&s=612x612&w=0&k=20&c=mZbZ3Nq6dsZcZ1TAb0atWzWWIKo0HMPtJRB8eyH-pEg=",
  },
  {
    text: "“CampusTies gave me more than a date. I found a real friend.” – Sarah, UNN",
    image: "https://images.unsplash.com/photo-1611620005506-96178482161f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHlvdW5nJTIwbG92ZSUyMGJsYWNrJTIwY291cGxlfGVufDB8fDB8fHww",
  },
  {
    text: "“Met my girlfriend within 2 days of signing up. Unreal!” – Daniel, FUTA",
    image: "https://images.unsplash.com/photo-1613013085279-5b3570928669?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHlvdW5nJTIwbG92ZSUyMGJsYWNrJTIwY291cGxlfGVufDB8fDB8fHww",
  },
  {
    text: "“We vibed over memes and now we’re planning our NYSC together.” – Amaka, LASU",
    image: "https://images.unsplash.com/photo-1611620005506-96178482161f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHlvdW5nJTIwbG92ZSUyMGJsYWNrJTIwY291cGxlfGVufDB8fDB8fHww",
  },
  {
    text: "“Never believed in apps, but this one changed my mind.” – Timi, BUK",
    image: "https://images.unsplash.com/photo-1724454920878-a4cba430db4c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8eW91bmclMjBsb3ZlJTIwYmxhY2slMjBjb3VwbGV8ZW58MHx8MHx8fDA%3D",
  },
  {
    text: "“Safe, smooth, and surprisingly fun. 10/10.” – Bisi, UNIBEN",
    image: "https://images.unsplash.com/photo-1611620005506-96178482161f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHlvdW5nJTIwbG92ZSUyMGJsYWNrJTIwY291cGxlfGVufDB8fDB8fHww",
  },
  {
    text: "“I deleted other dating apps. This one just works.” – Ken, ABU",
    image: "https://images.unsplash.com/photo-1611620005506-96178482161f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHlvdW5nJTIwbG92ZSUyMGJsYWNrJTIwY291cGxlfGVufDB8fDB8fHww",
  },
  {
    text: "“Matched with my coursemate without even knowing. Destiny?” – Ife, UNICAL",
    image: "https://images.unsplash.com/photo-1611620005506-96178482161f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHlvdW5nJTIwbG92ZSUyMGJsYWNrJTIwY291cGxlfGVufDB8fDB8fHww",
  },
];
const welcomeMessages = [
  "Welcome back! You're just a few clicks away from discovering a meaningful connection 💑.",
  "Hey there! Love might just be a swipe away 😉",
  "Welcome back — your next match could be the one 💑.",
  "Good to see you again! Let's get you closer to someone special ♥️.",
  "Welcome back! Ready to meet someone amazing? 🌹",
];
const Hero2: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
      const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const navigate = useNavigate();
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonialData.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);
  const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
  return (
    <div>

  
   {isAuthenticated?<div style={{height:"120px", width:'100%',color:"white", display:"flex", alignItems:"center", justifyContent:'center',marginTop:'40px'}}>
    <p style={{fontSize:'1.5rem'}}>{randomMessage}</p>
   </div>: <motion.section
      className="hero-section2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="hero-left"
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="hero-content">
          <motion.h1
            className="hero-title"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Find Love Where You Belong 💕
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Join the most trusted campus dating platform made just for you.
          </motion.p>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <button className="btn-primary" onClick={() => navigate("/login")}>
              Get Started
            </button>
            <button className="btn-secondary" onClick={() => navigate("/explore")}>
              Explore
            </button>
          </motion.div>

          <motion.div
            className="hero-social-proof"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <span>👥 15,000+ Students Joined</span>
            <span>💬 Over 2M Messages Sent</span>
            <span>💍 350+ Real Connections</span>
          </motion.div>

          <motion.div
            className="testimonials-carousel"
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="testimonial active">{testimonialData[activeIndex].text}</p>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="hero-right"
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <motion.img
          src={testimonialData[activeIndex].image}
          alt={`Testimonial ${activeIndex + 1}`}
          className="testimonial-image"
          loading="lazy"
          key={activeIndex}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        />
      </motion.div>
    </motion.section>}
    </div>
  );
};


export default Hero2;
