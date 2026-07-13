import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ServicesCarousel from '../components/ServicesCarousel';
import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, Users, Lock, Key, Cpu, GraduationCap, UploadCloud, PlayCircle, Eye, Star, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 70 } }
  };

  return (
    <div className="min-h-screen bg-paper-offwhite section-glow overflow-x-hidden">
      <Navbar />
      <Hero />

      {/* Highlights Strip */}
      <section className="px-6 py-10">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-6 flex items-center gap-4 border border-gray-100/50"
          >
            <div className="w-12 h-12 rounded-2xl bg-accent-cyan/20 flex items-center justify-center text-accent-cyan">
              <UploadCloud size={20} />
            </div>
            <div>
              <div className="text-xs uppercase font-bold text-ink-gray">Optimized Upload</div>
              <div className="text-lg font-black text-ink-dark">Fast Client-Side Compression</div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-6 flex items-center gap-4 border border-gray-100/50"
          >
            <div className="w-12 h-12 rounded-2xl bg-accent-coral/20 flex items-center justify-center text-accent-coral">
              <Lock size={20} />
            </div>
            <div>
              <div className="text-xs uppercase font-bold text-ink-gray">Data Safety</div>
              <div className="text-lg font-black text-ink-dark">AES-256 File Encryption</div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-6 flex items-center gap-4 border border-gray-100/50"
          >
            <div className="w-12 h-12 rounded-2xl bg-ink-dark/10 flex items-center justify-center text-ink-dark">
              <PlayCircle size={20} />
            </div>
            <div>
              <div className="text-xs uppercase font-bold text-ink-gray">Direct Learning</div>
              <div className="text-lg font-black text-ink-dark">Instant Course Enrollment</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Motion Band */}
      <section className="px-6 py-6">
        <div className="max-w-[1200px] mx-auto bg-ink-dark text-white rounded-2xl px-6 py-4 overflow-hidden">
          <div className="marquee">
            <div className="marquee-track text-xs uppercase font-bold tracking-[0.25em] text-white/70">
              <span>AES-256-CBC CIPHER</span>
              <span>•</span>
              <span>INSTRUCTOR WORKSPACE</span>
              <span>•</span>
              <span>STREAMING DECRYPTION</span>
              <span>•</span>
              <span>CLIENT COMPRESSION</span>
              <span>•</span>
              <span>SECURE ACCESS CONTROLS</span>
              <span>•</span>
              <span>ADMIN AUDIT CONSOLE</span>
              <span>•</span>
              <span>AES-256-CBC CIPHER</span>
              <span>•</span>
              <span>INSTRUCTOR WORKSPACE</span>
              <span>•</span>
              <span>STREAMING DECRYPTION</span>
              <span>•</span>
              <span>CLIENT COMPRESSION</span>
              <span>•</span>
              <span>SECURE ACCESS CONTROLS</span>
              <span>•</span>
              <span>ADMIN AUDIT CONSOLE</span>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="px-6 py-14 bg-paper-light torn-paper-edge">
        <div className="max-w-[1200px] mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: -25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black uppercase text-ink-dark mb-8 text-center"
          >
            Secured Learning Architecture
          </motion.h2>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-soft p-8 border border-gray-100 premium-border">
              <div className="bg-white rounded-2xl p-6">
                <ShieldCheck className="text-accent-cyan mb-4" size={28} />
                <h3 className="text-xl font-bold mb-2">Cryptographic Privacy</h3>
                <p className="text-ink-gray">Course materials are fully isolated. Standard directory requests are blocked via JWT authority filters.</p>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-soft p-8 border border-gray-100 premium-border">
              <div className="bg-white rounded-2xl p-6">
                <Sparkles className="text-accent-coral mb-4" size={28} />
                <h3 className="text-xl font-bold mb-2">Direct Access</h3>
                <p className="text-ink-gray">One-click student enrollment instantly links courses to learners without complex payment gate delays.</p>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-soft p-8 border border-gray-100 premium-border">
              <div className="bg-white rounded-2xl p-6">
                <Users className="text-accent-cyan mb-4" size={28} />
                <h3 className="text-xl font-bold mb-2">Role Separation</h3>
                <p className="text-ink-gray">Strict segregation guarantees learners, instructors, and admins interact with secure workspaces.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-14">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <motion.h2 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-black uppercase text-ink-dark"
            >
              How It Works
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-ink-gray max-w-xl"
            >
              From asset protection to dynamical decryption. Designed for creator security and browser playback efficiency.
            </motion.p>
          </div>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-soft p-8 border border-gray-100 glass-card">
              <div className="w-12 h-12 rounded-2xl bg-accent-cyan/20 flex items-center justify-center text-accent-cyan mb-5">
                <UploadCloud size={22} />
              </div>
              <div className="text-xs uppercase font-bold text-ink-gray">Step 01</div>
              <h3 className="text-xl font-bold mb-2">Compress & Encrypt</h3>
              <p className="text-ink-gray">Instructors upload files. Images are compressed in-browser and encrypted with AES-256 before transit.</p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-soft p-8 border border-gray-100 glass-card">
              <div className="w-12 h-12 rounded-2xl bg-accent-coral/20 flex items-center justify-center text-accent-coral mb-5">
                <Key size={22} />
              </div>
              <div className="text-xs uppercase font-bold text-ink-gray">Step 02</div>
              <h3 className="text-xl font-bold mb-2">Configure Target Pricing</h3>
              <p className="text-ink-gray">Instructors publish courses, set reference prices in INR, and define structured learning modules.</p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-soft p-8 border border-gray-100 glass-card">
              <div className="w-12 h-12 rounded-2xl bg-ink-dark/10 flex items-center justify-center text-ink-dark mb-5">
                <PlayCircle size={22} />
              </div>
              <div className="text-xs uppercase font-bold text-ink-gray">Step 03</div>
              <h3 className="text-xl font-bold mb-2">Dynamic Decrypted Streaming</h3>
              <p className="text-ink-gray">Enrolled students stream material. The backend decrypts assets stream-wise directly to the browser view.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Cryptographic Security Details */}
      <section className="px-6 py-14 bg-ink-dark text-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-black uppercase"
            >
              Cryptographic Security Framework
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-gray-300 max-w-xl"
            >
              How our backend protects video files, PDFs, and documents from link leaks and unauthorized scraping.
            </motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-colors duration-300"
            >
              <Lock className="text-accent-cyan mb-4" size={24} />
              <div className="text-xs uppercase font-bold text-gray-300">Cipher Protocol</div>
              <div className="text-2xl font-black mt-2">AES-256-CBC</div>
              <div className="text-gray-300 mt-3 text-sm leading-relaxed">Generates unique keys and initialization vectors (IVs) for every file. Files are stored as encrypted blobs, rendering public links useless.</div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-colors duration-300"
            >
              <Cpu className="text-accent-coral mb-4" size={24} />
              <div className="text-xs uppercase font-bold text-gray-300">Memory Management</div>
              <div className="text-2xl font-black mt-2">Streaming Pipelines</div>
              <div className="text-gray-300 mt-3 text-sm leading-relaxed">Saves file fragments to disk temporary streams, decrypts block-by-block, and cleans up local caches immediately on transfer completion.</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-colors duration-300"
            >
              <Key className="text-accent-cyan mb-4" size={24} />
              <div className="text-xs uppercase font-bold text-gray-300">Authentication Link</div>
              <div className="text-2xl font-black mt-2">Token Param Verification</div>
              <div className="text-gray-300 mt-3 text-sm leading-relaxed">Enables secure token query arguments, authenticating native HTML5 video and document frames that cannot dispatch traditional headers.</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Dashboard Modules */}
      <section className="px-6 py-14">
        <div className="max-w-[1200px] mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black uppercase text-ink-dark mb-12 text-center"
          >
            System Console Features
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-soft p-8 border border-gray-100"
            >
              <GraduationCap className="text-accent-cyan mb-4" size={28} />
              <h3 className="text-xl font-bold mb-2">Learner Workspace</h3>
              <p className="text-ink-gray text-sm leading-relaxed">Browse the course catalog, enroll directly in selected classes, and view dynamically decrypted videos and course docs in real-time.</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-soft p-8 border border-gray-100"
            >
              <UploadCloud className="text-accent-coral mb-4" size={28} />
              <h3 className="text-xl font-bold mb-2">Instructor Dashboard</h3>
              <p className="text-ink-gray text-sm leading-relaxed">Create courses, manage and delete materials, configure reference pricing, and upload documents with visual progress updates.</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-soft p-8 border border-gray-100"
            >
              <Eye className="text-accent-cyan mb-4" size={28} />
              <h3 className="text-xl font-bold mb-2">Admin Command Center</h3>
              <p className="text-ink-gray text-sm leading-relaxed">Monitor overall platform state: audit enrolled users, view registered instructors, and list global course enrollment summaries.</p>
            </motion.div>
          </div>
        </div>
      </section>

      <ServicesCarousel />

      {/* Testimonials */}
      <section className="px-6 py-14">
        <div className="max-w-[1200px] mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black uppercase text-ink-dark mb-12 text-center"
          >
            Verified User Feedback
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-soft p-8 border border-gray-100"
            >
              <div className="flex items-center gap-2 text-accent-coral mb-4">
                <Star size={16} /><Star size={16} /><Star size={16} /><Star size={16} /><Star size={16} />
              </div>
              <p className="text-ink-gray text-sm italic leading-relaxed">"The video player is fast, and it is reassuring to know the learning content is securely decrypted directly to my browser."</p>
              <div className="mt-4 text-xs font-bold text-ink-dark uppercase tracking-wider">— Enrolled Student</div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-soft p-8 border border-gray-100"
            >
              <div className="flex items-center gap-2 text-accent-cyan mb-4">
                <Star size={16} /><Star size={16} /><Star size={16} /><Star size={16} /><Star size={16} />
              </div>
              <p className="text-ink-gray text-sm italic leading-relaxed">"Uploading massive course PDFs and video lessons was remarkably fast due to the built-in browser compression."</p>
              <div className="mt-4 text-xs font-bold text-ink-dark uppercase tracking-wider">— Course Instructor</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-soft p-8 border border-gray-100"
            >
              <div className="flex items-center gap-2 text-accent-coral mb-4">
                <Star size={16} /><Star size={16} /><Star size={16} /><Star size={16} /><Star size={16} />
              </div>
              <p className="text-ink-gray text-sm italic leading-relaxed">"Security checks on enrollment are solid. Dynamic temp files clean up automatically, which prevents server storage leaks."</p>
              <div className="mt-4 text-xs font-bold text-ink-dark uppercase tracking-wider">— System Auditor</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-14">
        <div className="max-w-[1200px] mx-auto bg-ink-dark text-white rounded-3xl p-10 md:p-16 relative overflow-hidden premium-border">
          <div className="bg-ink-dark rounded-3xl p-10 md:p-16">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent-cyan/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-accent-coral/20 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black uppercase mb-4">Protect & Deliver Knowledge</h2>
              <p className="text-gray-300 text-lg mb-8">Launch secure courses in minutes, encrypt resources, and provide instant material playback to authenticated learners.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/register" className="bg-accent-cyan text-white px-8 py-4 rounded-lg font-bold uppercase text-center hover:bg-accent-coral transition-colors flex items-center justify-center gap-2">
                    Create Account <ChevronRight size={16} />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/courses" className="border border-white/30 px-8 py-4 rounded-lg font-bold uppercase text-center hover:bg-white/10 transition-colors flex items-center justify-center">
                    Browse Catalog
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Simple Footer */}
      <footer className="bg-ink-dark text-paper-white py-12 px-6 torn-paper-edge relative z-[2] mt-[-40px]">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center mt-8">
          <div className="text-2xl font-bold font-heading mb-4 md:mb-0 flex items-center gap-2">
            <img src="/logo.png" alt="EduNode Logo" className="h-8 w-8 object-contain" />
            Edu<span className="text-accent-cyan">Node</span>
          </div>
          <div className="text-sm font-medium text-gray-400">
            &copy; {new Date().getFullYear()} EduNode Marketplace. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;