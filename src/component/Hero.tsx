import React from 'react';
import '../styles/hero.css';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation } from "framer-motion";
import { useInView } from 'react-intersection-observer';
import { useAppSelector ,useAppDispatch} from '../store/hook'; 

const Hero = () => {
    const navigate = useNavigate();
    const controls = useAnimation();
    const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
    // Set up intersection observer hook
    const [ref, inView] = useInView({
      triggerOnce: true,      // only trigger once
      threshold: 0.3,         // 30% of the element is visible
    });
  
    React.useEffect(() => {
      if (inView) {
        controls.start('visible');
      }
    }, [inView, controls]);
  
    const containerVariants = {
      hidden: { opacity: 0, x: -50 },
      visible: { 
        opacity: 1, 
        x: 0, 
        transition: { staggerChildren: 0.3, ease: 'easeOut', duration: 0.6 }
      },
    };
  
    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    };
  
    const imageVariants = {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: 'easeOut' } },
    };
  
    return (
     <div>


      {isAuthenticated?'':<section ref={ref} className="hero" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <motion.h1 variants={itemVariants}>Real Connections. Premium Vibes.</motion.h1>
          <motion.p variants={itemVariants}>
            Join the dating experience built for smart <span style={{ color: "#d4af37" }}>students</span> and graduates who know their worth.
            Elegant, secure, and built just for you.
          </motion.p>
          <motion.div className="hero-buttons" variants={itemVariants} style={{ marginTop: '20px' }}>
            <button className="btn-primary" onClick={() => navigate('/login')}>Get Started</button>
            <button className="btn-secondary" onClick={() => navigate('/explore')} style={{ marginLeft: '10px' }}>Explore</button>
          </motion.div>
        </motion.div>
  
        <motion.div className="hero-image" variants={imageVariants} initial="hidden" animate={controls} style={{ maxWidth: '45%' }}>
          <img
            src="https://images.unsplash.com/photo-1724383986308-8bf5c17034db?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHlvdW5nJTIwbG92ZSUyMGJsYWNrJTIwY291cGxlfGVufDB8fDB8fHww"
            alt="Elegant couple"
            style={{ width: '100%', borderRadius: '10px', objectFit: 'cover' }}
          />
        </motion.div>
      </section>}
      </div>
    );
  };
  
  export default Hero;