import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getCourse, enrollInCourse, getCourseMaterials, uploadCourseMaterial, deleteCourseMaterial, getMyEnrolledCourses, updateEnrollmentProgress, updateEnrollmentRating } from '../api/courses';
import { getMe } from '../api/auth';
import { API_BASE_URL } from '../api/axiosConfig';
import { FileText, Video, File, Trash2, UploadCloud, ChevronLeft, Rocket, Layers, Download, Star, CheckCircle } from 'lucide-react';

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
  const [enrollment, setEnrollment] = useState(null);

  // Material upload state
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('PDF');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [compressing, setCompressing] = useState(false);

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
        if (userRes.data.role === 'ROLE_LEARNER') {
          const enrollmentsRes = await getMyEnrolledCourses();
          const currentEnrollment = enrollmentsRes.data.find(e => e.courseId === parseInt(id));
          setEnrollment(currentEnrollment || null);
        }
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

  const handleProgressSliderChange = async (e) => {
    const val = parseInt(e.target.value);
    const completed = val === 100;
    // optimistic update
    setEnrollment(prev => ({ ...prev, progress: val, completed }));
    try {
      await updateEnrollmentProgress(enrollment.id, val, completed);
    } catch (err) {
      alert("Failed to update progress");
    }
  };

  const handleCompletedCheckboxChange = async (e) => {
    const checked = e.target.checked;
    const progressVal = checked ? 100 : enrollment.progress;
    // optimistic update
    setEnrollment(prev => ({ ...prev, completed: checked, progress: progressVal }));
    try {
      await updateEnrollmentProgress(enrollment.id, progressVal, checked);
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleRateCourse = async (rating) => {
    // optimistic update
    setEnrollment(prev => ({ ...prev, rating }));
    try {
      await updateEnrollmentRating(enrollment.id, rating);
    } catch (err) {
      alert("Failed to save rating");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Auto-detect type
    const ext = selectedFile.name.split('.').pop().toLowerCase();
    let detectedType = 'OTHER';
    if (ext === 'pdf') {
      detectedType = 'PDF';
    } else if (['mp4', 'webm', 'mkv', 'mov', 'avi'].includes(ext)) {
      detectedType = 'VIDEO';
    } else if (['doc', 'docx'].includes(ext)) {
      detectedType = 'DOC';
    }
    setType(detectedType);

    // Auto-fill title if empty
    const baseName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.'));
    setTitle(baseName);

    if (selectedFile.type.startsWith('image/')) {
      setCompressing(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          const maxDim = 1920;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            if (blob) {
              const compressedFile = new File([blob], selectedFile.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              setFile(compressedFile);
            } else {
              setFile(selectedFile);
            }
            setCompressing(false);
          }, 'image/jpeg', 0.75);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFile(selectedFile);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a file');

    setUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('type', type);
    formData.append('file', file);

    try {
      await uploadCourseMaterial(id, formData, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      });
      setTitle('');
      setFile(null);
      loadData(); // refresh materials
    } catch (error) {
      alert('Failed to upload material');
    } finally {
      setUploading(false);
      setUploadProgress(0);
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

  const buildFileHref = (mat, forceDownload = false) => {
    if (!mat || !mat.id) return '#';
    const token = localStorage.getItem('token');
    let url = `${API_BASE_URL}/courses/materials/${mat.id}/file?token=${token}`;
    if (forceDownload) {
      url += '&download=true';
    }
    return url;
  };

  const openVideo = (mat) => {
    setActiveVideo({ id: mat.id, title: mat.title, url: buildFileHref(mat) });
  };

  const closeVideo = () => {
    setActiveVideo(null);
  };

  const openDoc = (mat) => {
    window.open(buildFileHref(mat), '_blank', 'noopener,noreferrer');
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

  // Compute course storage metrics
  const totalStorageBytes = 150 * 1024 * 1024;
  const usedStorageBytes = materials.reduce((acc, mat) => acc + (mat.fileSize || 0), 0);
  const remainingStorageBytes = Math.max(0, totalStorageBytes - usedStorageBytes);
  const usedMB = (usedStorageBytes / (1024 * 1024)).toFixed(1);
  const remainingMB = (remainingStorageBytes / (1024 * 1024)).toFixed(1);
  const usagePercent = Math.min(100, (usedStorageBytes / totalStorageBytes) * 100).toFixed(1);

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
          
          {((user?.role === 'ROLE_LEARNER' && !enrollment) || !user) && (
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

        {/* Progress & Rating Card (Only for enrolled learners) */}
        {enrollment && (
          <div className="bg-white rounded-2xl shadow-soft p-8 md:p-12 mb-10 border border-gray-100">
            <h2 className="text-2xl font-black uppercase text-ink-dark mb-6 flex items-center gap-3">
              <CheckCircle className="text-accent-cyan" /> Progress & Feedback
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Progress Tracker */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold uppercase text-ink-dark text-sm tracking-wider">Your Course Progress</span>
                  <span className="font-black text-accent-cyan text-lg">{enrollment.progress || 0}%</span>
                </div>
                
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={enrollment.progress || 0} 
                  onChange={handleProgressSliderChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent-cyan"
                />

                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={enrollment.completed || false} 
                    onChange={handleCompletedCheckboxChange}
                    className="w-5 h-5 rounded border-gray-300 text-accent-cyan focus:ring-accent-cyan cursor-pointer"
                  />
                  <span className="font-bold text-sm text-ink-dark uppercase">Mark as Completed</span>
                </label>
              </div>

              {/* Rating Feedbacks */}
              <div className="space-y-4">
                <span className="block font-bold uppercase text-ink-dark text-sm tracking-wider">Rate this Course</span>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRateCourse(star)}
                      className="transition-transform duration-200 hover:scale-125 focus:outline-none"
                    >
                      <Star 
                        size={32} 
                        className={`${
                          star <= (enrollment.rating || 0) 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-gray-300 hover:text-yellow-400'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {enrollment.rating > 0 ? (
                  <p className="text-sm font-medium text-ink-gray">You rated this course {enrollment.rating} out of 5 stars.</p>
                ) : (
                  <p className="text-sm font-medium text-gray-400">Click a star to share your rating with the instructor.</p>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Materials Section */}
        <div className="bg-white rounded-2xl shadow-soft p-8 md:p-12 border border-gray-100">
          <h2 className="text-2xl font-black uppercase text-ink-dark mb-6 flex items-center gap-3">
            <Layers className="text-accent-coral" /> 
            Course Materials
          </h2>

          {isInstructor && (
            <div className="mb-8 p-6 bg-paper-light rounded-2xl border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="text-sm font-black text-ink-dark uppercase tracking-wider mb-1">Course Storage Status</div>
                <div className="text-sm text-ink-gray font-medium">
                  You have <span className="font-bold text-accent-coral">{remainingMB} MB</span> left out of <span className="font-bold text-ink-dark">150 MB</span> ({usedMB} MB used)
                </div>
              </div>
              <div className="w-full md:w-64">
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden mb-1">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 shadow-sm ${
                      parseFloat(usagePercent) > 90 ? 'bg-accent-coral' : parseFloat(usagePercent) > 70 ? 'bg-yellow-500' : 'bg-accent-cyan'
                    }`}
                    style={{ width: `${usagePercent}%` }}
                  ></div>
                </div>
                <div className="text-[10px] text-right font-bold text-ink-gray">{usagePercent}% full</div>
              </div>
            </div>
          )}

          {isInstructor && (
            <form onSubmit={handleUpload} className="bg-paper-light p-6 rounded-xl mb-8 border border-dashed border-gray-300">
               <h3 className="font-bold uppercase text-sm mb-4 text-ink-dark flex items-center gap-2">
                 <UploadCloud size={16} /> Upload New Material 
                 {file && <span className="text-xs font-bold text-accent-cyan lowercase bg-accent-cyan/10 px-2 py-0.5 rounded">({type} detected)</span>}
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                 <input required type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="px-4 py-2 rounded-lg border focus:border-accent-cyan outline-none font-medium text-sm" />
                 <input required type="file" onChange={handleFileChange} className="px-4 py-1.5 text-sm text-ink-gray bg-white rounded-lg border border-gray-200 outline-none" />
               </div>
               {uploading ? (
                 <div className="mt-4 p-5 bg-gradient-to-r from-ink-dark to-gray-900 text-white rounded-xl shadow-soft-hover flex items-center gap-5 w-full border border-gray-800 animate-pulse">
                   <div className="relative flex items-center justify-center flex-shrink-0">
                     <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent-cyan border-t-transparent"></div>
                     <div className="absolute text-[10px] font-black uppercase tracking-tighter text-accent-cyan">UP</div>
                   </div>
                   <div className="flex-1">
                     <div className="flex justify-between items-center mb-2">
                       <span className="text-sm font-black uppercase tracking-wider text-gray-200">Uploading File...</span>
                       <span className="text-sm font-black text-accent-cyan tracking-wider">{uploadProgress}%</span>
                     </div>
                     <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                       <div 
                         className="bg-accent-cyan h-full rounded-full shadow-[0_0_8px_#38bdf8] transition-all duration-300 ease-out"
                         style={{ width: `${uploadProgress}%` }}
                       ></div>
                     </div>
                   </div>
                 </div>
               ) : (
                 <button type="submit" disabled={compressing} className="bg-ink-dark text-white px-6 py-2 rounded-lg font-bold uppercase text-sm hover:bg-accent-cyan transition-colors disabled:opacity-50">
                   {compressing ? 'Compressing...' : 'Submit Material'}
                 </button>
               )}
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
                          <button onClick={() => openDoc(mat)} className="font-bold text-ink-dark hover:text-accent-cyan transition-colors text-left">
                            {mat.title}
                          </button>
                        ) : mat.type === 'VIDEO' ? (
                          <button onClick={() => openVideo(mat)} className="font-bold text-ink-dark hover:text-accent-cyan transition-colors text-left">
                            {mat.title}
                          </button>
                        ) : (
                          <a href={buildFileHref(mat)} target="_blank" rel="noreferrer" className="font-bold text-ink-dark hover:text-accent-cyan transition-colors">
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
                      <a 
                        href={buildFileHref(mat, true)} 
                        download
                        className="px-3 py-2 rounded-lg bg-white border border-gray-200 font-bold uppercase text-xs hover:bg-paper-light flex items-center gap-1 text-ink-dark"
                      >
                        <Download size={12} /> Download
                      </a>
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