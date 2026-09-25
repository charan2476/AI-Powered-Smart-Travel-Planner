import api from './api';

export const destinationService = {
  // Get all destinations with search and category filters
  async getDestinations(params = {}) {
    const response = await api.get('/destinations', { params });
    return response.data;
  },

  // Get destination by ID
  async getDestinationById(id) {
    const response = await api.get(`/destinations/${id}`);
    return response.data;
  },
};

export default destinationService;
