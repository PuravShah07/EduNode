import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Briefcase, TrendingUp, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <header className="relative pt-[100px] pb-[140px] px-6 w-full bg-paper-offwhite torn-paper-edge mb-[-40px] z-0 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-[-1] opacity-60 pointer-events-none">
        <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-accent-cyan/20 blur-3xl float-slow"></div>
        <div className="absolute -bottom-32 -left-24 w-80 h-80 rounded-full bg-accent-coral/20 blur-3xl float-fast"></div>
        <div className="absolute inset-0 noise-overlay"></div>
      </div>

      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="text-center lg:text-left fade-up">
          <div className="inline-flex items-center gap-2 bg-white/90 border border-gray-200 px-4 py-2 rounded-full text-xs uppercase font-bold tracking-wider text-ink-dark shadow-soft">
            <Sparkles size={14} className="text-accent-coral" /> Course Marketplace
          </div>
          <h1 className="text-5xl md:text-[64px] leading-tight font-black uppercase tracking-wide mt-6 mb-6 text-ink-dark">
            Build Skills That <br/>
            <span className="text-accent-cyan">Create Opportunity</span>
          </h1>
          <p className="text-lg md:text-xl font-medium max-w-2xl mb-10 text-ink-gray">
            Publish premium lessons, enroll instantly, and turn knowledge into momentum. A creator-first marketplace for modern learning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link 
              to="/courses"
              className="bg-accent-cyan text-white px-8 py-4 flex items-center justify-center rounded-lg text-lg font-bold uppercase tracking-wide shadow-soft hover:shadow-soft-hover hover:-translate-y-1 hover:bg-accent-coral transition-all duration-300"
            >
              Explore Courses
            </Link>
            <Link 
              to="/register"
              className="border border-ink-dark/20 bg-white text-ink-dark px-8 py-4 rounded-lg text-lg font-bold uppercase tracking-wide hover:shadow-soft-hover hover:-translate-y-1 transition-all duration-300"
            >
              Become an Instructor
            </Link>
          </div>
          <div className="flex flex-wrap gap-3 mt-8 justify-center lg:justify-start">
            <span className="px-4 py-2 rounded-full bg-white shadow-soft text-ink-dark font-bold text-xs uppercase tracking-wide">Verified Instructors</span>
            <span className="px-4 py-2 rounded-full bg-white shadow-soft text-ink-dark font-bold text-xs uppercase tracking-wide">On-Demand Access</span>
            <span className="px-4 py-2 rounded-full bg-white shadow-soft text-ink-dark font-bold text-xs uppercase tracking-wide">Secure Payments</span>
          </div>
        </div>
        <div className="relative hidden lg:flex justify-center items-center fade-up">
          <div className="relative w-[320px] h-[260px]">
            <div className="absolute -top-8 -right-6 bubble bubble-xl float-slow"></div>
            <div className="absolute bottom-2 -left-6 bubble bubble-lg float-fast"></div>
            <div className="absolute top-10 left-8 bubble bubble-md"></div>
            <div className="absolute bottom-12 right-8 bubble bubble-sm"></div>
            <div className="absolute -bottom-10 -right-10 w-[160px] h-[160px] rounded-full border-[14px] border-white/30 opacity-40"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;