import api from './axiosConfig';

const buildPageParams = (page = 0, size = 10) => ({
	params: { page, size }
});

export const getInstructors = (page = 0, size = 10) => api.get('/admin/instructors', buildPageParams(page, size));
export const getLearners = (page = 0, size = 10) => api.get('/admin/learners', buildPageParams(page, size));
export const getEnrollments = (page = 0, size = 10) => api.get('/admin/enrollments', buildPageParams(page, size));

