import api from './axiosConfig';

export const getAllCourses = (search = '', sort = '') => {
    let url = '/courses?';
    if(search) url += `search=${search}&`;
    if(sort) url += `sort=${sort}`;
    return api.get(url);
};
export const getCourse = (id) => api.get(`/courses/${id}`);
export const createCourse = (data) => api.post('/courses', data);
export const enrollInCourse = (courseId) => api.post(`/enrollments/courses/${courseId}`);
export const getMyEnrolledCourses = () => api.get('/enrollments/my-courses');
export const getMyCreatedCourses = () => api.get('/courses/my-courses');

export const getCourseMaterials = (courseId) => api.get(`/courses/${courseId}/materials`);
export const uploadCourseMaterial = (courseId, formData, onUploadProgress) => api.post(`/courses/${courseId}/materials`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress
});
export const deleteCourseMaterial = (materialId) => api.delete(`/courses/materials/${materialId}`);

export const getInstructorDashboard = () => api.get('/courses/instructor/dashboard');
export const updateEnrollmentProgress = (id, progress, completed) => 
    api.put(`/enrollments/${id}/progress?progress=${progress}&completed=${completed}`);
export const updateEnrollmentRating = (id, rating) => 
    api.put(`/enrollments/${id}/rate?rating=${rating}`);