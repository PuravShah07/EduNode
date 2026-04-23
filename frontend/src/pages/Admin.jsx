import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getInstructors, getLearners, getEnrollments } from '../api/admin';
import { Users, GraduationCap, ClipboardList } from 'lucide-react';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('instructors');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ instructors: [], learners: [], enrollments: [] });
  const [pages, setPages] = useState({ instructors: 0, learners: 0, enrollments: 0 });
  const [pageInfo, setPageInfo] = useState({ instructors: { totalPages: 0 }, learners: { totalPages: 0 }, enrollments: { totalPages: 0 } });

  useEffect(() => {
    loadData(activeTab);
  }, [activeTab, pages[activeTab]]);

  const loadData = async (tab) => {
    setLoading(true);
    try {
      let response;
      if (tab === 'instructors') {
        response = await getInstructors(pages.instructors, 10);
      } else if (tab === 'learners') {
        response = await getLearners(pages.learners, 10);
      } else {
        response = await getEnrollments(pages.enrollments, 10);
      }

      setData((prev) => ({ ...prev, [tab]: response.data.content || [] }));
      setPageInfo((prev) => ({ ...prev, [tab]: { totalPages: response.data.totalPages || 0 } }));
    } catch (error) {
      console.error('Failed to load admin data', error);
      setData((prev) => ({ ...prev, [tab]: [] }));
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => {
    const total = pageInfo[activeTab].totalPages || 0;
    const current = pages[activeTab];
    if (current + 1 < total) {
      setPages((prev) => ({ ...prev, [activeTab]: current + 1 }));
    }
  };

  const prevPage = () => {
    const current = pages[activeTab];
    if (current > 0) {
      setPages((prev) => ({ ...prev, [activeTab]: current - 1 }));
    }
  };

  return (
    <div className="min-h-screen bg-paper-offwhite">
      <Navbar />
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-soft p-8 mb-8 border border-gray-100">
          <h1 className="text-3xl md:text-4xl font-black uppercase text-ink-dark mb-2">Admin Console</h1>
          <p className="text-ink-gray">Manage instructors, learners, and enrollments.</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <button onClick={() => setActiveTab('instructors')} className={`px-6 py-3 rounded-lg font-bold uppercase text-sm ${activeTab === 'instructors' ? 'bg-ink-dark text-paper-white' : 'bg-white text-ink-dark border border-gray-200'}`}>
            <span className="inline-flex items-center gap-2"><Users size={16} /> Instructors</span>
          </button>
          <button onClick={() => setActiveTab('learners')} className={`px-6 py-3 rounded-lg font-bold uppercase text-sm ${activeTab === 'learners' ? 'bg-ink-dark text-paper-white' : 'bg-white text-ink-dark border border-gray-200'}`}>
            <span className="inline-flex items-center gap-2"><GraduationCap size={16} /> Learners</span>
          </button>
          <button onClick={() => setActiveTab('enrollments')} className={`px-6 py-3 rounded-lg font-bold uppercase text-sm ${activeTab === 'enrollments' ? 'bg-ink-dark text-paper-white' : 'bg-white text-ink-dark border border-gray-200'}`}>
            <span className="inline-flex items-center gap-2"><ClipboardList size={16} /> Enrollments</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
          {loading ? (
            <div className="text-center py-10 text-ink-gray font-medium">Loading data...</div>
          ) : (
            <>
              {activeTab !== 'enrollments' ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 font-bold uppercase text-sm text-ink-dark">Name</th>
                        <th className="py-3 font-bold uppercase text-sm text-ink-dark">Email</th>
                        <th className="py-3 font-bold uppercase text-sm text-ink-dark">Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data[activeTab].map((user) => (
                        <tr key={user.id} className="border-b last:border-b-0">
                          <td className="py-3 font-medium text-ink-dark">{user.name}</td>
                          <td className="py-3 text-ink-gray">{user.email}</td>
                          <td className="py-3 text-ink-gray">{user.role?.replace('ROLE_', '')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {data[activeTab].length === 0 && (
                    <div className="text-center py-6 text-ink-gray">No records found.</div>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 font-bold uppercase text-sm text-ink-dark">Learner</th>
                        <th className="py-3 font-bold uppercase text-sm text-ink-dark">Course</th>
                        <th className="py-3 font-bold uppercase text-sm text-ink-dark">Instructor</th>
                        <th className="py-3 font-bold uppercase text-sm text-ink-dark">Price</th>
                        <th className="py-3 font-bold uppercase text-sm text-ink-dark">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.enrollments.map((enroll) => (
                        <tr key={enroll.enrollmentId} className="border-b last:border-b-0">
                          <td className="py-3 font-medium text-ink-dark">{enroll.learnerName}</td>
                          <td className="py-3 text-ink-gray">{enroll.courseTitle}</td>
                          <td className="py-3 text-ink-gray">{enroll.instructorName}</td>
                          <td className="py-3 text-ink-gray">INR {enroll.coursePrice}</td>
                          <td className="py-3 text-ink-gray">{new Date(enroll.enrolledAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {data.enrollments.length === 0 && (
                    <div className="text-center py-6 text-ink-gray">No enrollments found.</div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between mt-6">
                <button onClick={prevPage} className="px-4 py-2 rounded-lg border border-gray-200 font-bold uppercase text-sm hover:bg-paper-light">
                  Prev
                </button>
                <span className="text-ink-gray font-medium text-sm">
                  Page {pages[activeTab] + 1} of {pageInfo[activeTab].totalPages || 1}
                </span>
                <button onClick={nextPage} className="px-4 py-2 rounded-lg border border-gray-200 font-bold uppercase text-sm hover:bg-paper-light">
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;