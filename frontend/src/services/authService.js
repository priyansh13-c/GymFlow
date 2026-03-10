import api from './api';

export const authService = {
  register: (name, username, email, password, role) =>
    api.post('/auth/register', { name, username, email, password, role }),

  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  refreshToken: (refreshToken) =>
    api.post('/auth/refresh-token', { refreshToken }),

  logout: (refreshToken) =>
    api.post('/auth/logout', { refreshToken }),

  getCurrentUser: () =>
    api.get('/auth/me'),
  updateProfile: (updates) =>
    api.patch('/auth/me', updates),
};

export const gymService = {
  createGym: (gymData) =>
    api.post('/gym', gymData),

  getOwnerGyms: () =>
    api.get('/gym/owner/my-gym'),

  getGym: (gymId) =>
    api.get(`/gym/${gymId}`),

  getGymMembers: (gymId) =>
    api.get(`/gym/${gymId}/members`),

  getGymStats: (gymId) =>
    api.get(`/gym/${gymId}/stats`),

  updateGym: (gymId, updates) =>
    api.patch(`/gym/${gymId}`, updates),
};

export const memberService = {
  joinGym: (joinData) =>
    api.post('/members/join-gym', joinData),

  getMembership: () =>
    api.get('/members/membership'),

  getAllMembers: (gymId) =>
    api.get(`/members/${gymId}/all`),

  removeMember: (memberId) =>
    api.delete(`/members/${memberId}`),
  updateMembership: (memberId, updates) =>
    api.patch(`/members/${memberId}`, updates),
};

export const workoutService = {
  addWorkout: (workoutData) =>
    api.post('/workouts', workoutData),

  getUserWorkouts: (filters) =>
    api.get('/workouts', { params: filters }),

  getGymWorkouts: (gymId) =>
    api.get(`/workouts/${gymId}/all`),

  updateWorkout: (workoutId, updates) =>
    api.patch(`/workouts/${workoutId}`, updates),

  deleteWorkout: (workoutId) =>
    api.delete(`/workouts/${workoutId}`),
};

export const noticeService = {
  postNotice: (noticeData) =>
    api.post('/notices', noticeData),

  getNotices: (gymId, filters) =>
    api.get('/notices', { params: { gymId, ...filters } }),

  markNoticeRead: (noticeId) =>
    api.patch(`/notices/${noticeId}/read`),

  updateNotice: (noticeId, updates) =>
    api.patch(`/notices/${noticeId}`, updates),

  deleteNotice: (noticeId) =>
    api.delete(`/notices/${noticeId}`),
};

export const paymentService = {
  processPayment: (gymId, paymentData) =>
    api.post(`/payments/${gymId}/process`, paymentData),

  getPaymentHistory: (gymId) =>
    api.get(`/payments/${gymId}/history`),

  getGymPayments: (gymId, filters) =>
    api.get(`/payments/${gymId}/all`, { params: filters }),

  refundPayment: (paymentId, reason) =>
    api.post(`/payments/${paymentId}/refund`, { reason }),
};

export const calorieService = {
  uploadFoodImage: (gymId, formData) =>
    api.post(`/calories/${gymId}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  getCalorieLogs: (gymId, filters) =>
    api.get(`/calories/${gymId}`, { params: filters }),

  deleteCalorieLog: (calorieLogId) =>
    api.delete(`/calories/${calorieLogId}`),
};

export const trainerService = {
  getTrainers: (gymId, filters) =>
    api.get(`/trainers/${gymId}`, { params: filters }),

  // owner management
  createTrainer: (gymId, data) =>
    api.post(`/trainers/${gymId}`, data),
  updateTrainer: (trainerId, updates) =>
    api.patch(`/trainers/update/${trainerId}`, updates),
  deleteTrainer: (trainerId) =>
    api.delete(`/trainers/delete/${trainerId}`),

  // bookings
  bookTrainer: (trainerId, bookingData) =>
    api.post(`/trainers/${trainerId}/book`, bookingData),

  getUserBookings: (gymId) =>
    api.get(`/trainers/${gymId}/bookings`),

  getTrainerBookings: (trainerId) =>
    api.get(`/trainers/${trainerId}/my-bookings`),

  confirmBooking: (bookingId) =>
    api.patch(`/trainers/${bookingId}/confirm`),

  cancelBooking: (bookingId) =>
    api.patch(`/trainers/${bookingId}/cancel`),
};

export default {
  authService,
  gymService,
  memberService,
  workoutService,
  noticeService,
  paymentService,
  calorieService,
  trainerService,
};
