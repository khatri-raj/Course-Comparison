import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import { AuthContext } from '../context/AuthContext';
import { FaSearch, FaGraduationCap, FaQuoteLeft, FaRocket, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const heroBackground = 'https://source.unsplash.com/1600x900/?education,learning';

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [visibleCourses, setVisibleCourses] = useState(6);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesResponse, reviewsResponse] = await Promise.all([
          axios.get('http://localhost:8000/api/courses/'),
          axios.get('http://localhost:8000/api/reviews/'),
        ]);
        const sortedCourses = coursesResponse.data.sort((a, b) => b.Rating - a.Rating);
        const sortedReviews = reviewsResponse.data.sort((a, b) => b.rating - a.rating).slice(0, 3);
        setCourses(sortedCourses);
        setReviews(sortedReviews);
        setLoading(false);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000, // Slide every 1 second
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  const testimonialSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500, // Slide every 1 second
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setSearchLoading(true);
    setTimeout(() => setSearchLoading(false), 500);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setVisibleCourses(6);
  };

  const loadMoreCourses = () => {
    setVisibleCourses((prev) => prev + 6);
  };

  const categories = ['All', ...new Set(courses.map((course) => course.category || 'General'))];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.Name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'All' || course.category === category;
    return matchesSearch && matchesCategory;
  });

  const heroVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i) => ({ opacity: 1, scale: 1, transition: { delay: i * 0.1, duration: 0.4 } }),
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
        <p style={styles.loadingText}>Loading...</p>
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
        .hero-section {
          animation: gradientShift 15s ease infinite;
        }
        .course-card, .top-card {
          transition: all 0.3s ease;
        }
        .course-card:hover, .top-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        }
        .course-image {
          transition: filter 0.3s ease;
        }
        .course-card:hover .course-image, .top-card:hover .course-image {
          filter: brightness(1.1);
        }
        .search-icon {
          transition: color 0.3s ease;
        }
        .search-input:focus + .search-bar .search-icon {
          color: #2563eb;
        }
        .category-select, .category-select option {
          color: #1f2937 !important;
          background: #ffffff;
        }
        .category-select:focus {
          border-color: #2563eb;
          box-shadow: 0 0 8px rgba(37, 99, 235, 0.3);
        }
        .primary-button, .top-button, .cta-button {
          transition: all 0.3s ease;
        }
        .primary-button:hover, .top-button:hover, .cta-button:hover {
          background-color: #1d4ed8;
          transform: scale(1.03);
        }
        .course-link:hover .arrow {
          transform: translateX(6px);
        }
      `}</style>

      {/* Hero Section */}
      <motion.header
        style={{
          ...styles.header,
          backgroundImage: `linear-gradient(to right, rgba(37,99,235,0.5), rgba(31,41,55,0.7)), url(${heroBackground})`,
        }}
        className="hero-section"
        initial="hidden"
        animate="visible"
        variants={heroVariants}
      >
        <div style={styles.headerContent}>
          <motion.h1 style={styles.heroTitle} variants={heroVariants}>
            {isAuthenticated ? (
              <span>
                Welcome to <span style={styles.highlightText}>Learning!</span>
              </span>
            ) : (
              <span>
                Find Your <span style={styles.highlightText}>Perfect Course</span>
              </span>
            )}
          </motion.h1>
          <motion.p style={styles.heroSubtitle} variants={heroVariants}>
            Discover top courses tailored to your goals with CourseComparison.
          </motion.p>
          <motion.div style={styles.searchContainer} variants={heroVariants}>
            <span style={styles.searchIcon} className="search-bar">
              {searchLoading ? (
                <div style={styles.searchSpinner}></div>
              ) : (
                <FaSearch style={styles.icon} className="search-icon" />
              )}
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search courses..."
              style={styles.searchInput}
              className="search-input"
            />
          </motion.div>
          <motion.div style={styles.buttonGroup} variants={heroVariants}>
            <Link to="/compare" style={styles.primaryButton} className="primary-button">
              Explore Courses
            </Link>
          </motion.div>
        </div>
      </motion.header>

      {/* Top 3 Courses Section */}
      <motion.section style={styles.section} initial="hidden" animate="visible" variants={heroVariants}>
        <h2 style={styles.sectionTitle}>
          <FaStar style={styles.icon} /> Top-Rated Courses
        </h2>
        <div style={styles.topCoursesRow}>
          {courses.slice(0, 3).map((course, index) => (
            <motion.div
              key={course.id}
              style={styles.topCard}
              className="top-card"
              variants={cardVariants}
              custom={index}
              whileHover={{ scale: 1.03 }}
            >
              <div
                style={{
                  ...styles.courseImage,
                  backgroundImage: `url(${course.image || 'https://source.unsplash.com/300x140/?course'})`,
                }}
                className="course-image"
              ></div>
              <h3 style={styles.courseTitle}>{course.Name}</h3>
              <p style={styles.courseInstitute}>{course.Institute}</p>
              <div style={styles.rating}>
                <span style={styles.ratingStars}>{'★'.repeat(Math.round(course.Rating))}</span>
                <span style={styles.ratingEmptyStars}>{'★'.repeat(5 - Math.round(course.Rating))}</span>
                <span style={styles.ratingText}>({course.Rating})</span>
              </div>
              <Link to={`/courses/${course.id}`} style={styles.topButton} className="top-button">
                View Details
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Featured Courses Section */}
      <motion.section style={styles.section} initial="hidden" animate="visible" variants={heroVariants}>
        <h2 style={styles.sectionTitle}>
          <FaGraduationCap style={styles.icon} /> Featured Courses
        </h2>
        <motion.div style={styles.categoryFilter} initial="hidden" animate="visible" variants={heroVariants}>
          <select
            value={category}
            onChange={handleCategoryChange}
            style={styles.categorySelect}
            className="category-select"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </motion.div>
        {filteredCourses.length === 0 ? (
          <motion.p style={styles.noResults} initial="hidden" animate="visible" variants={heroVariants}>
            No courses found. Try a different search or category.
          </motion.p>
        ) : (
          <Slider {...sliderSettings}>
            {filteredCourses.slice(0, visibleCourses).map((course, index) => (
              <motion.div
                key={course.id}
                style={styles.courseSlide}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                custom={index}
              >
                <div style={styles.courseCard} className="course-card">
                  <div
                    style={{
                      ...styles.courseImage,
                      backgroundImage: `url(${course.image || 'https://source.unsplash.com/300x140/?course'})`,
                    }}
                    className="course-image"
                  ></div>
                  <h3 style={styles.courseTitle}>{course.Name}</h3>
                  <p style={styles.courseInstitute}>{course.Institute}</p>
                  <div style={styles.rating}>
                    <span style={styles.ratingStars}>{'★'.repeat(Math.round(course.Rating))}</span>
                    <span style={styles.ratingEmptyStars}>{'★'.repeat(5 - Math.round(course.Rating))}</span>
                    <span style={styles.ratingText}>({course.Rating})</span>
                  </div>
                  <Link to={`/courses/${course.id}`} style={styles.courseLink} className="course-link">
                    Explore <span style={styles.arrow}>→</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </Slider>
        )}
        {visibleCourses < filteredCourses.length && filteredCourses.length > 6 && (
          <motion.button
            onClick={loadMoreCourses}
            style={styles.loadMoreButton}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Load More
          </motion.button>
        )}
      </motion.section>

      {/* Testimonials Section */}
      <motion.section style={styles.testimonialSection} initial="hidden" animate="visible" variants={heroVariants}>
        <h2 style={styles.sectionTitle}>
          <FaQuoteLeft style={styles.icon} /> Learner Reviews
        </h2>
        <Slider {...testimonialSettings}>
          {reviews.length === 0 ? (
            <motion.div style={styles.noReviews} initial="hidden" animate="visible" variants={heroVariants}>
              <p style={styles.noResults}>No reviews yet. Share your experience!</p>
            </motion.div>
          ) : (
            reviews.map((review, index) => (
              <motion.div
                key={review.id}
                style={styles.testimonialSlide}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                custom={index}
              >
                <div style={styles.testimonialCard}>
                  <p style={styles.testimonialText}>"{review.comment}"</p>
                  <div style={styles.rating}>
                    <span style={styles.ratingStars}>{'★'.repeat(Math.round(review.rating))}</span>
                    <span style={styles.ratingEmptyStars}>{'★'.repeat(5 - Math.round(review.rating))}</span>
                  </div>
                  <p style={styles.testimonialUser}>{review.user}</p>
                  <p style={styles.testimonialCourse}>
                    {courses.find((course) => course.id === review.course)?.Name || 'Unknown Course'}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </Slider>
      </motion.section>

      {/* Call to Action Section */}
      <motion.section style={styles.ctaSection} initial="hidden" animate="visible" variants={heroVariants}>
        <h2 style={styles.sectionTitle}>
          <FaRocket style={styles.icon} /> Start Learning Today
        </h2>
        <p style={styles.ctaText}>Join thousands of learners and achieve your goals.</p>
        <Link to={isAuthenticated ? '/dashboard' : '/register'} style={styles.ctaButton} className="cta-button">
          {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
        </Link>
      </motion.section>

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
  loadingContainer: {
    minHeight: '100vh',
    background: '#f0f9ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: '12px',
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '3px solid #2563eb',
    borderTop: '3px solid transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    color: '#1f2937',
    fontWeight: '600',
    fontSize: '14px',
  },
  errorContainer: {
    minHeight: '100vh',
    background: '#f0f9ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#dc2626',
    fontWeight: '600',
    fontSize: '14px',
  },
  header: {
    width: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '60px 0',
    position: 'relative',
  },
  headerContent: {
    maxWidth: '1024px',
    margin: '0 auto',
    padding: '0 16px',
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '12px',
  },
  highlightText: {
    color: '#facc15',
  },
  heroSubtitle: {
    fontSize: '18px',
    color: '#ffffff',
    marginBottom: '20px',
    maxWidth: '540px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  searchContainer: {
    maxWidth: '480px',
    margin: '0 auto 20px',
    display: 'flex',
    alignItems: 'center',
    background: '#ffffff',
    borderRadius: '9999px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    padding: '4px',
  },
  searchIcon: {
    paddingLeft: '12px',
    color: '#6b7280',
  },
  searchSpinner: {
    width: '16px',
    height: '16px',
    border: '2px solid #2563eb',
    borderTop: '2px solid transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  searchInput: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '9999px',
    border: 'none',
    outline: 'none',
    color: '#1f2937',
    fontSize: '14px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
  },
  primaryButton: {
    background: '#2563eb',
    color: '#ffffff',
    fontWeight: '600',
    padding: '10px 24px',
    borderRadius: '9999px',
    textDecoration: 'none',
  },
  main: {
    width: '100%',
    flexGrow: 1,
    padding: '40px 0',
  },
  section: {
    maxWidth: '1024px',
    margin: '0 auto 40px',
    padding: '0 16px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '20px',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  topCoursesRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: '16px',
    overflowX: 'auto',
    paddingBottom: '12px',
  },
  topCard: {
    background: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    padding: '16px',
    minWidth: '260px',
    flex: '0 0 auto',
  },
  courseImage: {
    height: '140px',
    width: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: '6px',
    marginBottom: '12px',
  },
  courseTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '6px',
  },
  courseInstitute: {
    color: 'rgb(107, 114, 128)',
    fontSize: '14px',
    marginBottom: '6px',
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
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
    marginLeft: '6px',
    fontSize: '12px',
  },
  topButton: {
    background: '#2563eb',
    color: '#ffffff',
    fontWeight: '600',
    padding: '8px 16px',
    borderRadius: '6px',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'block',
  },
  categoryFilter: {
    marginBottom: '20px',
    textAlign: 'center',
  },
  categorySelect: {
    padding: '8px 16px',
    fontSize: '14px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    background: '#ffffff',
    outline: 'none',
    color: '#1f2937',
  },
  courseSlide: {
    padding: '0 8px',
  },
  courseCard: {
    background: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    padding: '16px',
  },
  courseLink: {
    color: '#2563eb',
    fontWeight: '500',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
  },
  arrow: {
    display: 'inline-block',
    transition: 'transform 0.3s ease',
  },
  loadMoreButton: {
    display: 'block',
    margin: '20px auto 0',
    padding: '8px 20px',
    background: '#2563eb',
    color: '#ffffff',
    fontWeight: '600',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
  },
  noResults: {
    color: '#1f2937',
    textAlign: 'center',
    fontSize: '16px',
    margin: '20px 0',
  },
  testimonialSection: {
    maxWidth: '1024px',
    margin: '0 auto 40px',
    padding: '24px 16px',
    background: '#f0f9ff',
    borderRadius: '8px',
  },
  testimonialSlide: {
    padding: '0 16px',
  },
  testimonialCard: {
    background: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    textAlign: 'center',
    maxWidth: '480px',
    margin: '0 auto',
  },
  testimonialText: {
    color: '#1f2937',
    fontSize: '16px',
    fontStyle: 'italic',
    marginBottom: '12px',
  },
  testimonialUser: {
    color: '#1f2937',
    fontWeight: '600',
    fontSize: '16px',
  },
  testimonialCourse: {
    color: '#4b5563',
    fontSize: '12px',
  },
  noReviews: {
    textAlign: 'center',
  },
  ctaSection: {
    maxWidth: '1024px',
    margin: '0 auto 40px',
    padding: '0 16px',
    textAlign: 'center',
  },
  ctaText: {
    color: '#1f2937',
    fontSize: '18px',
    maxWidth: '480px',
    margin: '0 auto 20px',
  },
  ctaButton: {
    background: '#2563eb',
    color: '#ffffff',
    fontWeight: '600',
    padding: '10px 24px',
    borderRadius: '9999px',
    textDecoration: 'none',
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
  icon: {
    width: '24px',
    height: '24px',
    color: '#2563eb',
  },
};

export default Home;