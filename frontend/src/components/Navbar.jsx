import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { getMe } from '../api/auth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('token');
  const location = useLocation();

  useEffect(() => {
    if (token) {
      getMe().then(res => setUser(res.data)).catch(() => localStorage.removeItem('token'));
    }
  }, [token, location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  }

  return (
    <nav className='flex items-center justify-between p-6 max-w-[1200px] mx-auto w-full relative z-20 bg-transparent'>
      <Link to='/' className='text-2xl font-bold font-heading text-ink-dark flex items-center gap-2'>
        <img src="/logo.png" alt="EduNode Logo" className="h-8 w-8 object-contain" />
        Edu<span className='text-accent-cyan'>Node</span>
      </Link>
      
      {/* Desktop Menu */}
      <div className='hidden md:flex space-x-8 font-medium'>
        <Link to='/' className='text-ink-dark hover:text-accent-cyan transition-colors duration-200'>Home</Link>
        <Link to='/courses' className='text-ink-dark hover:text-accent-cyan transition-colors duration-200'>Courses</Link>
        {user?.role === 'ROLE_ADMIN' && (
          <Link to='/admin' className='text-ink-dark hover:text-accent-cyan transition-colors duration-200'>Admin</Link>
        )}
      </div>
      
      {/* Auth Buttons */}
      <div className='hidden md:flex space-x-4 items-center'>
        {user ? (
           <>
             <Link to='/dashboard' className='flex items-center gap-2 font-bold text-ink-dark hover:text-accent-cyan px-4'>
               <User size={20} /> {user.name}
             </Link>
             <button onClick={handleLogout} className='bg-accent-coral text-white px-6 py-2 rounded-lg font-bold uppercase tracking-tight shadow-soft hover:shadow-soft-hover hover:-translate-y-0.5 transition-all duration-300'>
               Logout
             </button>
           </>
        ) : (
          <>
            <Link to='/login' className='font-bold text-ink-dark hover:text-accent-cyan px-4'>Log in</Link>
            <Link to='/register' className='bg-accent-cyan text-white px-6 py-3 rounded-lg font-bold uppercase tracking-tight shadow-soft hover:shadow-soft-hover hover:-translate-y-0.5 hover:bg-accent-coral transition-all duration-300'>
              Get Started
            </Link>
          </>
        )}
      </div>

      {/* Mobile Hamburger */}
      <button className='md:hidden text-ink-dark' onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className='absolute top-[80px] left-0 w-full bg-paper-white shadow-soft-hover flex flex-col items-center py-6 space-y-4 md:hidden z-50'>
          <Link to='/' onClick={() => setIsOpen(false)} className='text-ink-dark font-bold text-lg'>Home</Link>
          <Link to='/courses' onClick={() => setIsOpen(false)} className='text-ink-dark font-bold text-lg'>Courses</Link>
          {user?.role === 'ROLE_ADMIN' && (
            <Link to='/admin' onClick={() => setIsOpen(false)} className='text-ink-dark font-bold text-lg'>Admin</Link>
          )}
          
          {user ? (
            <>
              <Link to='/dashboard' onClick={() => setIsOpen(false)} className='text-accent-cyan font-bold text-lg flex items-center gap-2'>
                <User size={20}/> Dashboard
              </Link>
              <button onClick={handleLogout} className='bg-accent-coral text-white px-6 py-3 w-3/4 rounded-lg font-bold uppercase mt-4'>
                Logout
              </button>
            </>
          ) : (
            <Link to='/login' onClick={() => setIsOpen(false)} className='bg-accent-cyan text-white px-6 py-3 w-3/4 text-center rounded-lg font-bold uppercase mt-4'>
              Log in / Get Started
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
