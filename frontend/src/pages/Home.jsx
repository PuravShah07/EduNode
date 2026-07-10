import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ServicesCarousel from '../components/ServicesCarousel';
import { ShieldCheck, Sparkles, Users, Laptop, GraduationCap, BadgeCheck, Flame, Trophy, Wand2, UploadCloud, Layers, PlayCircle, Star } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-paper-offwhite section-glow">
      <Navbar />
      <Hero />

      {/* Highlights Strip */}
      <section className="px-6 py-10">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-accent-cyan/20 flex items-center justify-center text-accent-cyan">
              <Flame size={20} />
            </div>
            <div>
              <div className="text-xs uppercase font-bold text-ink-gray">Fast Launch</div>
              <div className="text-lg font-black text-ink-dark">Publish in minutes</div>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-accent-coral/20 flex items-center justify-center text-accent-coral">
              <Trophy size={20} />
            </div>
            <div>
              <div className="text-xs uppercase font-bold text-ink-gray">Quality First</div>
              <div className="text-lg font-black text-ink-dark">Curated creators</div>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-ink-dark/10 flex items-center justify-center text-ink-dark">
              <Wand2 size={20} />
            </div>
            <div>
              <div className="text-xs uppercase font-bold text-ink-gray">Smart Learning</div>
              <div className="text-lg font-black text-ink-dark">Build real skills</div>
            </div>
          </div>
        </div>
      </section>

      {/* Motion Band */}
      <section className="px-6 py-6">
        <div className="max-w-[1200px] mx-auto bg-ink-dark text-white rounded-2xl px-6 py-4">
          <div className="marquee">
            <div className="marquee-track text-xs uppercase font-bold tracking-[0.25em] text-white/70">
              <span>COURSE CREATION</span>
              <span>•</span>
              <span>INSTRUCTOR TOOLS</span>
              <span>•</span>
              <span>SECURE PAYMENTS</span>
              <span>•</span>
              <span>COMMUNITY LEARNING</span>
              <span>•</span>
              <span>PREMIUM CONTENT</span>
              <span>•</span>
              <span>COURSE CREATION</span>
              <span>•</span>
              <span>INSTRUCTOR TOOLS</span>
              <span>•</span>
              <span>SECURE PAYMENTS</span>
              <span>•</span>
              <span>COMMUNITY LEARNING</span>
              <span>•</span>
              <span>PREMIUM CONTENT</span>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="px-6 py-14 bg-paper-light torn-paper-edge">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl md:text-5xl font-black uppercase text-ink-dark mb-8 text-center">Why Learners Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-soft p-8 border border-gray-100 premium-border">
              <div className="bg-white rounded-2xl p-6">
              <ShieldCheck className="text-accent-cyan mb-4" size={28} />
              <h3 className="text-xl font-bold mb-2">Trusted & Secure</h3>
              <p className="text-ink-gray">Protected payments, verified instructors, and clear refund rules for peace of mind.</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-soft p-8 border border-gray-100 premium-border">
              <div className="bg-white rounded-2xl p-6">
              <Sparkles className="text-accent-coral mb-4" size={28} />
              <h3 className="text-xl font-bold mb-2">Creator First</h3>
              <p className="text-ink-gray">Launch courses fast, upload materials, and keep ownership of your content.</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-soft p-8 border border-gray-100 premium-border">
              <div className="bg-white rounded-2xl p-6">
              <Users className="text-accent-cyan mb-4" size={28} />
              <h3 className="text-xl font-bold mb-2">Community-Led</h3>
              <p className="text-ink-gray">Learn with peers, get course updates, and join growing communities.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-14">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
            <h2 className="text-3xl md:text-5xl font-black uppercase text-ink-dark">How It Works</h2>
            <p className="text-ink-gray max-w-xl">From idea to enrollment in three steps. Built for creators who want to launch fast and grow audience trust.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-soft p-8 border border-gray-100 glass-card">
              <div className="w-12 h-12 rounded-2xl bg-accent-cyan/20 flex items-center justify-center text-accent-cyan mb-5">
                <UploadCloud size={22} />
              </div>
              <div className="text-xs uppercase font-bold text-ink-gray">Step 01</div>
              <h3 className="text-xl font-bold mb-2">Upload Your Course</h3>
              <p className="text-ink-gray">Add videos, PDFs, and docs in minutes. Keep your content organized and secure.</p>
            </div>
            <div className="bg-white rounded-2xl shadow-soft p-8 border border-gray-100 glass-card">
              <div className="w-12 h-12 rounded-2xl bg-accent-coral/20 flex items-center justify-center text-accent-coral mb-5">
                <Layers size={22} />
              </div>
              <div className="text-xs uppercase font-bold text-ink-gray">Step 02</div>
              <h3 className="text-xl font-bold mb-2">Publish & Price</h3>
              <p className="text-ink-gray">Set your pricing, launch the course, and present a premium learning path.</p>
            </div>
            <div className="bg-white rounded-2xl shadow-soft p-8 border border-gray-100 glass-card">
              <div className="w-12 h-12 rounded-2xl bg-ink-dark/10 flex items-center justify-center text-ink-dark mb-5">
                <PlayCircle size={22} />
              </div>
              <div className="text-xs uppercase font-bold text-ink-gray">Step 03</div>
              <h3 className="text-xl font-bold mb-2">Grow Enrollments</h3>
              <p className="text-ink-gray">Learners enroll instantly and start watching. Track performance from your dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Collections */}
      <section className="px-6 py-14 bg-ink-dark text-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
            <h2 className="text-3xl md:text-5xl font-black uppercase">Curated Collections</h2>
            <p className="text-gray-300 max-w-xl">Premium bundles crafted by top instructors for focused outcomes.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
              <div className="text-xs uppercase font-bold text-gray-300">Collection</div>
              <div className="text-2xl font-black mt-2">Zero to Product</div>
              <div className="text-gray-300 mt-3">Design, build, and launch a product with expert mentorship.</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
              <div className="text-xs uppercase font-bold text-gray-300">Collection</div>
              <div className="text-2xl font-black mt-2">Creator Business</div>
              <div className="text-gray-300 mt-3">Pricing, marketing, and growth systems built for creators.</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
              <div className="text-xs uppercase font-bold text-gray-300">Collection</div>
              <div className="text-2xl font-black mt-2">Elite Skills</div>
              <div className="text-gray-300 mt-3">Advanced tactics across product, growth, and leadership.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Highlights */}
      <section className="px-6 py-14">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl md:text-5xl font-black uppercase text-ink-dark mb-8 text-center">Featured Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-soft p-8 border border-gray-100 hover:-translate-y-1 transition-transform">
              <Laptop className="text-accent-cyan mb-4" size={28} />
              <h3 className="text-xl font-bold mb-2">Web & Product</h3>
              <p className="text-ink-gray">Build, design, and ship with real-world projects.</p>
            </div>
            <div className="bg-white rounded-2xl shadow-soft p-8 border border-gray-100 hover:-translate-y-1 transition-transform">
              <GraduationCap className="text-accent-coral mb-4" size={28} />
              <h3 className="text-xl font-bold mb-2">Business Growth</h3>
              <p className="text-ink-gray">From marketing to operations, learn what scales.</p>
            </div>
            <div className="bg-white rounded-2xl shadow-soft p-8 border border-gray-100 hover:-translate-y-1 transition-transform">
              <BadgeCheck className="text-accent-cyan mb-4" size={28} />
              <h3 className="text-xl font-bold mb-2">Expert Certs</h3>
              <p className="text-ink-gray">Earn credibility with instructor-verified courses.</p>
            </div>
          </div>
        </div>
      </section>

      <ServicesCarousel />

      {/* Testimonials */}
      <section className="px-6 py-14">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl md:text-5xl font-black uppercase text-ink-dark mb-8 text-center">Learner Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-soft p-8 border border-gray-100">
              <div className="flex items-center gap-2 text-accent-coral mb-4">
                <Star size={16} /><Star size={16} /><Star size={16} /><Star size={16} /><Star size={16} />
              </div>
              <p className="text-ink-gray">"Clear, structured lessons with real outcomes. The material library is excellent."</p>
              <div className="mt-4 text-sm font-bold text-ink-dark">— Product Designer</div>
            </div>
            <div className="bg-white rounded-2xl shadow-soft p-8 border border-gray-100">
              <div className="flex items-center gap-2 text-accent-cyan mb-4">
                <Star size={16} /><Star size={16} /><Star size={16} /><Star size={16} /><Star size={16} />
              </div>
              <p className="text-ink-gray">"I launched my first course in a weekend. Uploads and pricing were effortless."</p>
              <div className="mt-4 text-sm font-bold text-ink-dark">— Growth Marketer</div>
            </div>
            <div className="bg-white rounded-2xl shadow-soft p-8 border border-gray-100">
              <div className="flex items-center gap-2 text-accent-coral mb-4">
                <Star size={16} /><Star size={16} /><Star size={16} /><Star size={16} /><Star size={16} />
              </div>
              <p className="text-ink-gray">"The dashboard keeps everything clean. Learners find content quickly."</p>
              <div className="mt-4 text-sm font-bold text-ink-dark">— Instructor</div>
            </div>
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
            <h2 className="text-3xl md:text-5xl font-black uppercase mb-4">Ready to Launch Your Course?</h2>
            <p className="text-gray-300 text-lg mb-8">Create a course in minutes, upload videos and documents, and reach learners instantly.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/register" className="bg-accent-cyan text-white px-8 py-4 rounded-lg font-bold uppercase text-center hover:bg-accent-coral transition-colors">Become an Instructor</a>
              <a href="/courses" className="border border-white/30 px-8 py-4 rounded-lg font-bold uppercase text-center hover:bg-white/10 transition-colors">Browse Courses</a>
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