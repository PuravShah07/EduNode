import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getCourse, enrollInCourse, getCourseMaterials, uploadCourseMaterial, deleteCourseMaterial } from '../api/courses';
import { getMe } from '../api/auth';
import { API_BASE_URL } from '../api/axiosConfig';
import { FileText, Video, File, Trash2, UploadCloud, ChevronLeft, Rocket, Layers } from 'lucide-react';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState('');
  const [materials, setMaterials] = useState([]);
  const [materialsError, setMaterialsError] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);
  const [activeDoc, setActiveDoc] = useState(null);

  // Material upload state
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('PDF');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const courseRes = await getCourse(id);
      setCourse(courseRes.data);
      setError('');

      try {
        const userRes = await getMe();
        setUser(userRes.data);
      } catch (e) {
        // Not logged in
      }

      try {
        const materialRes = await getCourseMaterials(id);
        setMaterials(materialRes.data);
        setMaterialsError('');
      } catch (e) {
        const message = e?.response?.data?.message || 'Enroll to access course materials.';
        setMaterialsError(message);
      }
      
    } catch (err) {
      console.error(err);
      const message = err?.response?.status === 401
        ? 'Please log in to view course details.'
        : (err?.response?.data?.message || 'Unable to load this course.');
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await enrollInCourse(id);
      alert('Successfully enrolled!');
      loadData(); // reload to fetch materials
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to enroll');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a file');

    setUploading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('type', type);
    formData.append('file', file);

    try {
      await uploadCourseMaterial(id, formData);
      setTitle('');
      setFile(null);
      loadData(); // refresh materials
    } catch (error) {
      alert('Failed to upload material');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    if(!window.confirm("Are you sure?")) return;
    try {
      await deleteCourseMaterial(materialId);
      loadData();
    } catch(err) {
      alert('Failed to delete material');
    }
  };

  const getIcon = (matType) => {
    if (matType === 'VIDEO') return <Video className="text-accent-coral" />;
    if (matType === 'PDF') return <FileText className="text-accent-cyan" />;
    return <File className="text-ink-gray" />;
  };

  const buildFileHref = (fileUrl) => {
    if (!fileUrl) return '#';
    if (fileUrl.startsWith('http')) {
      if (API_BASE_URL.startsWith('/api_proxy')) {
        try {
          const urlObj = new URL(fileUrl);
          return `${API_BASE_URL}${urlObj.pathname}`;
        } catch (e) {
          return fileUrl;
        }
      }
      return fileUrl;
    }
    return `${API_BASE_URL}${fileUrl}`;
  };

  const openVideo = (mat) => {
    setActiveVideo({ id: mat.id, title: mat.title, url: buildFileHref(mat.fileUrl) });
  };

  const closeVideo = () => {
    setActiveVideo(null);
  };

  const openDoc = (mat) => {
    setActiveDoc({ id: mat.id, title: mat.title, url: buildFileHref(mat.fileUrl), type: mat.type });
  };

  const closeDoc = () => {
    setActiveDoc(null);
  };

  if (loading) return <div className="min-h-screen pt-20 text-center text-xl font-bold">Loading...</div>;
  if (error) return (
    <div className="min-h-screen pt-20 text-center text-xl text-ink-dark font-bold">
      <p className="mb-4">{error}</p>
      <button onClick={() => navigate('/login')} className="text-accent-cyan font-bold hover:underline">Go to Login</button>
    </div>
  );
  if (!course) return <div className="min-h-screen pt-20 text-center text-xl text-accent-coral font-bold">Course not found.</div>;

  const isInstructor = user?.role === 'ROLE_INSTRUCTOR' && user?.id === course.instructorId;

  return (
    <div className="min-h-screen bg-paper-offwhite pb-20">
      <Navbar />
      
      {/* Header Banner */}
      <div className="bg-ink-dark text-white pt-12 pb-24 px-6 torn-paper-edge relative max-w-[1400px] mx-auto xl:rounded-3xl mt-6 lg:mt-10 overflow-hidden">
         <div className="max-w-[1000px] mx-auto relative z-10">
           <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-6 hover:text-accent-cyan transition-colors text-gray-300 font-bold uppercase text-sm">
             <ChevronLeft size={16} /> Back
           </button>
           <h1 className="text-4xl md:text-6xl font-black uppercase mb-4 tracking-tight leading-tight">{course.title}</h1>
           <div className="flex items-center gap-4 text-gray-300 font-medium text-lg">
            <span className="bg-white/10 px-4 py-1 rounded-full text-accent-cyan font-bold">INR {course.price}</span>
             <span>Instructor: {course.instructorName || 'Unknown'}</span>
           </div>
         </div>
         {/* Subtle pattern */}
         <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-10 pointer-events-none">
            <Rocket size={400} />
         </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-6 -mt-10 relative z-10 z-[2]">
        <div className="bg-white rounded-2xl shadow-soft p-8 md:p-12 mb-10 border border-gray-100">
          <h2 className="text-2xl font-black uppercase text-ink-dark mb-4">About this course</h2>
          <p className="text-ink-gray text-lg leading-relaxed whitespace-pre-wrap">{course.description}</p>
          
          {(user?.role === 'ROLE_LEARNER' || !user) && (
            <div className="mt-8 pt-8 border-t border-gray-100">
              <button 
                onClick={handleEnroll}
                className="w-full md:w-auto px-10 py-4 bg-accent-cyan text-white rounded-lg font-black uppercase tracking-wide hover:bg-ink-dark hover:shadow-soft-hover transition-all duration-300"
              >
                Enroll / Book Now
              </button>
            </div>
          )}
        </div>

        {/* Materials Section */}
        <div className="bg-white rounded-2xl shadow-soft p-8 md:p-12 border border-gray-100">
          <h2 className="text-2xl font-black uppercase text-ink-dark mb-6 flex items-center gap-3">
            <Layers className="text-accent-coral" /> 
            Course Materials
          </h2>

          {isInstructor && (
            <form onSubmit={handleUpload} className="bg-paper-light p-6 rounded-xl mb-8 border border-dashed border-gray-300">
               <h3 className="font-bold uppercase text-sm mb-4 text-ink-dark flex items-center gap-2">
                 <UploadCloud size={16} /> Upload New Material
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                 <input required type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="px-4 py-2 rounded-lg border focus:border-accent-cyan outline-none" />
                 <select value={type} onChange={(e) => setType(e.target.value)} className="px-4 py-2 rounded-lg border focus:border-accent-cyan outline-none bg-white">
                   <option value="PDF">PDF Document</option>
                   <option value="VIDEO">Video</option>
                   <option value="DOC">Word Doc</option>
                   <option value="OTHER">Other</option>
                 </select>
                 <input required type="file" onChange={(e) => setFile(e.target.files[0])} className="px-4 py-2 text-sm text-ink-gray" />
               </div>
               <button disabled={uploading} type="submit" className="bg-ink-dark text-white px-6 py-2 rounded-lg font-bold uppercase text-sm hover:bg-accent-cyan transition-colors disabled:opacity-50">
                 {uploading ? 'Uploading...' : 'Submit Material'}
               </button>
            </form>
          )}

          {materialsError ? (
            <div className="text-center py-10 bg-gray-50 rounded-xl text-ink-gray font-medium">
              {materialsError}
              {!user && (
                <div className="mt-4">
                  <button onClick={() => navigate('/login')} className="text-accent-cyan font-bold hover:underline">Go to Login</button>
                </div>
              )}
            </div>
          ) : materials.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-xl text-ink-gray font-medium">
              No materials available yet. (Enroll to view if locked)
            </div>
          ) : (
            <ul className="space-y-4">
              {materials.map(mat => (
                <li key={mat.id} className="p-4 bg-paper-offwhite rounded-xl hover:bg-gray-100 transition-colors border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                    {getIcon(mat.type)}
                    <div>
                      {mat.type === 'PDF' ? (
                        <button onClick={() => openDoc(mat)} className="font-bold text-ink-dark hover:text-accent-cyan transition-colors">
                          {mat.title}
                        </button>
                      ) : (
                        <a href={buildFileHref(mat.fileUrl)} target="_blank" rel="noreferrer" className="font-bold text-ink-dark hover:text-accent-cyan transition-colors">
                          {mat.title}
                        </a>
                      )}
                      <span className="text-xs font-bold text-gray-400 bg-white px-2 py-0.5 rounded ml-3">
                        {mat.type}
                      </span>
                    </div>
                  </div>
                    <div className="flex items-center gap-2">
                      {mat.type === 'VIDEO' && (
                        <button onClick={() => openVideo(mat)} className="px-3 py-2 rounded-lg bg-white border border-gray-200 font-bold uppercase text-xs hover:bg-paper-light">
                          Play
                        </button>
                      )}
                      {isInstructor && (
                        <button onClick={() => handleDeleteMaterial(mat.id)} className="text-accent-coral hover:bg-red-50 p-2 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-ink-dark w-full max-w-4xl rounded-2xl overflow-hidden shadow-soft-hover">
            <div className="flex items-center justify-between px-4 py-3 bg-black/40">
              <div className="text-white font-bold truncate">{activeVideo.title}</div>
              <button onClick={closeVideo} className="text-white/70 hover:text-white font-bold">X</button>
            </div>
            <div className="bg-black">
              <div className="aspect-video w-full">
                <video controls autoPlay className="w-full h-full" preload="metadata">
                  <source src={activeVideo.url} />
                </video>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white w-full max-w-5xl rounded-2xl overflow-hidden shadow-soft-hover">
            <div className="flex items-center justify-between px-4 py-3 bg-paper-light border-b">
              <div className="text-ink-dark font-bold truncate">{activeDoc.title}</div>
              <button onClick={closeDoc} className="text-ink-dark/70 hover:text-ink-dark font-bold">X</button>
            </div>
            <div className="bg-white">
              <div className="w-full h-[70vh]">
                <iframe title={activeDoc.title} src={activeDoc.url} className="w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;