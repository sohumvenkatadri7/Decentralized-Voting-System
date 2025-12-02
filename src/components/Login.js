import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, useScroll, useMotionTemplate } from 'framer-motion';
import './Login.css';

// Premium Floating Particles with Glow
const FloatingParticles = () => {
  const particles = Array.from({ length: 10 });
  
  return (
    <div className="particles-container">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="particle"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: Math.random() * 0.5 + 0.3,
            opacity: Math.random() * 0.4 + 0.1
          }}
          animate={{
            y: [null, Math.random() * -300 - 100],
            opacity: [null, 0]
          }}
          transition={{
            duration: Math.random() * 5 + 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "linear"
          }}
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
          }}
        />
      ))}
    </div>
  );
};

// Liquid Gradient Orbs
const GradientOrbs = () => {
  return (
    <div className="gradient-orbs">
      <motion.div
        className="orb orb-1"
        animate={{
          x: [0, 100, 0],
          y: [0, -80, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div
        className="orb orb-2"
        animate={{
          x: [0, -80, 0],
          y: [0, 100, 0],
          scale: [1, 1.3, 1]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
};

// Premium Spotlight Effect
const SpotlightEffect = ({ mouseX, mouseY }) => {
  return (
    <motion.div
      className="spotlight-effect"
      style={{
        background: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(15, 118, 110, 0.15), transparent 80%)`
      }}
    />
  );
};

// Magnetic Button Component
const MagneticButton = ({ children, className, onClick, disabled, ...props }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 15, stiffness: 150 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    if (!ref.current || disabled) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.3);
    y.set((e.clientY - centerY) * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      className={className}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: xSpring, y: ySpring }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

const Login = ({ web3Handler, account, setUserRole }) => {
  const [aadharNumber, setAadharNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isAadharVerified, setIsAadharVerified] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();
  
  const { scrollYProgress } = useScroll();
  const navbarBlur = useTransform(scrollYProgress, [0, 0.1], [10, 20]);

  useEffect(() => {
    // Load theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  useEffect(() => {
    // Update wallet connected state when account changes
    if (account) {
      setWalletConnected(true);
    } else {
      setWalletConnected(false);
    }
  }, [account]);

  useEffect(() => {
    // If both wallet connected and Aadhar verified, check role
    if (account && isAadharVerified) {
      checkUserRole();
    }
  }, [account, isAadharVerified]);

  const checkUserRole = async () => {
    try {
      // This would check against the smart contract
      // For demo purposes, we'll use a simple check
      // In production, call contract's isAdmin() function
      const adminAddress = localStorage.getItem('adminAddress')?.toLowerCase();
      if (account.toLowerCase() === adminAddress) {
        setUserRole('admin');
        navigate('/admin');
      } else {
        setUserRole('voter');
        navigate('/voting');
      }
    } catch (err) {
      console.error('Error checking user role:', err);
    }
  };

  const validateAadhar = (number) => {
    // Aadhar number is 12 digits
    const aadharRegex = /^\d{12}$/;
    return aadharRegex.test(number);
  };

  const handleAadharSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateAadhar(aadharNumber)) {
      setError('Please enter a valid 12-digit Aadhar number');
      return;
    }

    setLoading(true);
    
    // Simulate API call to send OTP
    // In production, this would call your backend to send OTP via Aadhar API
    setTimeout(() => {
      setShowOtpInput(true);
      setLoading(false);
      alert('OTP sent to your registered mobile number');
    }, 1500);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);

    // Simulate OTP verification
    // In production, verify OTP with backend
    setTimeout(() => {
      setLoading(false);
      setIsAadharVerified(true);
      console.log('Aadhar verified successfully!');
    }, 1500);
  };

  const handleMetaMaskConnect = async () => {
    try {
      setError('');
      setLoading(true);
      await web3Handler();
      setLoading(false);
      // walletConnected state will be updated by the useEffect when account changes
    } catch (err) {
      setLoading(false);
      if (err.code === 4001) {
        setError('Please connect your wallet to continue');
      } else {
        setError('Failed to connect MetaMask wallet');
      }
      console.error(err);
    }
  };

  const handleDisconnectWallet = () => {
    // Reset all states
    setWalletConnected(false);
    setIsAadharVerified(false);
    setAadharNumber('');
    setOtp('');
    setShowOtpInput(false);
    setError('');
    // Reload page to clear wallet connection
    window.location.reload();
  };

  return (
    <div className={`login-page ${darkMode ? 'dark' : 'light'}`}>
      {/* Premium Animated Background */}
      <GradientOrbs />
      <FloatingParticles />
      
      {/* Premium Glassmorphism Navigation with Scroll Effect */}
      <motion.nav 
        className="navbar glass-navbar premium-navbar"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ backdropFilter: useMotionTemplate`blur(${navbarBlur}px)` }}
        transition={{ duration: 1, type: "spring", stiffness: 80 }}
      >
        <div className="navbar-container">
          <motion.div 
            className="navbar-brand premium-brand"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div 
              className="navbar-logo premium-logo"
              animate={{ 
                boxShadow: [
                  "0 0 20px rgba(15, 118, 110, 0.3)",
                  "0 0 40px rgba(15, 118, 110, 0.6)",
                  "0 0 20px rgba(15, 118, 110, 0.3)"
                ]
              }}
              transition={{ 
                boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              🗳️
            </motion.div>
            <div className="brand-text">
              <motion.span 
                className="gradient-text brand-name"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                VoteChain
              </motion.span>
              <motion.span 
                className="brand-tagline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Web3 Democracy
              </motion.span>
            </div>
          </motion.div>
          
          <motion.div 
            className="navbar-actions"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <MagneticButton 
              className="theme-toggle premium-toggle" 
              onClick={toggleTheme}
            >
              <motion.div
                className="toggle-inner"
                whileHover={{ rotate: 180, scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={darkMode ? 'sun' : 'moon'}
                    initial={{ scale: 0, rotate: -180, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    exit={{ scale: 0, rotate: 180, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {darkMode ? '☀️' : '🌙'}
                  </motion.span>
                </AnimatePresence>
              </motion.div>
            </MagneticButton>
            
            <MagneticButton 
              className="admin-login-btn premium-btn"
              onClick={() => navigate('/admin-login')}
            >
              <motion.div className="btn-content">
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  🛡️
                </motion.span>
                <span>Admin Portal</span>
              </motion.div>
              <motion.div 
                className="btn-glow"
                animate={{ 
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </MagneticButton>
          </motion.div>
        </div>
        
        {/* Premium Progress Bar */}
        <motion.div 
          className="nav-progress-bar"
          style={{ scaleX: scrollYProgress }}
        />
      </motion.nav>

      {/* Premium Hero Section with Parallax */}
      <motion.section className="hero-section-modern premium-hero">
        <motion.div 
          className="hero-content-modern"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Animated Title with Split Text */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1 className="hero-title-modern premium-title">
              {['Decentralized', 'Voting', 'Revolution'].map((word, i) => (
                <motion.span
                  key={word}
                  className={`word ${i === 1 ? 'gradient-text' : ''}`}
                  initial={{ opacity: 0, y: 50, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ 
                    delay: 0.3 + i * 0.15, 
                    duration: 0.8,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    textShadow: "0 0 20px rgba(15, 118, 110, 0.5)"
                  }}
                >
                  {word}
                  {' '}
                </motion.span>
              ))}
            </motion.h1>
            
            <motion.p 
              className="hero-subtitle-modern premium-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <motion.span
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                style={{
                  background: 'linear-gradient(90deg, var(--text-secondary), var(--primary-color), var(--text-secondary))',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Powered by Ethereum blockchain with military-grade security
              </motion.span>
            </motion.p>

            {/* Premium Animated Stats */}
            <div className="hero-stats premium-stats">
              {[
                { icon: '🔐', label: 'Secure', value: '256-bit', color: '#0f766e' },
                { icon: '⚡', label: 'Fast', value: '<2s', color: '#10b981' },
                { icon: '✓', label: 'Verified', value: 'Aadhar', color: '#0f766e' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="stat-card glass-card premium-stat"
                  initial={{ opacity: 0, scale: 0, rotateY: -180 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ 
                    delay: 1 + index * 0.15, 
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                >
                  <motion.div 
                    className="stat-icon"
                  >
                    {stat.icon}
                  </motion.div>
                  <motion.div 
                    className="stat-value"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 + index * 0.15 }}
                  >
                    {stat.value}
                  </motion.div>
                  <motion.div 
                    className="stat-label"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3 + index * 0.15 }}
                  >
                    {stat.label}
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Floating Indicators */}
            <motion.div 
              className="floating-indicators"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <motion.div
                className="indicator"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="indicator-dot"></span>
                <span className="indicator-text">Live on Ethereum</span>
              </motion.div>
              <motion.div
                className="indicator"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              >
                <span className="indicator-dot success"></span>
                <span className="indicator-text">MetaMask Ready</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Premium Main Auth Container */}
      <motion.main className="main-content-modern premium-content">
        <motion.div 
          className="auth-card glass-card premium-auth-card"
          initial={{ opacity: 0, y: 100, scale: 0.9, rotateX: -15 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 80, delay: 0.3 }}
        >
          {/* Premium Gradient Border */}
          <motion.div 
            className="card-border-glow"
            animate={{
              background: [
                'linear-gradient(90deg, #0f766e, #10b981, #0f766e)',
                'linear-gradient(180deg, #10b981, #0f766e, #10b981)',
                'linear-gradient(270deg, #0f766e, #10b981, #0f766e)',
                'linear-gradient(360deg, #10b981, #0f766e, #10b981)'
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Animated Header */}
          <motion.div className="auth-header-modern premium-header">
            <motion.div
              className="auth-icon premium-icon"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              🔐
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Secure Access
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Multi-factor authentication portal
            </motion.p>
          </motion.div>

          {/* Error Display with Animation */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                className="error-banner glass-card"
                initial={{ opacity: 0, x: -100, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                >
                  ⚠️
                </motion.span>
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Authentication Steps */}
          <AnimatePresence mode="wait">
            {!walletConnected ? (
              <motion.div
                key="wallet-step"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="auth-step"
              >
                <div className="step-indicator">
                  <div className="step-number active">1</div>
                  <div className="step-line"></div>
                  <div className="step-number">2</div>
                  <div className="step-line"></div>
                  <div className="step-number">3</div>
                </div>

                <motion.div className="wallet-connect-section premium-connect">
                  <MagneticButton
                    className="metamask-button premium-metamask"
                    onClick={handleMetaMaskConnect}
                    disabled={loading}
                  >
                    <motion.div
                      className="button-content"
                      animate={loading ? { opacity: [1, 0.6, 1] } : {}}
                      transition={{ duration: 1.5, repeat: loading ? Infinity : 0 }}
                    >
                      <motion.span 
                        className="metamask-icon"
                        animate={{ 
                          rotate: loading ? 360 : 0
                        }}
                        transition={{ 
                          rotate: { duration: loading ? 2 : 0, repeat: loading ? Infinity : 0, ease: "linear" }
                        }}
                      >
                        🦊
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        {loading ? 'Connecting to MetaMask...' : 'Connect MetaMask Wallet'}
                      </motion.span>
                    </motion.div>
                    <motion.div 
                      className="button-glow"
                      animate={loading ? { opacity: [0.3, 0.6, 0.3] } : { opacity: 0.3 }}
                      transition={{ duration: 1.5, repeat: loading ? Infinity : 0 }}
                    />
                  </MagneticButton>

                  <div className="info-chips">
                    <motion.div 
                      className="chip glass-card"
                      whileHover={{ scale: 1.05 }}
                    >
                      <span>🔒</span>
                      <span>Secure Connection</span>
                    </motion.div>
                    <motion.div 
                      className="chip glass-card"
                      whileHover={{ scale: 1.05 }}
                    >
                      <span>⚡</span>
                      <span>Instant Setup</span>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            ) : !isAadharVerified ? (
              <motion.div
                key="aadhar-step"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="auth-step"
              >
                <div className="step-indicator">
                  <div className="step-number completed">✓</div>
                  <div className="step-line completed"></div>
                  <div className="step-number active">2</div>
                  <div className="step-line"></div>
                  <div className="step-number">3</div>
                </div>

                {/* Wallet Badge */}
                <motion.div 
                  className="wallet-badge-modern glass-card"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ✓
                  </motion.span>
                  <span>Connected</span>
                  <code>{account.slice(0, 6)}...{account.slice(-4)}</code>
                  <motion.button
                    className="disconnect-btn"
                    onClick={handleDisconnectWallet}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ✕
                  </motion.button>
                </motion.div>

                <AnimatePresence mode="wait">
                  {!showOtpInput ? (
                    <motion.form
                      key="aadhar-form"
                      onSubmit={handleAadharSubmit}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <motion.div 
                        className="form-group-modern premium-input-group"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <motion.label
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <motion.span
                            animate={{ color: ["#6ee7b7", "#0f766e", "#6ee7b7"] }}
                            transition={{ duration: 3, repeat: Infinity }}
                          >
                            🆔
                          </motion.span>
                          {" "}Aadhar Number
                        </motion.label>
                        <motion.div className="premium-input-wrapper">
                          <motion.input
                            type="text"
                            value={aadharNumber}
                            onChange={(e) => setAadharNumber(e.target.value)}
                            placeholder="XXXX XXXX XXXX"
                            maxLength="12"
                            required
                            className="input-modern glass-card premium-input"
                            whileFocus={{ 
                              scale: 1.02,
                              boxShadow: "0 0 30px rgba(15, 118, 110, 0.4)" 
                            }}
                            transition={{ type: "spring", stiffness: 300 }}
                          />
                          <motion.div 
                            className="input-icon"
                            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          >
                            📱
                          </motion.div>
                        </motion.div>
                      </motion.div>

                      <MagneticButton
                        type="submit"
                        className="submit-button premium-submit"
                        disabled={loading}
                      >
                        <motion.div className="button-content">
                          <motion.span
                            animate={loading ? { rotate: 360 } : { rotate: [0, 10, -10, 0] }}
                            transition={loading ? { duration: 2, repeat: Infinity, ease: "linear" } : { duration: 2, repeat: Infinity }}
                          >
                            {loading ? '⏳' : '📨'}
                          </motion.span>
                          <span>{loading ? 'Sending OTP...' : 'Send OTP'}</span>
                        </motion.div>
                        <motion.div 
                          className="button-shine"
                          animate={{ x: [-100, 200], opacity: [0, 1, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <motion.div 
                          className="button-glow"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </MagneticButton>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="otp-form"
                      onSubmit={handleOtpSubmit}
                      initial={{ opacity: 0, x: -20, rotateY: -15 }}
                      animate={{ opacity: 1, x: 0, rotateY: 0 }}
                      exit={{ opacity: 0, x: 20, rotateY: 15 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <motion.div 
                        className="form-group-modern premium-input-group"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <motion.label
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <motion.span
                            animate={{ 
                              scale: [1, 1.3, 1],
                              filter: ["hue-rotate(0deg)", "hue-rotate(360deg)"]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            🔐
                          </motion.span>
                          {" "}Verification Code
                        </motion.label>
                        <motion.div className="premium-input-wrapper">
                          <motion.input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="• • • • • •"
                            maxLength="6"
                            required
                            autoFocus
                            className="input-modern glass-card otp-input premium-input"
                            whileFocus={{ 
                              scale: 1.02,
                              boxShadow: "0 0 30px rgba(15, 118, 110, 0.5)",
                              letterSpacing: "8px"
                            }}
                            transition={{ type: "spring", stiffness: 300 }}
                          />
                          <motion.div 
                            className="input-icon"
                            animate={{ 
                              rotate: [0, 15, -15, 0],
                              scale: [1, 1.3, 1]
                            }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          >
                            ✨
                          </motion.div>
                        </motion.div>
                      </motion.div>

                      <MagneticButton
                        type="submit"
                        className="submit-button premium-submit"
                        disabled={loading}
                      >
                        <motion.div className="button-content">
                          <motion.span
                            animate={loading ? { rotate: 360 } : { scale: [1, 1.2, 1] }}
                            transition={loading ? { duration: 2, repeat: Infinity, ease: "linear" } : { duration: 1.5, repeat: Infinity }}
                          >
                            {loading ? '⏳' : '✓'}
                          </motion.span>
                          <span>{loading ? 'Verifying...' : 'Verify & Continue'}</span>
                        </motion.div>
                        <motion.div 
                          className="button-glow"
                          animate={{ opacity: [0.3, 1, 0.3], scale: [0.95, 1.05, 0.95] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </MagneticButton>

                      <motion.button
                        type="button"
                        className="back-button glass-button premium-back"
                        onClick={() => setShowOtpInput(false)}
                        whileHover={{ scale: 1.03, x: -5, backgroundColor: "rgba(15, 118, 110, 0.1)" }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <motion.span
                          animate={{ x: [-2, 2, -2] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          ←
                        </motion.span>
                        {" "}Change Number
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="success-step"
                initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotateY: 180 }}
                transition={{ type: "spring", stiffness: 150, damping: 15 }}
                className="success-screen premium-success"
              >
                <motion.div
                  className="success-icon-large premium-success-icon"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ 
                    scale: [0, 1.3, 0.9, 1.1, 1],
                    rotate: [0, 360, 360, 360, 360]
                  }}
                  transition={{ duration: 1.2, type: "spring", stiffness: 200 }}
                >
                  <motion.div
                    animate={{ 
                      boxShadow: [
                        "0 0 40px rgba(16, 185, 129, 0.5)",
                        "0 0 80px rgba(16, 185, 129, 0.8)",
                        "0 0 40px rgba(16, 185, 129, 0.5)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="success-glow"
                  >
                    ✓
                  </motion.div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  style={{ position: 'relative', zIndex: 2 }}
                >
                  <motion.span
                    animate={{ 
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    style={{
                      background: "linear-gradient(90deg, #0f766e, #10b981, #6ee7b7, #10b981, #0f766e)",
                      backgroundSize: "200% 200%",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent"
                    }}
                  >
                    Authentication Complete!
                  </motion.span>
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  style={{ position: 'relative', zIndex: 2 }}
                >
                  Redirecting to voting portal...
                </motion.p>

                <motion.div 
                  className="loading-dots premium-dots"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  style={{ position: 'relative', zIndex: 2 }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="dot premium-dot"
                      animate={{ 
                        scale: [1, 1.8, 1], 
                        opacity: [0.5, 1, 0.5],
                        boxShadow: [
                          "0 0 10px rgba(15, 118, 110, 0.5)",
                          "0 0 20px rgba(16, 185, 129, 1)",
                          "0 0 10px rgba(15, 118, 110, 0.5)"
                        ]
                      }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Premium Floating Tech Badges */}
        <motion.div 
          className="tech-badges-float premium-tech"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8, type: "spring", stiffness: 80 }}
        >
          {[
            { name: 'Ethereum', img: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg', color: '#627EEA' },
            { name: 'MetaMask', img: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg', color: '#F6851B' },
            { name: 'Solidity', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/solidity/solidity-original.svg', color: '#363636' },
            { name: 'React', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', color: '#61DAFB' },
          ].map((tech, index) => (
            <motion.div
              key={tech.name}
              className="tech-badge-float glass-card premium-tech-badge"
              initial={{ opacity: 0, y: 50, rotateY: -90, scale: 0.5 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                rotateY: 0, 
                scale: 1
              }}
              transition={{ 
                delay: 1.4 + index * 0.15, 
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
              whileHover={{ 
                scale: 1.25, 
                rotateY: [0, 180, 360],
                z: 50,
                boxShadow: `0 20px 60px ${tech.color}60`,
                transition: { duration: 0.6, type: "spring", stiffness: 200 }
              }}
              whileTap={{ scale: 0.9 }}
              style={{
                transformStyle: "preserve-3d",
                perspective: 1000
              }}
            >
              <motion.img 
                src={tech.img} 
                alt={tech.name}
                whileHover={{ scale: 1.1 }}
                style={{
                  filter: "drop-shadow(0 0 10px rgba(255,255,255,0.3))"
                }}
              />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 + index * 0.15 }}
              >
                {tech.name}
              </motion.span>
            </motion.div>
          ))}
        </motion.div>
      </motion.main>

      {/* Premium Footer with Gradient */}
      <motion.footer 
        className="footer-modern premium-footer"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, type: "spring", stiffness: 100 }}
      >
        <motion.div
          className="footer-glow"
          animate={{
            background: [
              "linear-gradient(90deg, transparent, rgba(15, 118, 110, 0.3), transparent)",
              "linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.3), transparent)",
              "linear-gradient(90deg, transparent, rgba(15, 118, 110, 0.3), transparent)"
            ]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            zIndex: -1
          }}
        />
        <motion.p
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            🔐
          </motion.span>
          © 2025 VoteChain • Secured by{" "}
          <motion.span 
            className="gradient-text"
            whileHover={{ 
              scale: 1.1,
              textShadow: "0 0 20px rgba(15, 118, 110, 0.8)"
            }}
          >
            Ethereum
          </motion.span>
        </motion.p>
        <motion.p 
          className="credit"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          Crafted with{" "}
          <motion.span
            animate={{ 
              scale: [1, 1.3, 1],
              filter: ["hue-rotate(0deg)", "hue-rotate(360deg)"]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ display: 'inline-block' }}
          >
            ❤️
          </motion.span>
          {" "}by{" "}
          <motion.span 
            className="gradient-text"
            whileHover={{ 
              scale: 1.15,
              textShadow: "0 0 20px rgba(15, 118, 110, 0.8)"
            }}
            style={{ fontWeight: 700, cursor: 'pointer' }}
          >
            DeltDevz
          </motion.span>
        </motion.p>
      </motion.footer>
    </div>
  );
};

export default Login;
