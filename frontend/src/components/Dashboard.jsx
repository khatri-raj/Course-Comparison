import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTrash } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [savedCourses, setSavedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSavedCourses = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get('http://localhost:8000/api/saved-courses/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setSavedCourses(response.data.map(item => ({
          savedCourseId: item.id, // Store SavedCourse ID
          id: item.course.id,
          Name: item.course.Name,
          Institute: item.course.Institute,
          Fees: item.course.Fees,
          Placement_rate: item.course.Placement_rate,
          Rating: item.course.Rating,
        })));
        setLoading(false);
      } catch (err) {
        setError('Failed to load saved courses.');
        setLoading(false);
      }
    };
    fetchSavedCourses();
  }, [isAuthenticated]);

  const handleRemoveCourse = async (savedCourseId) => {
    try {
      await axios.delete(`http://localhost:8000/api/saved-courses/${savedCourseId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setSavedCourses(savedCourses.filter(course => course.savedCourseId !== savedCourseId));
      // Optional: Clear error on success
      setError('');
    } catch (err) {
      console.error('Remove course error:', err.response?.data || err.message);
      setError('Failed to remove course. Please try again.');
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  return (
    <div style={styles.container}>
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .header-section {
          animation: gradientShift 10s ease infinite;
        }
        .course-card, .saved-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .course-card:hover, .saved-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        }
        .progress-bar {
          transition: width 0.5s ease;
        }
        .action-button, .remove-button, .update-button {
          transition: background-color 0.3s ease, transform 0.3s ease;
        }
        .action-button:hover, .update-button:hover {
          background-color: #1d4ed8;
          transform: scale(1.03);
        }
        .remove-button:hover {
          background-color: #e11d48;
          transform: scale(1.03);
        }
      `}</style>

      {/* Header */}
      <motion.header
        style={{ ...styles.header, backgroundImage: 'linear-gradient(90deg, #2563eb, #1e40af, #2563eb)' }}
        className="header-section"
        initial="hidden"
        animate="visible"
        variants={headerVariants}
      >
        <div style={styles.headerContent}>
          <h1 style={styles.heroTitle}>Dashboard</h1>
          <Link to="/update-profile">
            <motion.button
              style={styles.updateButton}
              className="update-button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Update Profile
            </motion.button>
          </Link>
        </div>
      </motion.header>

      {/* Main Content */}
      <main style={styles.main}>
        <section style={styles.section}>
          {/* Welcome Section */}
          <motion.div
            style={styles.welcomeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 style={styles.sectionTitle}>Welcome, {user?.username || 'User'}!</h2>
            <p style={styles.welcomeText}>
              Here’s an overview of your learning journey. Keep up the great work!
            </p>
          </motion.div>

          {/* Saved Courses */}
          <motion.div
            style={styles.savedSection}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 style={styles.sectionTitle}>Saved Courses</h2>
            {loading ? (
              <p style={styles.noResults}>Loading saved courses...</p>
            ) : error ? (
              <p style={styles.errorText}>{error}</p>
            ) : savedCourses.length === 0 ? (
              <motion.p
                style={styles.noResults}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                You haven’t saved any courses yet.{' '}
                <Link to="/compare" style={styles.link}>
                  Compare and save courses now!
                </Link>
              </motion.p>
            ) : (
              <motion.div
                style={styles.courseGrid}
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } },
                }}
              >
                {savedCourses.map((course, index) => (
                  <motion.div
                    key={course.savedCourseId}
                    style={styles.savedCard}
                    className="saved-card"
                    variants={cardVariants}
                    custom={index}
                    whileHover={{ scale: 1.03 }}
                  >
                    <h3 style={styles.courseTitle}>{course.Name}</h3>
                    <p style={styles.courseDetail}>Institute: {course.Institute}</p>
                    <p style={styles.courseDetail}>Fees: ${course.Fees}</p>
                    <p style={styles.courseDetail}>Placement Rate: {course.Placement_rate}%</p>
                    <div style={styles.rating}>
                      <span style={styles.ratingStars}>{'★'.repeat(Math.round(course.Rating))}</span>
                      <span style={styles.ratingEmptyStars}>{'★'.repeat(5 - Math.round(course.Rating))}</span>
                      <span style={styles.ratingText}>({course.Rating})</span>
                    </div>
                    <div style={styles.buttonGroup}>
                      <motion.button
                        style={styles.removeButton}
                        className="remove-button"
                        onClick={() => handleRemoveCourse(course.savedCourseId)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <FaTrash style={styles.buttonIcon} /> Remove
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <p style={styles.footerText}>© 2025 CourseComparison. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f0f9ff',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    width: '100%',
    padding: '40px 0',
    backgroundSize: '200% 200%',
  },
  headerContent: {
    maxWidth: '1024px',
    margin: '0 auto',
    padding: '0 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0,
  },
  main: {
    width: '100%',
    flexGrow: 1,
    padding: '40px 0',
  },
  section: {
    maxWidth: '1024px',
    margin: '0 auto',
    padding: '0 16px',
  },
  welcomeSection: {
    marginBottom: '40px',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '20px',
  },
  welcomeText: {
    color: '#4b5563',
    fontSize: '16px',
  },
  savedSection: {
    marginBottom: '40px',
  },
  courseGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '16px',
  },
  savedCard: {
    background: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  courseTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0,
  },
  courseDetail: {
    color: '#4b5563',
    fontSize: '14px',
    margin: '4px 0',
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    margin: '4px 0',
  },
  ratingStars: {
    color: '#facc15',
    fontSize: '14px',
  },
  ratingEmptyStars: {
    color: '#d1d5db',
    fontSize: '14px',
  },
  ratingText: {
    color: '#4b5563',
    fontSize: '12px',
    marginLeft: '4px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
  },
  updateButton: {
    background: '#2563eb',
    color: '#ffffff',
    fontWeight: '600',
    padding: '10px 24px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
  },
  removeButton: {
    background: '#f43f5e',
    color: '#ffffff',
    fontWeight: '600',
    padding: '8px 0',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    flex: 1,
  },
  buttonIcon: {
    width: '14px',
    height: '14px',
  },
  noResults: {
    color: '#4b5563',
    textAlign: 'center',
    fontSize: '16px',
    margin: '20px 0',
  },
  errorText: {
    color: '#e11d48',
    textAlign: 'center',
    fontSize: '16px',
    margin: '20px 0',
  },
  link: {
    color: '#2563eb',
    textDecoration: 'underline',
  },
  footer: {
    width: '100%',
    background: '#1e40af',
    color: '#ffffff',
    padding: '20px 0',
  },
  footerContent: {
    maxWidth: '1024px',
    margin: '0 auto',
    padding: '0 16px',
    textAlign: 'center',
  },
  footerText: {
    fontSize: '14px',
  },
};

export default Dashboard;