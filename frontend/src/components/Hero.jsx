import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, UploadCloud, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <header className="relative pt-[100px] pb-[140px] px-6 w-full bg-paper-offwhite torn-paper-edge mb-[-40px] z-0 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-[-1] opacity-60 pointer-events-none">
        <motion.div 
          animate={{
            y: [0, -15, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-accent-cyan/20 blur-3xl"
        ></motion.div>
        <motion.div 
          animate={{
            y: [0, 15, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -bottom-32 -left-24 w-80 h-80 rounded-full bg-accent-coral/20 blur-3xl"
        ></motion.div>
        <div className="absolute inset-0 noise-overlay"></div>
      </div>

      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center lg:text-left"
        >
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="inline-flex items-center gap-2 bg-white/90 border border-gray-200 px-4 py-2 rounded-full text-xs uppercase font-bold tracking-wider text-ink-dark shadow-soft"
          >
            <Sparkles size={14} className="text-accent-coral" /> Secure Creator-First Learning
          </motion.div>
          <h1 className="text-5xl md:text-[64px] leading-tight font-black uppercase tracking-wide mt-6 mb-6 text-ink-dark">
            Build Skills With <br/>
            <span className="text-accent-cyan">Secure Content</span>
          </h1>
          <p className="text-lg md:text-xl font-medium max-w-2xl mb-10 text-ink-gray">
            Publish premium lessons, enroll directly, and learn with absolute privacy. Built with robust AES-256 material encryption and instant enrollment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/courses"
                className="bg-accent-cyan text-white px-8 py-4 flex items-center justify-center rounded-lg text-lg font-bold uppercase tracking-wide shadow-soft hover:shadow-soft-hover hover:bg-accent-coral transition-all duration-300 w-full"
              >
                Explore Courses
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/register"
                className="border border-ink-dark/20 bg-white text-ink-dark px-8 py-4 rounded-lg text-lg font-bold uppercase tracking-wide hover:shadow-soft-hover transition-all duration-300 flex items-center justify-center w-full"
              >
                Become an Instructor
              </Link>
            </motion.div>
          </div>
          <div className="flex flex-wrap gap-3 mt-8 justify-center lg:justify-start">
            <span className="px-4 py-2 rounded-full bg-white shadow-soft text-ink-dark font-bold text-xs uppercase tracking-wide flex items-center gap-1.5">
              <Shield size={12} className="text-accent-cyan" /> AES-256 Encrypted
            </span>
            <span className="px-4 py-2 rounded-full bg-white shadow-soft text-ink-dark font-bold text-xs uppercase tracking-wide flex items-center gap-1.5">
              <PlayCircle size={12} className="text-accent-coral" /> Instant Stream
            </span>
            <span className="px-4 py-2 rounded-full bg-white shadow-soft text-ink-dark font-bold text-xs uppercase tracking-wide flex items-center gap-1.5">
              <UploadCloud size={12} className="text-accent-cyan" /> Optimized Uploads
            </span>
          </div>
        </motion.div>

        {/* Visual elements */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="relative hidden lg:flex justify-center items-center"
        >
          <div className="relative w-[320px] h-[320px] flex items-center justify-center">
            {/* Interactive/Animated 3D-like bubbles */}
            <motion.div 
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-8 -right-6 bubble bubble-xl"
            ></motion.div>
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-2 -left-6 bubble bubble-lg"
            ></motion.div>
            <motion.div 
              animate={{ x: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 left-8 bubble bubble-md"
            ></motion.div>
            <motion.div 
              animate={{ x: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-12 right-8 bubble bubble-sm"
            ></motion.div>
            <div className="absolute -bottom-10 -right-10 w-[160px] h-[160px] rounded-full border-[14px] border-white/30 opacity-40"></div>
          </div>
        </motion.div>
      </div>
    </header>
  );
};

export default Hero;