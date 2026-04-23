import React, { useEffect, useState } from 'react';
import { getMe } from '../api/auth';
import { getMyCreatedCourses, getMyEnrolledCourses, createCourse } from '../api/courses';
import Navbar from '../components/Navbar';
import { PlusCircle, BookOpen, Layers } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [loading, setLoading] = useState(true);
  
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
        const createdRes = await getMyCreatedCourses();
        setCourses(createdRes.data);
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
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black uppercase text-ink-dark flex items-center gap-2">
                <Layers className="text-accent-cyan" /> My Created Courses
              </h2>
              {/* Mobile button */}
              <button 
                onClick={() => setShowModal(true)}
                className="md:hidden flex items-center gap-2 bg-accent-cyan text-white px-4 py-2 rounded-lg font-bold uppercase hover:bg-black transition-all"
              >
                <PlusCircle size={18} /> New
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.length === 0 ? (
                <p className="text-ink-gray">You haven't created any courses yet.</p>
              ) : (
                courses.map(course => (
                  <Link to={`/courses/${course.id}`} key={course.id} className="bg-white p-6 rounded-xl shadow-soft hover:shadow-soft-hover transition duration-300 flex flex-col group border border-gray-100">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-accent-cyan transition-colors">{course.title}</h3>
                    <p className="text-ink-gray text-sm mb-4 line-clamp-2">{course.description}</p>
                    <div className="mt-auto font-black text-accent-cyan">INR {course.price}</div>
                  </Link>
                ))
              )}
            </div>
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