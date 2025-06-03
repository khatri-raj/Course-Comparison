import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEye, FaSave } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CompareCourses = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [savedCourseIds, setSavedCourseIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    fees: 'none',
    placement: 'none',
    rating: 'none',
  });

  useEffect(() => {
    const fetchCoursesAndSaved = async () => {
      try {
        // Fetch all courses
        const coursesResponse = await axios.get('http://localhost:8000/api/courses/');
        setCourses(coursesResponse.data);
        setFilteredCourses(coursesResponse.data);

        // Fetch saved courses if authenticated
        if (isAuthenticated) {
          const savedResponse = await axios.get('http://localhost:8000/api/saved-courses/', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setSavedCourseIds(savedResponse.data.map(item => item.course.id));
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    };

    fetchCoursesAndSaved();
  }, [isAuthenticated]);

  useEffect(() => {
    let updatedCourses = [...courses];

    if (filter.fees === 'lowToHigh') {
      updatedCourses.sort((a, b) => a.Fees - b.Fees);
    }

    if (filter.placement === 'highToLow') {
      updatedCourses.sort((a, b) => b.Placement_rate - a.Placement_rate);
    }

    if (filter.rating === 'highToLow') {
      updatedCourses.sort((a, b) => b.Rating - a.Rating);
    }

    setFilteredCourses(updatedCourses);
  }, [filter, courses]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({
      ...prev,
      [name]: value === 'none' ? 'none' : value,
    }));
  };

  const handleSaveToDashboard = async (course) => {
    if (!isAuthenticated) {
      alert('Please log in to save courses.');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8000/api/saved-courses/',
        { course_id: course.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setSavedCourseIds([...savedCourseIds, course.id]);
      alert('Course saved to your dashboard!');
    } catch (err) {
      if (err.response?.status === 400 && err.response.data.course) {
        alert('This course is already saved.');
      } else {
        alert('Failed to save course.');
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: i * 0.1, duration: 0.5 },
    }),
  };

  if (loading) {
    return (
      <motion.div
        style={styles.loadingContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading courses...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        style={styles.errorContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p style={styles.errorText}>{error}</p>
      </motion.div>
    );
  }

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
        .course-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .course-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }
        .filter-select {
          transition: all 0.3s ease;
        }
        .filter-select:focus {
          border-color: #2563eb;
          box-shadow: 0 0 8px rgba(37, 99, 235, 0.5);
        }
        .filter-select, .filter-select option {
          color: #1f2937;
        }
        .action-button {
          transition: background-color 0.3s ease, transform 0.3s ease;
        }
        .action-button:hover {
          transform: scale(1.05);
        }
        .view-button:hover {
          background-color: #1e40af;
        }
        .save-button:hover {
          background-color: #16a34a;
        }
      `}</style>

      <motion.header
        style={{ ...styles.header, backgroundImage: 'linear-gradient(90deg, #2563eb, #1e40af, #2563eb)' }}
        className="header-section"
        initial="hidden"
        animate="visible"
        variants={headerVariants}
      >
        <div style={styles.headerContent}>
          <h1 style={styles.heroTitle}>
            Compare <span style={styles.highlightText}>Courses</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Filter and compare courses to find the perfect fit for your learning goals.
          </p>
        </div>
      </motion.header>

      <main style={styles.main}>
        <section style={styles.section}>
          <motion.div
            style={styles.filterContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Sort by Fees:</label>
              <select
                name="fees"
                value={filter.fees}
                onChange={handleFilterChange}
                style={styles.filterSelect}
                className="filter-select"
              >
                <option value="none">None</option>
                <option value="lowToHigh">Low to High</option>
              </select>
            </div>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Sort by Placement Rate:</label>
              <select
                name="placement"
                value={filter.placement}
                onChange={handleFilterChange}
                style={styles.filterSelect}
                className="filter-select"
              >
                <option value="none">None</option>
                <option value="highToLow">High to Low</option>
              </select>
            </div>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Sort by Rating:</label>
              <select
                name="rating"
                value={filter.rating}
                onChange={handleFilterChange}
                style={styles.filterSelect}
                className="filter-select"
              >
                <option value="none">None</option>
                <option value="highToLow">High to Low</option>
              </select>
            </div>
          </motion.div>

          <motion.div
            style={styles.courseGrid}
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            {filteredCourses.length === 0 ? (
              <motion.p
                style={styles.noResults}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                No courses found with the selected filters.
              </motion.p>
            ) : (
              filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  style={styles.courseCard}
                  className="course-card"
                  variants={cardVariants}
                  custom={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <h2 style={styles.courseTitle}>{course.Name}</h2>
                  <p style={styles.academyName}>{course.Institute}</p>
                  <div style={styles.courseDetails}>
                    <p style={styles.detailText}>Fees: ${course.Fees}</p>
                    <p style={styles.detailText}>Placement Rate: {course.Placement_rate}%</p>
                    <div style={styles.rating}>
                      <span style={styles.ratingStars}>{'★'.repeat(Math.round(course.Rating))}</span>
                      <span style={styles.ratingEmptyStars}>{'★'.repeat(5 - Math.round(course.Rating))}</span>
                      <span style={styles.ratingText}>({course.Rating})</span>
                    </div>
                  </div>
                  <div style={styles.buttonGroup}>
                    <motion.button
                      style={{ ...styles.actionButton, ...styles.viewButton }}
                      className="action-button view-button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaEye style={styles.buttonIcon} /> View Course Details
                    </motion.button>
                    <motion.button
                      style={{
                        ...styles.actionButton,
                        ...styles.saveButton,
                        ...(savedCourseIds.includes(course.id) ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
                      }}
                      className="action-button save-button"
                      onClick={() => handleSaveToDashboard(course)}
                      disabled={savedCourseIds.includes(course.id)}
                      whileHover={savedCourseIds.includes(course.id) ? {} : { scale: 1.1 }}
                      whileTap={savedCourseIds.includes(course.id) ? {} : { scale: 0.9 }}
                    >
                      <FaSave style={styles.buttonIcon} /> {savedCourseIds.includes(course.id) ? 'Saved' : 'Save to Dashboard'}
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </section>
      </main>

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
    background: 'linear-gradient(to bottom, #f0f9ff, #e5e7eb)',
    display: 'flex',
    flexDirection: 'column',
  },
  loadingContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #f0f9ff, #e5e7eb)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: '16px',
  },
  spinner: {
    width: '24px',
    height: '24px',
    border: '4px solid #2563eb',
    borderTop: '4px solid transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: '16px',
  },
  errorContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #f0f9ff, #e5e7eb)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#dc2626',
    fontWeight: '600',
    fontSize: '16px',
  },
  header: {
    width: '100%',
    padding: '64px 0',
    backgroundSize: '200% 200%',
  },
  headerContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 16px',
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '8px',
  },
  highlightText: {
    color: '#facc15',
  },
  heroSubtitle: {
    fontSize: '18px',
    color: '#ffffff',
    marginBottom: '24px',
    maxWidth: '640px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  main: {
    width: '100%',
    flexGrow: 1,
    padding: '40px 0',
  },
  section: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 16px',
  },
  filterContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
    marginBottom: '32px',
    flexWrap: 'wrap',
    background: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '16px',
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  filterLabel: {
    color: '#1e40af',
    fontWeight: '500',
    fontSize: '14px',
  },
  filterSelect: {
    padding: '8px 16px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    background: '#ffffff',
    outline: 'none',
    color: '#1f2937',
  },
  courseGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
  },
  courseCard: {
    background: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  courseTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1d4ed8',
    margin: 0,
  },
  academyName: {
    fontSize: '18px',
    color: '#4b5563',
    fontWeight: '500',
    margin: 0,
  },
  courseDetails: {
    flexGrow: 1,
  },
  detailText: {
    color: '#374151',
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
    fontSize: '14px',
    marginLeft: '4px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '16px',
  },
  actionButton: {
    flex: 1,
    padding: '10px 0',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  viewButton: {
    background: '#2563eb',
  },
  saveButton: {
    background: '#22c55e',
  },
  buttonIcon: {
    width: '16px',
    height: '16px',
  },
  noResults: {
    color: '#4b5563',
    textAlign: 'center',
    fontSize: '18px',
    margin: '24px 0',
  },
  footer: {
    width: '100%',
    background: 'linear-gradient(to right, #1e40af, #2563eb)',
    color: '#ffffff',
    padding: '24px 0',
  },
  footerContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 16px',
    textAlign: 'center',
  },
  footerText: {
    fontSize: '14px',
  },
};

export default CompareCourses;