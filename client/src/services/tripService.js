import api from './api';

export const tripService = {
  // Create a new trip
  async createTrip(tripData) {
    const response = await api.post('/trips', tripData);
    return response.data;
  },

  // Get all trips with dashboard summary statistics
  async getTrips() {
    const response = await api.get('/trips');
    return response.data;
  },

  // Get single trip by ID
  async getTripById(id) {
    const response = await api.get(`/trips/${id}`);
    return response.data;
  },

  // Update a trip
  async updateTrip(id, tripData) {
    const response = await api.put(`/trips/${id}`, tripData);
    return response.data;
  },

  // Delete a trip
  async deleteTrip(id) {
    const response = await api.delete(`/trips/${id}`);
    return response.data;
  },

  // Add an activity to a day
  async addActivity(tripId, dayNumber, activityData) {
    const response = await api.post(`/trips/${tripId}/days/${dayNumber}/activities`, activityData);
    return response.data;
  },

  // Update an activity
  async updateActivity(tripId, dayNumber, activityId, activityData) {
    const response = await api.put(`/trips/${tripId}/days/${dayNumber}/activities/${activityId}`, activityData);
    return response.data;
  },

  // Delete an activity
  async deleteActivity(tripId, dayNumber, activityId) {
    const response = await api.delete(`/trips/${tripId}/days/${dayNumber}/activities/${activityId}`);
    return response.data;
  },
};

export default tripService;
