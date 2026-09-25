import api from './api';

export const aiService = {
  // Generate structured AI itinerary
  async generateItinerary(tripParams) {
    const response = await api.post('/ai/generate-itinerary', tripParams);
    return response.data;
  },

  // Ask AI travel assistant questions with trip context
  async askTravelAssistant(message, tripContext) {
    const response = await api.post('/ai/travel-assistant', {
      message,
      tripContext,
    });
    return response.data;
  },
};

export default aiService;
