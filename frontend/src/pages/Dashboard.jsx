import React, { useEffect, useState } from 'react';
import { getMe } from '../api/auth';
import { getMyCreatedCourses, getMyEnrolledCourses, createCourse, getInstructorDashboard } from '../api/courses';
import Navbar from '../components/Navbar';
import { PlusCircle, BookOpen, Layers, TrendingUp, Users, Award, Activity, Percent, Star, DollarSign, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  
  // Create Course Modal State
  const [showModal, setShowModal] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: '', description: '', price: '' });
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const userRes = await getMe();
      setUser(userRes.data);

      if (userRes.data.role === 'ROLE_INSTRUCTOR') {
        setStatsLoading(true);
        const createdRes = await getMyCreatedCourses();
        setCourses(createdRes.data);
        
        try {
          const statsRes = await getInstructorDashboard();
          setStats(statsRes.data);
        } catch (e) {
          console.error("Dashboard stats fetch error", e);
        } finally {
          setStatsLoading(false);
        }
      } else {
        const enrollRes = await getMyEnrolledCourses();
        setEnrolled(enrollRes.data);
      }
    } catch (err) {
      console.error("Dashboard fetch error", err);
      if (err?.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await createCourse({
        title: newCourse.title,
        description: newCourse.description,
        price: parseFloat(newCourse.price)
      });
      setShowModal(false);
      setNewCourse({ title: '', description: '', price: '' });
      loadDashboardData(); // reload
    } catch (error) {
      alert("Failed to create course");
    }
  };

  if (loading) return <div className="min-h-screen pt-20 text-center text-xl font-bold">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-paper-offwhite">
      <Navbar />
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        
        {/* Profile Header */}
        <div className="bg-paper-white rounded-2xl shadow-soft p-8 mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-ink-dark uppercase tracking-wide mb-2">
              Hello, <span className="text-accent-cyan">{user?.name}</span>
            </h1>
            <p className="text-ink-gray font-medium text-lg flex items-center gap-2">
              <span className="bg-paper-light px-3 py-1 rounded text-sm uppercase font-bold tracking-wider mr-2">
                {user?.role?.replace('ROLE_', '')}
              </span>
              {user?.email}
            </p>
          </div>
          
          {user?.role === 'ROLE_INSTRUCTOR' && (
            <button 
              onClick={() => setShowModal(true)}
              className="hidden md:flex items-center gap-2 bg-accent-cyan text-white px-6 py-3 rounded-lg font-bold uppercase hover:bg-accent-coral hover:shadow-soft-hover transition-all duration-300 hover:-translate-y-1"
            >
              <PlusCircle size={20} /> Create Course
            </button>
          )}
        </div>

        {/* INSTRUCTOR VIEW */}
        {user?.role === 'ROLE_INSTRUCTOR' && (
          <div className="space-y-10">
            {/* Loading Stats Placeholder */}
            {statsLoading || !stats ? (
              <div className="bg-white rounded-2xl shadow-soft p-8 text-center text-ink-gray font-medium border border-gray-100 animate-pulse">
                Loading dashboard metrics...
              </div>
            ) : (
              <>
                {/* Metric Overview Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {/* Total Revenue */}
                  <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100 flex items-center gap-4 hover:shadow-soft-hover transition-all duration-300">
                    <div className="p-4 rounded-xl bg-accent-cyan/10 text-accent-cyan">
                      <DollarSign size={24} />
                    </div>
                    <div>
                      <div className="text-xs uppercase font-bold tracking-wider text-ink-gray">Total Revenue</div>
                      <div className="text-2xl font-black text-ink-dark">INR {stats.totalRevenue?.toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Monthly Revenue */}
                  <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100 flex items-center gap-4 hover:shadow-soft-hover transition-all duration-300">
                    <div className="p-4 rounded-xl bg-accent-coral/10 text-accent-coral">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <div className="text-xs uppercase font-bold tracking-wider text-ink-gray">Monthly Revenue</div>
                      <div className="text-2xl font-black text-ink-dark">INR {stats.monthlyRevenue?.toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Active Enrollments */}
                  <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100 flex items-center gap-4 hover:shadow-soft-hover transition-all duration-300">
                    <div className="p-4 rounded-xl bg-accent-cyan/10 text-accent-cyan">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <div className="text-xs uppercase font-bold tracking-wider text-ink-gray">Active Enrollments</div>
                      <div className="text-2xl font-black text-ink-dark">{stats.activeEnrollments}</div>
                    </div>
                  </div>

                  {/* Total Students */}
                  <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100 flex items-center gap-4 hover:shadow-soft-hover transition-all duration-300">
                    <div className="p-4 rounded-xl bg-accent-coral/10 text-accent-coral">
                      <Users size={24} />
                    </div>
                    <div>
                      <div className="text-xs uppercase font-bold tracking-wider text-ink-gray">Total Students</div>
                      <div className="text-2xl font-black text-ink-dark">{stats.totalStudents}</div>
                    </div>
                  </div>

                </div>

                {/* Performance Analytics Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Total Courses Summary */}
                  <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100 hover:shadow-soft-hover transition-all duration-300 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-black uppercase text-ink-dark mb-4 flex items-center gap-2">
                        <Layers size={18} className="text-accent-cyan" /> My Total Courses
                      </h3>
                      <div className="text-4xl font-black text-accent-cyan">{stats.totalCourses}</div>
                      <p className="text-xs text-ink-gray mt-2 font-medium">Courses created and managed by you on EduNode.</p>
                    </div>
                  </div>

                  {/* Average Rating Summary */}
                  <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100 hover:shadow-soft-hover transition-all duration-300 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-black uppercase text-ink-dark mb-4 flex items-center gap-2">
                        <Award size={18} className="text-accent-coral" /> Course Rating
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <div className="text-4xl font-black text-ink-dark">{stats.averageCourseRating > 0 ? stats.averageCourseRating.toFixed(1) : "N/A"}</div>
                        <span className="text-sm text-ink-gray font-bold">/ 5.0</span>
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            size={16} 
                            className={`${
                              star <= Math.round(stats.averageCourseRating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Completion Rate Summary */}
                  <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100 hover:shadow-soft-hover transition-all duration-300 flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-black uppercase text-ink-dark mb-2 flex items-center gap-2">
                        <Percent size={18} className="text-accent-cyan" /> Completion Rate
                      </h3>
                      <div className="text-4xl font-black text-accent-cyan mb-1">{stats.courseCompletionRate.toFixed(1)}%</div>
                      <p className="text-[10px] text-ink-gray font-medium">Percent of completions over total enrollments.</p>
                    </div>
                    
                    {/* SVG circular progress ring */}
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="32" cy="32" r="26" stroke="#f3f4f6" strokeWidth="4.5" fill="transparent" />
                        <circle 
                          cx="32" 
                          cy="32" 
                          r="26" 
                          stroke="#06b6d4" 
                          strokeWidth="4.5" 
                          fill="transparent" 
                          strokeDasharray={2 * Math.PI * 26}
                          strokeDashoffset={2 * Math.PI * 26 * (1 - stats.courseCompletionRate / 100)}
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>

                </div>

                {/* SVG Visual Plots Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Revenue Plot */}
                  <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100">
                    <h3 className="text-md font-black uppercase text-ink-dark mb-4 flex items-center gap-2">
                      <TrendingUp size={18} className="text-accent-cyan" /> Revenue by Course
                    </h3>
                    {stats.courseStats?.length === 0 ? (
                      <div className="h-40 flex items-center justify-center text-sm font-bold text-gray-300">No revenue data available.</div>
                    ) : (
                      <div className="w-full">
                        {/* Course Revenue SVG Chart */}
                        <svg viewBox="0 0 500 220" className="w-full h-auto">
                          <defs>
                            <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#06b6d4" />
                              <stop offset="100%" stopColor="#0891b2" />
                            </linearGradient>
                          </defs>
                          
                          {/* Grid lines */}
                          <line x1="50" y1="30" x2="470" y2="30" stroke="#f9fafb" strokeWidth="1" />
                          <line x1="50" y1="95" x2="470" y2="95" stroke="#f3f4f6" strokeWidth="1" />
                          <line x1="50" y1="160" x2="470" y2="160" stroke="#e5e7eb" strokeWidth="1" />
                          
                          {/* Axis lines */}
                          <line x1="50" y1="30" x2="50" y2="160" stroke="#d1d5db" strokeWidth="1.5" />
                          <line x1="50" y1="160" x2="470" y2="160" stroke="#d1d5db" strokeWidth="1.5" />

                          {/* Y Axis Labels */}
                          {(() => {
                            const maxRevenue = Math.max(...stats.courseStats.map(c => c.revenue || 0), 1000);
                            return (
                              <>
                                <text x="42" y="34" textAnchor="end" fontSize="9" fontWeight="bold" fill="#9ca3af">₹{Math.round(maxRevenue).toLocaleString()}</text>
                                <text x="42" y="99" textAnchor="end" fontSize="9" fontWeight="bold" fill="#9ca3af">₹{Math.round(maxRevenue / 2).toLocaleString()}</text>
                                <text x="42" y="164" textAnchor="end" fontSize="9" fontWeight="bold" fill="#9ca3af">₹0</text>
                              </>
                            );
                          })()}

                          {/* Bars */}
                          {stats.courseStats.map((c, i) => {
                            const maxRevenue = Math.max(...stats.courseStats.map(x => x.revenue || 0), 1000);
                            const barHeight = maxRevenue > 0 ? (c.revenue / maxRevenue) * 120 : 0;
                            const barWidth = 32;
                            const spacing = 18;
                            const x = 70 + i * (barWidth + spacing);
                            const y = 160 - barHeight;
                            if (x + barWidth > 470) return null;
                            
                            return (
                              <g key={i} className="group">
                                <rect 
                                  x={x - 8} 
                                  y={y - 25} 
                                  width={barWidth + 16} 
                                  height={20} 
                                  rx="4" 
                                  fill="#1e293b" 
                                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
                                />
                                <text 
                                  x={x + barWidth / 2} 
                                  y={y - 12} 
                                  textAnchor="middle" 
                                  fontSize="9" 
                                  fontWeight="black" 
                                  fill="#ffffff" 
                                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                >
                                  ₹{Math.round(c.revenue)}
                                </text>
                                <rect 
                                  x={x} 
                                  y={y} 
                                  width={barWidth} 
                                  height={barHeight} 
                                  fill="url(#cyanGradient)" 
                                  rx="4" 
                                  className="transition-all duration-300 hover:opacity-90 cursor-pointer" 
                                />
                                <text 
                                  x={x + barWidth / 2} 
                                  y="180" 
                                  textAnchor="middle" 
                                  fontSize="9" 
                                  fontWeight="bold" 
                                  fill="#6b7280"
                                >
                                  {c.title.length > 7 ? c.title.substring(0, 6) + '..' : c.title}
                                </text>
                              </g>
                            );
                          })}
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Enrollments Plot */}
                  <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100">
                    <h3 className="text-md font-black uppercase text-ink-dark mb-4 flex items-center gap-2">
                      <Users size={18} className="text-accent-coral" /> Enrollments by Course
                    </h3>
                    {stats.courseStats?.length === 0 ? (
                      <div className="h-40 flex items-center justify-center text-sm font-bold text-gray-300">No enrollment data available.</div>
                    ) : (
                      <div className="w-full">
                        {/* Course Enrollments SVG Chart */}
                        <svg viewBox="0 0 500 220" className="w-full h-auto">
                          <defs>
                            <linearGradient id="coralGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#fb7185" />
                              <stop offset="100%" stopColor="#f43f5e" />
                            </linearGradient>
                          </defs>
                          
                          {/* Grid lines */}
                          <line x1="50" y1="30" x2="470" y2="30" stroke="#f9fafb" strokeWidth="1" />
                          <line x1="50" y1="95" x2="470" y2="95" stroke="#f3f4f6" strokeWidth="1" />
                          <line x1="50" y1="160" x2="470" y2="160" stroke="#e5e7eb" strokeWidth="1" />
                          
                          {/* Axis lines */}
                          <line x1="50" y1="30" x2="50" y2="160" stroke="#d1d5db" strokeWidth="1.5" />
                          <line x1="50" y1="160" x2="470" y2="160" stroke="#d1d5db" strokeWidth="1.5" />

                          {/* Y Axis Labels */}
                          {(() => {
                            const maxEnrollments = Math.max(...stats.courseStats.map(c => c.enrollments || 0), 5);
                            return (
                              <>
                                <text x="42" y="34" textAnchor="end" fontSize="9" fontWeight="bold" fill="#9ca3af">{Math.round(maxEnrollments)}</text>
                                <text x="42" y="99" textAnchor="end" fontSize="9" fontWeight="bold" fill="#9ca3af">{Math.round(maxEnrollments / 2)}</text>
                                <text x="42" y="164" textAnchor="end" fontSize="9" fontWeight="bold" fill="#9ca3af">0</text>
                              </>
                            );
                          })()}

                          {/* Bars */}
                          {stats.courseStats.map((c, i) => {
                            const maxEnrollments = Math.max(...stats.courseStats.map(x => x.enrollments || 0), 5);
                            const barHeight = maxEnrollments > 0 ? (c.enrollments / maxEnrollments) * 120 : 0;
                            const barWidth = 32;
                            const spacing = 18;
                            const x = 70 + i * (barWidth + spacing);
                            const y = 160 - barHeight;
                            if (x + barWidth > 470) return null;
                            
                            return (
                              <g key={i} className="group">
                                <rect 
                                  x={x - 8} 
                                  y={y - 25} 
                                  width={barWidth + 16} 
                                  height={20} 
                                  rx="4" 
                                  fill="#1e293b" 
                                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
                                />
                                <text 
                                  x={x + barWidth / 2} 
                                  y={y - 12} 
                                  textAnchor="middle" 
                                  fontSize="9" 
                                  fontWeight="black" 
                                  fill="#ffffff" 
                                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                >
                                  {c.enrollments} Students
                                </text>
                                <rect 
                                  x={x} 
                                  y={y} 
                                  width={barWidth} 
                                  height={barHeight} 
                                  fill="url(#coralGradient)" 
                                  rx="4" 
                                  className="transition-all duration-300 hover:opacity-90 cursor-pointer" 
                                />
                                <text 
                                  x={x + barWidth / 2} 
                                  y="180" 
                                  textAnchor="middle" 
                                  fontSize="9" 
                                  fontWeight="bold" 
                                  fill="#6b7280"
                                >
                                  {c.title.length > 7 ? c.title.substring(0, 6) + '..' : c.title}
                                </text>
                              </g>
                            );
                          })}
                        </svg>
                      </div>
                    )}
                  </div>

                </div>

                {/* Manage My Courses Section */}
                <div className="bg-white p-8 rounded-2xl shadow-soft border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-black uppercase text-ink-dark flex items-center gap-2">
                      <Layers size={18} className="text-accent-cyan" /> Manage My Courses
                    </h3>
                    <button 
                      onClick={() => setShowModal(true)}
                      className="flex items-center gap-2 bg-accent-cyan text-white px-4 py-2 rounded-lg font-bold uppercase hover:bg-accent-coral transition-all text-xs"
                    >
                      <PlusCircle size={16} /> New Course
                    </button>
                  </div>

                  {stats.courseStats?.length === 0 ? (
                    <p className="text-ink-gray font-medium">You haven't created any courses yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-gray-200 text-xs font-black uppercase text-ink-gray tracking-wider">
                            <th className="py-4 px-4">Course Title</th>
                            <th className="py-4 px-4 text-right">Price</th>
                            <th className="py-4 px-4 text-center">Students</th>
                            <th className="py-4 px-4 text-right">Revenue</th>
                            <th className="py-4 px-4 text-center">Avg Rating</th>
                            <th className="py-4 px-4 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.courseStats.map((cStat, index) => {
                            const matchingCourse = courses.find(course => course.title === cStat.title) || {};
                            return (
                              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                <td className="py-4 px-4">
                                  <div className="font-bold text-ink-dark">{cStat.title}</div>
                                  <div className="text-xs text-ink-gray line-clamp-1 max-w-[200px] sm:max-w-sm">{matchingCourse.description || ''}</div>
                                </td>
                                <td className="py-4 px-4 text-right font-semibold">
                                  INR {matchingCourse.price || 0}
                                </td>
                                <td className="py-4 px-4 text-center font-semibold">
                                  {cStat.enrollments}
                                </td>
                                <td className="py-4 px-4 text-right font-black text-accent-cyan">
                                  INR {cStat.revenue?.toLocaleString() || 0}
                                </td>
                                <td className="py-4 px-4 text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    <Star size={14} className={cStat.averageRating > 0 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                                    <span className="font-bold text-sm">{cStat.averageRating > 0 ? cStat.averageRating.toFixed(1) : 'N/A'}</span>
                                  </div>
                                </td>
                                <td className="py-4 px-4 text-center">
                                  <Link 
                                    to={`/courses/${matchingCourse.id}`} 
                                    className="inline-block bg-accent-cyan/10 text-accent-cyan hover:bg-accent-cyan hover:text-white px-4 py-1.5 rounded-lg font-bold text-xs uppercase transition-colors"
                                  >
                                    Manage
                                  </Link>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* LEARNER VIEW */}
        {user?.role === 'ROLE_LEARNER' && (
          <div>
            <h2 className="text-2xl font-black uppercase text-ink-dark flex items-center gap-2 mb-6">
              <BookOpen className="text-accent-cyan" /> My Enrollments
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolled.length === 0 ? (
                <p className="text-ink-gray">You haven't enrolled in any courses yet.</p>
              ) : (
                enrolled.map(enroll => (
                  <Link to={`/courses/${enroll.courseId}`} key={enroll.id} className="bg-white p-6 rounded-xl shadow-soft hover:shadow-soft-hover transition duration-300 border border-gray-100 group">
                    <div className="text-xs uppercase font-bold text-gray-400 mb-2">Enrolled on: {new Date(enroll.enrolledAt).toLocaleDateString()}</div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-accent-cyan transition-colors">{enroll.courseTitle}</h3>
                    <p className="text-ink-gray text-sm">Instructor: {enroll.instructorName}</p>
                  </Link>
                ))
              )}
            </div>
          </div>
        )}

        {/* ADMIN VIEW */}
        {user?.role === 'ROLE_ADMIN' && (
          <div className="bg-white rounded-2xl shadow-soft p-8 border border-gray-100">
            <h2 className="text-2xl font-black uppercase text-ink-dark mb-2">Admin Panel</h2>
            <p className="text-ink-gray mb-6">Review instructors, learners, and enrollments.</p>
            <Link to="/admin" className="inline-flex items-center gap-2 bg-ink-dark text-paper-white px-6 py-3 rounded-lg font-bold uppercase hover:bg-accent-cyan transition-colors">
              Open Admin
            </Link>
          </div>
        )}

      </div>

      {/* CREATE COURSE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-soft-hover relative animate-fade-in">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-ink-dark"
            >
              X
            </button>
            <h2 className="text-2xl font-black uppercase mb-6 text-ink-dark">Create New Course</h2>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-sm font-bold uppercase mb-2">Title</label>
                <input required type="text" value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan focus:ring-opacity-20 transition-colors bg-paper-light" />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase mb-2">Description</label>
                <textarea required rows="4" value={newCourse.description} onChange={e => setNewCourse({...newCourse, description: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan focus:ring-opacity-20 transition-colors bg-paper-light" />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase mb-2">Price (INR)</label>
                <input required type="number" step="0.01" value={newCourse.price} onChange={e => setNewCourse({...newCourse, price: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan focus:ring-opacity-20 transition-colors bg-paper-light" />
              </div>
              <button type="submit" className="w-full bg-accent-cyan text-white py-4 rounded-lg font-bold uppercase hover:bg-accent-coral transition-colors">
                Publish Course
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;