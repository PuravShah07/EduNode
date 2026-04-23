import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/auth';
import Navbar from '../components/Navbar';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('LEARNER');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register({ name, email, password, role });
      alert("Registration successful. Please login.");
      navigate('/login');
    } catch (error) {
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-paper-offwhite flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center -mt-10 mb-10">
        <form onSubmit={handleRegister} className="bg-paper-white p-10 rounded-2xl shadow-soft border-t-4 border-accent-coral w-full max-w-md">
          <h2 className="text-3xl font-black uppercase mb-2 text-ink-dark text-center">Join Us</h2>
          <p className="text-ink-gray text-center font-medium mb-8">Create an account to start booking or teaching.</p>
          
          <div className="mb-5">
            <label className="block text-ink-dark font-bold mb-2 uppercase text-sm tracking-wide">Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-accent-coral focus:ring-2 focus:ring-accent-coral focus:ring-opacity-20 transition-colors bg-paper-light font-medium"
              placeholder="John Doe"
              required
            />
          </div>
          
          <div className="mb-5">
            <label className="block text-ink-dark font-bold mb-2 uppercase text-sm tracking-wide">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-accent-coral focus:ring-2 focus:ring-accent-coral focus:ring-opacity-20 transition-colors bg-paper-light font-medium"
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div className="mb-5">
            <label className="block text-ink-dark font-bold mb-2 uppercase text-sm tracking-wide">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-accent-coral focus:ring-2 focus:ring-accent-coral focus:ring-opacity-20 transition-colors bg-paper-light font-medium"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="mb-8">
            <label className="block text-ink-dark font-bold mb-2 uppercase text-sm tracking-wide">I want to...</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)} 
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-accent-coral focus:ring-2 focus:ring-accent-coral focus:ring-opacity-20 transition-colors bg-paper-light font-medium"
            >
              <option value="LEARNER">Learn & Enroll in Courses</option>
              <option value="INSTRUCTOR">Offer Courses & Teach</option>
            </select>
          </div>
          
          <button type="submit" className="w-full bg-accent-coral text-white py-4 rounded-lg font-bold uppercase tracking-wide hover:shadow-soft-hover hover:-translate-y-1 transition-all duration-300">
            Sign Up
          </button>
          
          <div className="mt-8 text-center text-ink-gray font-medium">
            Already have an account? <Link to="/login" className="text-accent-coral font-bold hover:underline">Log in</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;