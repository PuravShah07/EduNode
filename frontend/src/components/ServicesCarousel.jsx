import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllCourses } from '../api/courses';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

const ServicesCarousel = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getAllCourses();
        // Take top 6 courses for grid display
        setCourses(response.data.slice(0, 6));
        setError('');
      } catch (error) {
        console.error('Failed to fetch courses', error);
        const message = error?.response?.status === 401
          ? 'Log in to explore featured courses.'
          : (error?.response?.data?.message || 'Unable to load courses right now.');
        setError(message);
        setCourses([]);
      }
    };
    fetchCourses();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } }
  };

  return (
    <section className='bg-paper-light py-[120px] px-6 relative z-[1]'>
      <div className='max-w-[1200px] mx-auto'>
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='text-3xl md:text-5xl font-black uppercase mb-12 text-center text-ink-dark tracking-wide'
        >
          Top Courses
        </motion.h2>
        
        {error ? (
          <div className='text-center text-ink-gray font-medium bg-white p-8 rounded-xl shadow-soft border border-gray-100 max-w-xl mx-auto'>
            <p className='mb-4'>{error}</p>
            <Link to='/login' className='text-accent-cyan font-bold hover:underline'>Go to Login</Link>
          </div>
        ) : courses.length === 0 ? (
          <div className='text-center text-ink-gray py-10 bg-white rounded-xl max-w-xl mx-auto border border-gray-100 shadow-soft'>
            No courses available yet.
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
          >
            {courses.map((course, idx) => (
              <motion.div
                variants={itemVariants}
                key={course.id || idx}
                whileHover={{ y: -8, scale: 1.02 }}
                className="w-full"
              >
                <Link 
                  to={`/courses/${course.id}`}
                  className='bg-paper-white p-5 rounded-[16px] shadow-soft hover:shadow-soft-hover transition-all duration-300 cursor-pointer flex flex-col group h-full border border-gray-100'
                >
                  <div className='bg-gray-100 h-48 rounded-xl mb-4 overflow-hidden relative'>
                    <img 
                      src={`https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80`} 
                      alt={course.title} 
                      className='object-cover w-full h-full group-hover:scale-105 transition-transform duration-500' 
                    />
                    <div className='absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full font-bold text-ink-dark text-sm shadow-sm'>
                      INR {course.price}
                    </div>
                  </div>
                  <h3 className='text-xl font-bold mb-2 font-heading text-ink-dark tracking-tight leading-tight group-hover:text-accent-cyan transition-colors duration-300'>{course.title}</h3>
                  <p className='text-ink-gray text-sm font-medium mb-6 flex-grow line-clamp-2'>{course.description}</p>
                  
                  <div className='w-full mt-auto py-3 rounded-lg border-2 border-accent-cyan text-accent-cyan text-center font-bold uppercase tracking-wide group-hover:bg-accent-cyan group-hover:text-white transition-colors duration-300 flex items-center justify-center gap-2'>
                    <BookOpen size={16} /> View Details
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ServicesCarousel;