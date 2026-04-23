import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getAllCourses } from '../api/courses';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('latest');

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchCourses();
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, sort]);

  const fetchCourses = async () => {
    try {
      const response = await getAllCourses(search, sort);
      setCourses(response.data);
      setError('');
    } catch (error) {
      console.error('Failed to load courses', error);
      const message = error?.response?.status === 401
        ? 'Please log in to view courses.'
        : (error?.response?.data?.message || 'Unable to load courses right now.');
      setError(message);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-paper-offwhite'>
      <Navbar />
      <div className='pt-20 pb-12 px-6 max-w-[1200px] mx-auto min-h-[80vh]'>
        <h1 className='text-4xl md:text-5xl font-black uppercase text-ink-dark mb-10 text-center tracking-tight'>
          All <span className='text-accent-cyan'>Courses</span>
        </h1>
        
        <div className='flex flex-col md:flex-row gap-4 items-center justify-between mb-8 bg-white p-4 rounded-xl shadow-soft border border-gray-100'>
          <div className='w-full md:w-2/3'>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search courses or instructors...'
              className='w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan focus:ring-opacity-20 transition-colors bg-paper-light font-medium'
            />
          </div>
          <div className='w-full md:w-1/3 flex gap-3'>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className='w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan focus:ring-opacity-20 transition-colors bg-paper-light font-medium'
            >
              <option value='latest'>Latest</option>
              <option value='price_asc'>Price: Low to High</option>
              <option value='price_desc'>Price: High to Low</option>
            </select>
            <button
              type='button'
              onClick={() => { setSearch(''); setSort('latest'); }}
              className='px-4 py-3 rounded-lg border border-gray-200 font-bold uppercase text-sm hover:bg-paper-light'
            >
              Clear
            </button>
          </div>
        </div>

        {loading ? (
          <div className='text-center text-ink-gray font-medium text-xl'>Loading courses...</div>
        ) : error ? (
          <div className='text-center text-ink-gray font-medium text-lg bg-white p-8 rounded-xl shadow-soft border border-gray-100'>
            <p className='mb-4'>{error}</p>
            <Link to='/login' className='text-accent-cyan font-bold hover:underline'>Go to Login</Link>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {courses.map((course) => (
              <Link 
                to={`/courses/${course.id}`}
                key={course.id} 
                className='bg-paper-white p-6 rounded-[16px] shadow-soft hover:-translate-y-2 hover:shadow-soft-hover transition-all duration-300 flex flex-col group block'
              >
                <div className='bg-gray-100 h-52 rounded-xl mb-6 overflow-hidden relative'>
                  <img 
                    src={`https://source.unsplash.com/random/400x300/?work,${course.title.split(' ')[0]}`} 
                    alt={course.title} 
                    className='object-cover w-full h-full group-hover:scale-105 transition-transform duration-500' 
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80' }}
                  />
                  <div className='absolute top-4 right-4 bg-accent-coral text-white px-4 py-1 flex items-center justify-center rounded-full font-bold shadow'>
                    INR {course.price}
                  </div>
                </div>
                <h3 className='text-2xl font-bold mb-3 font-heading text-ink-dark leading-tight group-hover:text-accent-cyan transition-colors'>{course.title}</h3>
                <p className='text-ink-gray font-medium mb-6 flex-grow'>{course.description}</p>
                <div className='w-full text-center py-4 bg-ink-dark text-paper-white rounded-lg font-bold uppercase tracking-wide group-hover:bg-accent-cyan transition-colors duration-300'>
                  View Details
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;