import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll event listener to detect scrolling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/compare', label: 'Compare' },
    { path: '/reviews', label: 'Reviews' },
    { path: '/contact', label: 'Contact' },
    { path: '/help', label: 'Help' },
    ...(isAuthenticated
      ? [
          { path: '/dashboard', label: 'Dashboard' },
          { path: '#', label: 'Logout', onClick: logout },
        ]
      : [
          { path: '/login', label: 'Login' },
          { path: '/register', label: 'Register' },
        ]),
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const logoVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  const linkVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
  };

  return (
    <nav style={{ ...styles.navbar, ...(isScrolled ? styles.navbarScrolled : {}) }}>
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        }
        .navbar {
          background: linear-gradient(90deg, #2563eb, #4f46e5, #2563eb);
          background-size: 200% 200%;
          animation: gradientShift 10s ease infinite;
        }
        .nav-link {
          position: relative;
          overflow: hidden;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2); /* Improve text visibility */
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: #facc15;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
        }
        .nav-link:hover::after,
        .nav-link.active::after {
          transform: translateX(0);
        }
        .hamburger-icon {
          transition: transform 0.3s ease;
        }
        .hamburger-icon:hover {
          transform: scale(1.2);
        }
        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }
          .hamburger {
            display: flex;
            align-items: center;
          }
          .mobile-menu {
            display: flex;
            flex-direction: column;
          }
        }
        }
        @media (min-width: 769px) {
          .hamburger {
            display: none;
          }
          .mobile-menu {
            display: none;
          }
        }
      `}</style>
      <div style={styles.container}>
        {/* Logo */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={logoVariants}
        >
          <Link to="/" style={styles.logo}>
            Course<span style={styles.logoHighlight}>Compare</span>
          </Link>
        </motion.div>

        {/* Desktop Navigation Links */}
        <div style={styles.navLinks} className="nav-links">
          {navLinks.map((link, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={linkVariants}
            >
              <Link
                to={link.path}
                onClick={link.onClick || (() => {})}
                style={{
                  ...styles.navLink,
                  ...(location.pathname === link.path && !link.onClick ? styles.activeLink : {}),
                }}
                className="nav-link active"
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <motion.div
          style={styles.hamburger}
          className="hamburger"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <button onClick={toggleMobileMenu} style={styles.button}>
            {isMobileMenuOpen ? (
              <FaTimes style={styles.icon} className="hamburger-icon" />
            ) : (
              <FaBars style={styles.icon} className="hamburger-icon" />
            )}
          </button>
        </motion.div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              style={styles.mobileMenu}
              className="mobile-menu"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={mobileMenuVariants}
            >
              {navLinks.map((link, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => {
                      link.onClick && link.onClick();
                      setIsMobileMenuOpen(false);
                    }}
                    style={{
                      ...styles.mobileNavLink,
                      ...(location.pathname === link.path && !link.onClick ? styles.activeMobileLink : {}),
                    }}
                    className="nav-link"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    width: '100%',
    position: 'sticky',
    top: 0,
    zIndex: 1000, // Increased z-index to stay above content
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    background: 'rgba(37, 99, 235, 1)', // Fully opaque fallback
    transition: 'all 0.3s ease',
  },
  navbarScrolled: {
    padding: '8px 0', // Slightly reduce padding when scrolled
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Stronger shadow when scrolled
    background: 'rgba(37, 99, 235, 0.95)', // Slightly translucent when scrolled
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
  },
  logo: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#ffffff',
    textDecoration: 'none',
    letterSpacing: '1px',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)', // Improve logo visibility
  },
  logoHighlight: {
    color: '#facc15',
  },
  navLinks: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    alignItems: 'center',
  },
  navLink: {
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    textDecoration: 'none',
    background: 'rgba(255, 255, 255, 0.1)',
    transition: 'background 0.3s ease, color 0.3s ease',
  },
  activeLink: {
    background: '#ffffff',
    color: '#2563eb',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  hamburger: {
    display: 'none',
  },
  button: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
  },
  icon: {
    width: '24px',
    height: '24px',
    color: '#ffffff',
  },
  mobileMenu: {
    width: '100%',
    background: '#1e40af',
    padding: '16px',
    display: 'none',
    flexDirection: 'column',
    gap: '12px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  mobileNavLink: {
    padding: '12px 16px',
    fontSize: '18px',
    fontWeight: '500',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: '8px',
    background: 'rgba(255, 255, 255, 0.1)',
    transition: 'background 0.3s ease',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)', // Improve mobile link visibility
  },
  activeMobileLink: {
    background: '#facc15',
    color: '#1e40af',
  },
};

export default Navbar;