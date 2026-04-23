import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getAllCourses } from '../api/courses';

const ServicesCarousel = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getAllCourses();
        // Take top 6 courses for carousel
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

  return (
    <section className='bg-paper-light py-[120px] px-6 relative z-[1]'>
      <div className='max-w-[1200px] mx-auto'>
        <h2 className='text-3xl md:text-5xl font-black uppercase mb-12 text-center text-ink-dark tracking-wide'>
          Top Courses
        </h2>
        
        {error ? (
          <div className='text-center text-ink-gray font-medium bg-white p-8 rounded-xl shadow-soft border border-gray-100'>
            <p className='mb-4'>{error}</p>
            <Link to='/login' className='text-accent-cyan font-bold hover:underline'>Go to Login</Link>
          </div>
        ) : (
          <div 
            ref={carouselRef}
            className='flex overflow-x-auto space-x-6 md:space-x-8 pb-12 snap-x snap-mandatory hide-scrollbar'
          >
            {courses.map((course, idx) => (
              <Link 
                to={`/courses/${course.id}`}
                key={idx} 
                className='snap-start min-w-[280px] md:min-w-[320px] bg-paper-white p-5 rounded-[16px] shadow-soft hover:-translate-y-2 hover:rotate-1 hover:shadow-soft-hover transition-all duration-300 cursor-pointer flex flex-col group block'
              >
                <div className='bg-gray-200 h-48 rounded-xl mb-4 overflow-hidden relative'>
                  <img 
                    src={`https://source.unsplash.com/random/400x300/?course,${course.title.split(' ')[0]}`} 
                    alt={course.title} 
                    className='object-cover w-full h-full group-hover:scale-110 transition-transform duration-500' 
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80' }}
                  />
                  <div className='absolute top-3 right-3 bg-white px-3 py-1 rounded-full font-bold text-ink-dark text-sm shadow-sm'>
                    INR {course.price}
                  </div>
                </div>
                <h3 className='text-xl font-bold mb-2 font-heading text-ink-dark tracking-tight leading-tight'>{course.title}</h3>
                <p className='text-ink-gray text-sm font-medium mb-4 flex-grow line-clamp-2'>{course.description}</p>
                
                <div className='w-full mt-auto py-3 rounded-lg border-2 border-accent-cyan text-accent-cyan text-center font-bold uppercase tracking-wide group-hover:bg-accent-cyan group-hover:text-white transition-colors duration-300'>
                  View Details
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesCarousel;