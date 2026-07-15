import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Sparkles, 
  UploadCloud, 
  Cpu, 
  Key, 
  PlayCircle, 
  Eye, 
  GraduationCap, 
  ChevronRight, 
  Star, 
  RefreshCw, 
  BarChart2, 
  Users, 
  BookOpen, 
  Activity 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  // Simulator State
  const [inputText, setInputText] = useState("EduNode is a secure learning marketplace.");
  const [outputText, setOutputText] = useState("");
  const [simStatus, setSimStatus] = useState("idle"); // idle, encrypting, encrypted, decrypting
  const [shuffleText, setShuffleText] = useState("");

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60, damping: 15 } }
  };

  // Cryptographic simulator handler
  const handleEncrypt = () => {
    if (!inputText) return;
    setSimStatus("encrypting");
    let count = 0;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    const interval = setInterval(() => {
      let temp = "";
      for (let i = 0; i < 35; i++) {
        temp += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setShuffleText(temp);
      count++;
      if (count > 12) {
        clearInterval(interval);
        // Base64 mock representation of AES
        const enc = btoa(inputText).substring(0, 24) + "==";
        setOutputText(enc);
        setSimStatus("encrypted");
      }
    }, 80);
  };

  const handleDecrypt = () => {
    setSimStatus("decrypting");
    let count = 0;
    const interval = setInterval(() => {
      let temp = "";
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (let i = 0; i < 20; i++) {
        temp += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setShuffleText(temp);
      count++;
      if (count > 12) {
        clearInterval(interval);
        setOutputText(inputText);
        setSimStatus("idle");
      }
    }, 80);
  };

  return (
    <div className="min-h-screen bg-paper-offwhite text-ink-dark overflow-x-hidden relative selection:bg-accent-cyan selection:text-white">
      <Navbar />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      {/* Modern Hero Section */}
      <header className="relative pt-[120px] pb-[160px] px-6 w-full max-w-[1400px] mx-auto z-10 flex flex-col items-center text-center overflow-hidden">
        {/* Floating gradient circles */}
        <div className="absolute -top-32 -left-32 w-[350px] h-[350px] rounded-full bg-accent-cyan/10 blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 -right-32 w-[400px] h-[400px] rounded-full bg-accent-coral/10 blur-3xl pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full text-xs uppercase font-extrabold tracking-widest text-accent-cyan shadow-sm mb-6"
        >
          <Sparkles size={14} className="text-accent-coral" /> Next-Gen Learning Ecosystem
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 50 }}
          className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-tight max-w-[900px]"
        >
          Secure Your Knowledge. <br />
          <span className="bg-gradient-to-r from-accent-cyan to-blue-600 bg-clip-text text-transparent">Empower Learning.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-lg md:text-xl text-ink-gray font-medium max-w-[700px] mt-6 mb-10"
        >
          A state-of-the-art course marketplace. Instructors secure assets with AES-256 client encryption, while students enjoy dynamic streaming and verified completion paths.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            to="/courses"
            className="bg-accent-cyan text-white px-8 py-4 flex items-center justify-center gap-2 rounded-xl text-lg font-bold uppercase tracking-wide hover:bg-accent-coral shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            Explore Catalog <ChevronRight size={18} />
          </Link>
          <Link
            to="/register"
            className="border border-gray-200 bg-white hover:border-accent-cyan text-ink-dark px-8 py-4 rounded-xl text-lg font-bold uppercase tracking-wide hover:shadow-md transition-all duration-300 flex items-center justify-center hover:-translate-y-0.5"
          >
            Join as Instructor
          </Link>
        </motion.div>

        {/* Feature Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="flex flex-wrap gap-4 mt-12 justify-center"
        >
          <span className="px-4 py-2 rounded-xl bg-white border border-gray-100 shadow-sm text-ink-dark font-black text-xs uppercase tracking-wide flex items-center gap-2">
            <Shield size={14} className="text-accent-cyan" /> AES-256 Encryption
          </span>
          <span className="px-4 py-2 rounded-xl bg-white border border-gray-100 shadow-sm text-ink-dark font-black text-xs uppercase tracking-wide flex items-center gap-2">
            <PlayCircle size={14} className="text-accent-coral" /> Decrypted Streaming
          </span>
          <span className="px-4 py-2 rounded-xl bg-white border border-gray-100 shadow-sm text-ink-dark font-black text-xs uppercase tracking-wide flex items-center gap-2">
            <UploadCloud size={14} className="text-accent-cyan" /> Browser Compression
          </span>
        </motion.div>
      </header>

      {/* Key highlights scrolling band */}
      <section className="py-6 bg-ink-dark overflow-hidden relative z-10 w-full">
        <div className="flex whitespace-nowrap gap-8 animate-marquee text-white/80 font-black text-xs uppercase tracking-[0.25em]">
          <span>AES-256 CIPHER PROTECTION</span>
          <span>•</span>
          <span>REAL-TIME INSTRUCTOR STATS</span>
          <span>•</span>
          <span>ENCRYPTED FILE SHIELDING</span>
          <span>•</span>
          <span>IN-BROWSER IMAGE COMPRESSION</span>
          <span>•</span>
          <span>JWT ACCESS VALIDATION</span>
          <span>•</span>
          <span>DYNAMIC STREAMING DECRYPTION</span>
          <span>•</span>
          <span>AES-256 CIPHER PROTECTION</span>
          <span>•</span>
          <span>REAL-TIME INSTRUCTOR STATS</span>
        </div>
      </section>

      {/* Feature Bento Grid (Magic UI Inspired) */}
      <section className="px-6 py-24 max-w-[1200px] mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black uppercase"
          >
            Secured Technology Architecture
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-ink-gray mt-4 max-w-[600px] mx-auto text-md font-medium"
          >
            Explore the core features driving secure content uploads, dashboard calculations, and encrypted media streaming.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Box 1: Material Shielding */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-soft hover:shadow-soft-hover transition-all duration-300 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-cyan/5 rounded-full blur-xl group-hover:bg-accent-cyan/10 transition-colors"></div>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-accent-cyan/10 text-accent-cyan flex items-center justify-center mb-6">
                <Lock size={22} />
              </div>
              <h3 className="text-2xl font-black uppercase mb-3">AES-256 File Shielding</h3>
              <p className="text-ink-gray text-base leading-relaxed max-w-[500px]">
                Your content is fully encrypted in transit and on the server. Public downloads and leaks are blocked. Only enrolled students can access assets via authorized JWT link tokens.
              </p>
            </div>
            <div className="mt-8 bg-paper-offwhite p-4 rounded-xl border border-gray-100 font-mono text-xs text-ink-gray flex flex-col gap-1 select-none">
              <div>$ openssl enc -aes-256-cbc -salt -in lesson.mp4</div>
              <div className="text-accent-cyan font-bold">[Success] cipher: U2FsdGVkX196M9Q7m...</div>
            </div>
          </motion.div>

          {/* Box 2: Client Resizing */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-3xl p-8 border border-gray-100 shadow-soft hover:shadow-soft-hover transition-all duration-300 flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-accent-coral/10 text-accent-coral flex items-center justify-center mb-6">
                <UploadCloud size={22} />
              </div>
              <h3 className="text-2xl font-black uppercase mb-3">Client Resizing</h3>
              <p className="text-ink-gray text-base leading-relaxed">
                Images are automatically compressed in-browser before upload. Reduces file size, speeds up transmission times, and saves server storage limits.
              </p>
            </div>
            <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
              <span className="text-xs uppercase font-extrabold text-ink-gray">Input: 12MB Image</span>
              <span className="text-xs uppercase font-extrabold text-accent-coral">Uploaded: 1.2MB JPEG (80% compressed)</span>
            </div>
          </motion.div>

          {/* Box 3: Instructor Metrics */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-3xl p-8 border border-gray-100 shadow-soft hover:shadow-soft-hover transition-all duration-300 flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-accent-coral/10 text-accent-coral flex items-center justify-center mb-6">
                <BarChart2 size={22} />
              </div>
              <h3 className="text-2xl font-black uppercase mb-3">Real-Time Metrics</h3>
              <p className="text-ink-gray text-base leading-relaxed">
                Track revenue, enrollments, completion rates, and ratings directly from your instructor workspace. Powered by immediate backend calculation.
              </p>
            </div>
            <div className="mt-8 bg-paper-light p-4 rounded-xl border border-gray-200">
              <div className="text-[10px] uppercase font-bold text-ink-gray mb-1">Interactive Plots</div>
              <div className="flex gap-2 items-end h-12">
                <div className="w-full bg-accent-cyan h-4 rounded"></div>
                <div className="w-full bg-accent-coral h-10 rounded"></div>
                <div className="w-full bg-accent-cyan h-7 rounded"></div>
                <div className="w-full bg-accent-coral h-12 rounded"></div>
              </div>
            </div>
          </motion.div>

          {/* Box 4: Streaming Decryption */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-soft hover:shadow-soft-hover transition-all duration-300 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-coral/5 rounded-full blur-xl group-hover:bg-accent-coral/10 transition-colors"></div>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-accent-cyan/10 text-accent-cyan flex items-center justify-center mb-6">
                <PlayCircle size={22} />
              </div>
              <h3 className="text-2xl font-black uppercase mb-3">Decrypted Streaming</h3>
              <p className="text-ink-gray text-base leading-relaxed max-w-[500px]">
                Enrolled students stream files seamlessly. The Spring Boot backend reads encrypted chunks, decrypts them in-memory, and pipes them straight to HTML5 players. No decrypted files are ever written to the client disk.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-4 border-t border-gray-100 pt-6">
              <div className="h-2 bg-accent-cyan/20 w-full rounded-full overflow-hidden">
                <motion.div 
                  animate={{ x: ["-100%", "100%"] }} 
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                  className="h-full bg-accent-cyan w-1/3 rounded-full"
                ></motion.div>
              </div>
              <span className="text-xs uppercase font-extrabold text-accent-cyan whitespace-nowrap">Decrypting stream...</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Interactive Cryptographic Simulator */}
      <section className="px-6 py-24 bg-paper-light border-y border-gray-200 relative z-10">
        <div className="max-w-[1000px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text content */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 bg-accent-cyan/10 border border-accent-cyan/20 px-3 py-1.5 rounded-full text-[10px] uppercase font-black text-accent-cyan tracking-wider">
              Interactive simulator
            </div>
            <h2 className="text-3xl md:text-4xl font-black uppercase">
              See the Encryption in Action
            </h2>
            <p className="text-ink-gray leading-relaxed font-medium">
              Type any plain text message below, click encrypt, and see how our system processes and secures data with cryptographic keys.
            </p>
            <div className="space-y-3">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={simStatus === "encrypting" || simStatus === "decrypting"}
                placeholder="Enter some text..."
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/15 bg-white font-medium text-sm transition-all"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleEncrypt}
                  disabled={simStatus !== "idle" && simStatus !== "decrypted"}
                  className="flex-1 bg-accent-cyan text-white py-3 rounded-xl font-bold uppercase text-xs hover:bg-accent-coral transition-colors disabled:opacity-40 hover:shadow-md"
                >
                  Run Encryption
                </button>
                <button
                  onClick={handleDecrypt}
                  disabled={simStatus !== "encrypted"}
                  className="flex-1 border border-gray-300 bg-white text-ink-dark py-3 rounded-xl font-bold uppercase text-xs hover:border-accent-cyan transition-colors disabled:opacity-40"
                >
                  Run Decryption
                </button>
              </div>
            </div>
          </div>

          {/* Visualization Console */}
          <div className="lg:col-span-7 bg-ink-dark rounded-3xl p-6 md:p-8 text-white font-mono text-sm relative overflow-hidden border border-gray-800 shadow-xl min-h-[300px] flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
            
            {/* Header tags */}
            <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
              </div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-gray-500">AES-256 CONSOLE</span>
            </div>

            {/* Simulated Shell Screen */}
            <div className="flex-1 flex flex-col justify-center space-y-4">
              <div>
                <span className="text-accent-cyan font-bold mr-2">&gt;</span> 
                <span className="text-gray-400">Plaintext Input:</span>
                <div className="mt-1 text-white font-semibold">{inputText || <span className="text-gray-600">empty</span>}</div>
              </div>

              {simStatus === "encrypting" && (
                <div className="animate-pulse space-y-1">
                  <div className="text-xs text-accent-coral font-bold uppercase flex items-center gap-2">
                    <RefreshCw className="animate-spin" size={12} /> Running CBC-Salting Cipher...
                  </div>
                  <div className="text-xs text-gray-500 break-all">{shuffleText}</div>
                </div>
              )}

              {simStatus === "decrypting" && (
                <div className="animate-pulse space-y-1">
                  <div className="text-xs text-accent-cyan font-bold uppercase flex items-center gap-2">
                    <RefreshCw className="animate-spin" size={12} /> Access Checked: Decrypting blocks...
                  </div>
                  <div className="text-xs text-gray-500 break-all">{shuffleText}</div>
                </div>
              )}

              {simStatus === "encrypted" && (
                <motion.div 
                  initial={{ scale: 0.98, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="space-y-1"
                >
                  <div className="text-xs text-red-400 font-extrabold uppercase flex items-center gap-1.5">
                    <Lock size={12} /> Cipher Output (Stored in DB):
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10 break-all text-xs font-bold text-green-400 select-all">
                    {outputText}
                  </div>
                </motion.div>
              )}

              {simStatus === "idle" && outputText && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="text-xs text-green-400 font-extrabold uppercase flex items-center gap-1.5">
                    <Shield size={12} /> Decrypted Output:
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10 text-white font-bold">
                    {outputText}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer status bar */}
            <div className="border-t border-white/10 pt-4 mt-4 flex justify-between items-center text-xs text-gray-500 font-black uppercase">
              <span>Status: {simStatus}</span>
              <span className="text-accent-cyan">Key Length: 256 bits</span>
            </div>

          </div>
        </div>
      </section>

      {/* Role Workspace Showcase Section */}
      <section className="px-6 py-24 max-w-[1200px] mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black uppercase"
          >
            Modular Workspace Roles
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-ink-gray mt-4 max-w-[600px] mx-auto text-md font-medium"
          >
            EduNode isolates student, creator, and administrator tools into dedicated interfaces.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Role 1 */}
          <motion.div 
            whileHover={{ y: -6 }}
            className="bg-white rounded-3xl shadow-soft p-8 border border-gray-100 flex flex-col justify-between h-[360px] group transition-all duration-300"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-accent-cyan/10 text-accent-cyan flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <GraduationCap size={24} />
              </div>
              <h3 className="text-xl font-bold uppercase mb-2">Learner Console</h3>
              <p className="text-ink-gray text-sm leading-relaxed">
                Browse catalog, enroll instantly, and stream course videos or download documents decrypted in-memory directly within your web browser. Mark courses complete and review ratings.
              </p>
            </div>
            <Link to="/courses" className="text-xs uppercase font-extrabold text-accent-cyan hover:text-accent-coral flex items-center gap-1 transition-colors">
              Browse Catalogue <ChevronRight size={14} />
            </Link>
          </motion.div>

          {/* Role 2 */}
          <motion.div 
            whileHover={{ y: -6 }}
            className="bg-white rounded-3xl shadow-soft p-8 border border-gray-100 flex flex-col justify-between h-[360px] group transition-all duration-300"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-accent-coral/10 text-accent-coral flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart2 size={24} />
              </div>
              <h3 className="text-xl font-bold uppercase mb-2">Instructor Studio</h3>
              <p className="text-ink-gray text-sm leading-relaxed">
                Author courses, set pricing models, and upload materials using client-side compression. Track earnings, student enrollments, completion rates, and average rating feedback.
              </p>
            </div>
            <Link to="/register" className="text-xs uppercase font-extrabold text-accent-coral hover:text-accent-cyan flex items-center gap-1 transition-colors">
              Register Studio <ChevronRight size={14} />
            </Link>
          </motion.div>

          {/* Role 3 */}
          <motion.div 
            whileHover={{ y: -6 }}
            className="bg-white rounded-3xl shadow-soft p-8 border border-gray-100 flex flex-col justify-between h-[360px] group transition-all duration-300"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-accent-cyan/10 text-accent-cyan flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Eye size={24} />
              </div>
              <h3 className="text-xl font-bold uppercase mb-2">Admin Dashboard</h3>
              <p className="text-ink-gray text-sm leading-relaxed">
                Oversee entire application operations. Review registered student logs, audit instructor counts, and inspect global enrollment directories through a centralized database console.
              </p>
            </div>
            <Link to="/login" className="text-xs uppercase font-extrabold text-accent-cyan hover:text-accent-coral flex items-center gap-1 transition-colors">
              Staff Portal <ChevronRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-24 bg-white relative z-10 border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase text-ink-dark">
              Creator & Student Feedback
            </h2>
            <p className="text-ink-gray mt-3 text-md font-medium">Hear how our community relies on cryptographic shielding for learning.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-paper-offwhite rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-1 text-yellow-500 mb-4">
                <Star size={16} className="fill-yellow-500" />
                <Star size={16} className="fill-yellow-500" />
                <Star size={16} className="fill-yellow-500" />
                <Star size={16} className="fill-yellow-500" />
                <Star size={16} className="fill-yellow-500" />
              </div>
              <p className="text-ink-gray text-sm italic leading-relaxed">
                "The decrypting player is fast. I was initially worried streaming encrypted files might cause lagging, but the chunked streaming works seamlessly in the background."
              </p>
              <div className="mt-6 text-xs font-black text-ink-dark uppercase tracking-wider">— Learner Graduate</div>
            </div>

            <div className="bg-paper-offwhite rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-1 text-accent-cyan mb-4">
                <Star size={16} className="fill-accent-cyan" />
                <Star size={16} className="fill-accent-cyan" />
                <Star size={16} className="fill-accent-cyan" />
                <Star size={16} className="fill-accent-cyan" />
                <Star size={16} className="fill-accent-cyan" />
              </div>
              <p className="text-ink-gray text-sm italic leading-relaxed">
                "As a programming instructor, knowing that my lecture slides and videos cannot be scraped or shared with unauthorized links gives me complete peace of mind."
              </p>
              <div className="mt-6 text-xs font-black text-ink-dark uppercase tracking-wider">— Course Instructor</div>
            </div>

            <div className="bg-paper-offwhite rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-1 text-yellow-500 mb-4">
                <Star size={16} className="fill-yellow-500" />
                <Star size={16} className="fill-yellow-500" />
                <Star size={16} className="fill-yellow-500" />
                <Star size={16} className="fill-yellow-500" />
                <Star size={16} className="fill-yellow-500" />
              </div>
              <p className="text-ink-gray text-sm italic leading-relaxed">
                "The automatic temp file cleanups on stream closure prevent file leaks. Hibernate auto-migrations upgraded the tables smoothly, allowing seamless stat cascade updates."
              </p>
              <div className="mt-6 text-xs font-black text-ink-dark uppercase tracking-wider">— Operations Architect</div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Call to Action (CTA) */}
      <section className="px-6 py-24 relative z-10 max-w-[1200px] mx-auto">
        <div className="bg-ink-dark text-white rounded-[40px] p-10 md:p-16 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent-cyan/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-coral/15 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 text-center max-w-[700px] mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
              Deliver Knowledge Safely
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed font-medium">
              Create your creator studio or enroll directly to test client file updates, secure storage parameters, and decrypted video streams.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="bg-accent-cyan hover:bg-accent-coral text-white px-8 py-4 rounded-xl font-bold uppercase text-xs tracking-wider transition-all duration-300 shadow-md hover:-translate-y-0.5"
              >
                Sign Up Now
              </Link>
              <Link 
                to="/courses" 
                className="border border-white/20 bg-white/5 hover:bg-white/10 px-8 py-4 rounded-xl font-bold uppercase text-xs tracking-wider transition-all duration-300 hover:-translate-y-0.5"
              >
                Explore catalogue
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink-dark text-paper-white py-12 px-6 relative z-10 border-t border-white/5">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-2xl font-black font-heading mb-4 md:mb-0 flex items-center gap-2">
            Edu<span className="text-accent-cyan">Node</span>
          </div>
          <div className="text-sm font-medium text-gray-400">
            &copy; {new Date().getFullYear()} EduNode Learning. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;