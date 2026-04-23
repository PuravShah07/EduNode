import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/auth';
import Navbar from '../components/Navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (error) {
      alert("Login failed! Ensure backend is running and credentials are correct.");
    }
  };

  return (
    <div className="min-h-screen bg-paper-offwhite flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center -mt-20">
        <form onSubmit={handleLogin} className="bg-paper-white p-10 rounded-2xl shadow-soft border-t-4 border-accent-cyan w-full max-w-md">
          <h2 className="text-3xl font-black uppercase mb-2 text-ink-dark text-center">Welcome Back</h2>
          <p className="text-ink-gray text-center font-medium mb-8">Enter your details to access your account.</p>
          
          <div className="mb-6">
            <label className="block text-ink-dark font-bold mb-2 uppercase text-sm tracking-wide">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan focus:ring-opacity-20 transition-colors bg-paper-light font-medium"
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div className="mb-8">
            <label className="block text-ink-dark font-bold mb-2 uppercase text-sm tracking-wide">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan focus:ring-opacity-20 transition-colors bg-paper-light font-medium"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button type="submit" className="w-full bg-accent-cyan text-white py-4 rounded-lg font-bold uppercase tracking-wide hover:shadow-soft-hover hover:-translate-y-1 transition-all duration-300">
            Log in
          </button>
          
          <div className="mt-8 text-center text-ink-gray font-medium">
            Don't have an account? <Link to="/register" className="text-accent-cyan font-bold hover:underline">Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;