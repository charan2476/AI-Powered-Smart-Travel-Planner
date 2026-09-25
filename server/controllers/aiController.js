import { generateItinerary, askTravelAssistant, testGeminiAPI } from '../services/geminiService.js';

/**
 * @desc    Generate a structured AI itinerary
 * @route   POST /api/ai/generate-itinerary
 * @access  Private
 */
export const generateAIItinerary = async (req, res, next) => {
  try {
    const {
      destination,
      startDate,
      endDate,
      duration,
      travelers,
      budget,
      currency,
      travelStyle,
      interests,
    } = req.body;

    if (!destination || !startDate || !endDate || !budget) {
      return res.status(400).json({
        success: false,
        message: 'Destination, start date, end date, and budget are required',
      });
    }

    const itineraryData = await generateItinerary({
      destination,
      startDate,
      endDate,
      duration,
      travelers,
      budget: Number(budget),
      currency: currency || 'USD',
      travelStyle: travelStyle || 'Relaxed',
      interests: interests || [],
    });

    res.json({
      success: true,
      data: itineraryData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Chat with AI Travel Assistant with trip context
 * @route   POST /api/ai/travel-assistant
 * @access  Private
 */
export const chatTravelAssistant = async (req, res, next) => {
  try {
    const { message, tripContext } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'A message query is required',
      });
    }

    const response = await askTravelAssistant({
      message,
      tripContext,
    });

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Test Gemini API connectivity and current model
 * @route   GET /api/ai/test
 * @access  Private
 */
export const testGeminiStatus = async (req, res, next) => {
  try {
    const result = await testGeminiAPI();
    res.json(result);
  } catch (error) {
    next(error);
  }
};
