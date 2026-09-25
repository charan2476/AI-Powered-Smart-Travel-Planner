import { GoogleGenerativeAI } from '@google/generative-ai';

// Primary model configurable via GEMINI_MODEL env, with an ordered fallback chain of verified models
const CONFIGURED_PRIMARY = process.env.GEMINI_MODEL ? process.env.GEMINI_MODEL.trim() : 'gemini-3.8-flash';
const FALLBACK_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3.6-flash',
  'gemini-3.7-flash',
  'gemini-3.5-flash',
  'gemini-flash-lite-latest',
  'gemini-flash-latest',
];

// Deduplicated list of models to attempt in order
const getCandidateModels = () => {
  const list = [CONFIGURED_PRIMARY, ...FALLBACK_MODELS];
  return Array.from(new Set(list.filter(Boolean)));
};

const MAX_RETRIES = 3;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Classify Gemini error status and type
 */
const classifyError = (error) => {
  if (!error) return { status: 500, type: 'UNKNOWN', message: 'Unknown error' };

  const msg = (error.message || '').toLowerCase();
  const status = Number(error.status || error.statusCode || error.code) || 0;

  if (
    status === 401 ||
    status === 403 ||
    msg.includes('api_key_invalid') ||
    msg.includes('api key not valid') ||
    msg.includes('permission denied') ||
    msg.includes('unregistered project')
  ) {
    return { status: 401, type: 'AUTH_ERROR', message: 'Authentication/API Key problem' };
  }

  if (status === 404 || msg.includes('not found') || msg.includes('is not supported')) {
    return { status: 404, type: 'MODEL_NOT_FOUND', message: 'Model or API endpoint not found' };
  }

  if (
    status === 429 ||
    msg.includes('resource exhausted') ||
    msg.includes('rate limit') ||
    msg.includes('quota')
  ) {
    return { status: 429, type: 'RATE_LIMIT', message: 'Rate limit / quota exceeded' };
  }

  if (
    status === 503 ||
    status === 500 ||
    msg.includes('503') ||
    msg.includes('service unavailable') ||
    msg.includes('high demand') ||
    msg.includes('overloaded') ||
    msg.includes('spikes in demand') ||
    msg.includes('econnreset') ||
    msg.includes('etimedout')
  ) {
    return { status: 503, type: 'TEMPORARY_SERVICE_ERROR', message: 'Temporary service high demand / 503' };
  }

  return { status: status || 500, type: 'GENERAL_ERROR', message: error.message || 'General AI error' };
};

/**
 * Execute Gemini request across candidate models with retry, exponential backoff, and model fallback
 */
const executeWithRetryAndFallback = async (genAI, promptGenerator) => {
  const modelsToTry = getCandidateModels();
  let lastError = null;

  for (let modelIdx = 0; modelIdx < modelsToTry.length; modelIdx++) {
    const modelName = modelsToTry[modelIdx];

    if (modelIdx > 0) {
      console.log(`[Gemini API] 🔄 Trying fallback model (${modelIdx + 1}/${modelsToTry.length}): ${modelName}`);
    }

    let model;
    try {
      model = genAI.getGenerativeModel({ model: modelName });
    } catch (initErr) {
      console.warn(`[Gemini API] ⚠️ Failed initializing model ${modelName}:`, initErr.message);
      continue;
    }

    const prompt = typeof promptGenerator === 'function' ? promptGenerator(modelName) : promptGenerator;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`[Gemini API] 📡 Request started | Model: ${modelName} | Attempt: ${attempt}/${MAX_RETRIES}`);
        const result = await model.generateContent(prompt);
        console.log(`[Gemini API] ✅ Success with model ${modelName} on attempt ${attempt}`);
        return { result, modelName };
      } catch (error) {
        lastError = error;
        const errorInfo = classifyError(error);

        // Safe error logging without exposing sensitive keys
        console.warn(
          `[Gemini API] ⚠️ Error on model: ${modelName} | Attempt: ${attempt} | HTTP Status: ${errorInfo.status} | Type: ${errorInfo.type} | Safe Message: ${errorInfo.message}`
        );

        // 401 / 403: Authentication/API key problem - abort immediately
        if (errorInfo.type === 'AUTH_ERROR') {
          console.error('[Gemini API] ❌ Authentication failed. Please check GEMINI_API_KEY environment variable.');
          throw new Error('Gemini API authentication failed (401/403). Please verify GEMINI_API_KEY.');
        }

        // 404: Model not found or 429: Rate limit - switch to next model immediately without wasting retry delay
        if (errorInfo.type === 'MODEL_NOT_FOUND' || errorInfo.type === 'RATE_LIMIT') {
          console.warn(`[Gemini API] ⚠️ ${errorInfo.type} for ${modelName}. Switching immediately to next fallback model...`);
          break; // Break inner retry loop to move to next model
        }

        // 503 / Temporary service errors: exponential backoff retry (1s, 2s, 4s)
        if (errorInfo.type === 'TEMPORARY_SERVICE_ERROR') {
          if (attempt < MAX_RETRIES) {
            const delayMs = Math.pow(2, attempt - 1) * 1000;
            console.log(`[Gemini API] ⏳ Backoff: retrying in ${delayMs / 1000}s (attempt ${attempt}/${MAX_RETRIES})...`);
            await sleep(delayMs);
          } else {
            console.warn(`[Gemini API] ⚠️ Max retries (${MAX_RETRIES}) reached for ${modelName}. Moving to next fallback model...`);
            break;
          }
        } else {
          // Other unexpected error: switch model
          break;
        }
      }
    }
  }

  const finalError = classifyError(lastError);
  console.error('[Gemini API] ❌ All Gemini candidate models exhausted. Final error:', finalError.message);
  throw new Error(`All Gemini models failed. Last error: [${finalError.status}] ${finalError.message}`);
};

/**
 * Helper to generate structured fallback itinerary data when AI API is unavailable
 */
const generateFallbackItinerary = (params) => {
  const {
    destination = 'Goa',
    startDate,
    endDate,
    travelers = 1,
    budget = 1000,
    currency = 'USD',
    travelStyle = 'Relaxed',
    interests = ['Beaches', 'Food', 'Culture'],
  } = params;

  const start = new Date(startDate || Date.now());
  const end = new Date(endDate || Date.now() + 3 * 86400000);
  const diffDays = Math.max(
    1,
    Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1
  );

  const numDays = Math.min(diffDays, 14);

  const accommodationBudget = Math.round(budget * 0.35);
  const foodBudget = Math.round(budget * 0.25);
  const transportBudget = Math.round(budget * 0.15);
  const activitiesBudget = Math.round(budget * 0.15);
  const miscBudget = Math.round(budget * 0.1);

  const days = [];
  for (let i = 1; i <= numDays; i++) {
    const dayDate = new Date(start);
    dayDate.setDate(dayDate.getDate() + (i - 1));
    const dateStr = dayDate.toISOString().split('T')[0];

    days.push({
      day: i,
      date: dateStr,
      theme:
        i === 1
          ? `Arrival & Settling into ${destination}`
          : i === numDays
          ? `Farewell & Memorable Souvenirs`
          : `Exploring ${interests[(i - 2) % (interests.length || 1)] || 'Highlights'} of ${destination}`,
      activities: [
        {
          time: '09:00 AM',
          title: `Day ${i} Morning: ${destination} Highlights`,
          description: `Kick off day ${i} with an inspiring morning excursion tailored for ${travelers} traveler(s).`,
          estimatedCost: Math.round((budget * 0.03) / numDays),
          category: 'Sightseeing',
        },
        {
          time: '01:30 PM',
          title: `Midday Flavor Journey in ${destination}`,
          description: `Indulge in authentic regional lunch spots reflecting ${interests.join(', ') || 'local culture'}.`,
          estimatedCost: Math.round((budget * 0.035) / numDays),
          category: 'Food',
        },
        {
          time: '05:00 PM',
          title: `${travelStyle} Evening Experience`,
          description: `Enjoy a curated ${travelStyle.toLowerCase()} atmosphere as the city lights up.`,
          estimatedCost: Math.round((budget * 0.035) / numDays),
          category: 'Leisure',
        },
      ],
    });
  }

  return {
    tripTitle: `${travelStyle} Escape to ${destination}`,
    destinationSummary: `${destination} is a captivating destination offering wonderful experiences for ${travelers} traveler(s) interested in ${interests.join(
      ', '
    )}. This custom itinerary blends your ${travelStyle.toLowerCase()} style with smart budget allocation.`,
    estimatedTotalCost: budget,
    budgetBreakdown: {
      accommodation: accommodationBudget,
      food: foodBudget,
      transportation: transportBudget,
      activities: activitiesBudget,
      miscellaneous: miscBudget,
    },
    days,
    travelTips: [
      `Carry local currency cash for small vendors in ${destination}.`,
      `Stay hydrated and book major attraction entry passes online where possible.`,
      `Comfortable walking shoes are highly recommended for daily exploration.`,
    ],
    packingSuggestions: [
      'Light breathable cotton clothes and walking sneakers.',
      'Sun protection: sunscreen, sunglasses, and travel hat.',
      'Universal travel adapter, power bank, and essential toiletries.',
    ],
    importantNotes: [
      'Check opening hours for local museums and heritage monuments prior to visiting.',
      'Keep digital copies of IDs, emergency contacts, and travel insurance.',
    ],
    isFallback: true,
  };
};

/**
 * Generate Itinerary with Gemini API (with robust retry & model fallback chain)
 */
export const generateItinerary = async (params) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key' || apiKey.trim() === '') {
    console.warn('[Gemini API] ⚠️ GEMINI_API_KEY is not configured in server environment. Using structured fallback.');
    return generateFallbackItinerary(params);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    const prompt = `
You are an expert, world-class travel planner for the application TripGenie.
Generate a comprehensive, realistic, and personalized day-by-day travel itinerary in pure JSON.

Trip Parameters:
- Destination: ${params.destination}
- Start Date: ${params.startDate}
- End Date: ${params.endDate}
- Duration: ${params.duration || 'Calculated between dates'} days
- Number of Travelers: ${params.travelers || 1}
- Total Budget: ${params.budget} ${params.currency || 'USD'}
- Travel Style: ${params.travelStyle || 'Relaxed'}
- Interests: ${(params.interests || []).join(', ') || 'Sightseeing, Local Food, Culture'}

REQUIREMENTS:
1. Return strictly valid JSON with no markdown formatting around it if possible, or standard markdown JSON code fence.
2. Realistic schedule: Don't pack too many activities. Match the "${params.travelStyle}" travel style and interests.
3. Budget Breakdown: Allocate realistic approximate amounts summing close to the total budget (${params.budget} ${params.currency || 'USD'}).
4. For each day, include 3 to 4 well-timed activities (Morning, Lunch/Midday, Afternoon, Evening) with realistic estimated costs.
5. Provide actionable travel tips, packing suggestions, and important notes.

JSON Schema required:
{
  "tripTitle": "string",
  "destinationSummary": "string",
  "estimatedTotalCost": number,
  "budgetBreakdown": {
    "accommodation": number,
    "food": number,
    "transportation": number,
    "activities": number,
    "miscellaneous": number
  },
  "days": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "theme": "string",
      "activities": [
        {
          "time": "09:00 AM",
          "title": "string",
          "description": "string",
          "estimatedCost": number,
          "category": "Sightseeing | Food | Adventure | Culture | Leisure | Shopping"
        }
      ]
    }
  ],
  "travelTips": ["string"],
  "packingSuggestions": ["string"],
  "importantNotes": ["string"]
}
`;

    const { result, modelName } = await executeWithRetryAndFallback(genAI, prompt);
    const responseText = result.response.text();

    // Clean JSON response
    let cleanedText = responseText.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const parsedData = JSON.parse(cleanedText);
    parsedData.modelUsed = modelName;
    return parsedData;
  } catch (error) {
    console.error('[Gemini API] ❌ generateItinerary failed:', error.message);
    console.warn('[Gemini API] ⚠️ Returning fallback structured itinerary.');
    return generateFallbackItinerary(params);
  }
};

/**
 * AI Travel Assistant Query (with robust retry & model fallback chain)
 */
export const askTravelAssistant = async ({ message, tripContext }) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key' || apiKey.trim() === '') {
    return {
      reply: `[DEV FALLBACK] I am your TripGenie assistant! Based on your trip to ${
        tripContext?.destination || 'your destination'
      } for ${tripContext?.duration || 1} day(s) with ${tripContext?.travelers || 1} traveler(s) and a budget of ${
        tripContext?.budget || 'planned'
      } ${tripContext?.currency || 'USD'}, here is a helpful suggestion: Make sure to check weather forecasts, try local signature dishes, and keep transport passes handy. You asked: "${message}".`,
      isFallback: true,
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    const prompt = `
You are TripGenie, a friendly, concise, and highly knowledgeable AI travel concierge assistant.
Answer the user's travel question clearly, practically, and specifically in the context of their trip.

CURRENT TRIP CONTEXT:
- Destination: ${tripContext?.destination || 'Unknown'}
- Duration: ${tripContext?.duration || 1} days
- Dates: ${tripContext?.startDate || 'Not set'} to ${tripContext?.endDate || 'Not set'}
- Travelers: ${tripContext?.travelers || 1}
- Total Budget: ${tripContext?.budget || 'Flexible'} ${tripContext?.currency || 'USD'}
- Travel Style: ${tripContext?.travelStyle || 'Standard'}
- Interests: ${Array.isArray(tripContext?.interests) ? tripContext.interests.join(', ') : 'Sightseeing, Local Culture'}
- Destination Summary: ${tripContext?.destinationSummary || 'None provided'}
${tripContext?.days?.length ? `- Planned Days: ${tripContext.days.length} days scheduled` : ''}

USER QUESTION:
"${message}"

INSTRUCTIONS:
1. Provide a warm, actionable, and direct response tailored specifically to the ${tripContext?.duration || 1}-day duration and ${tripContext?.destination || 'destination'}.
2. Use bullet points or short clear paragraphs for readability.
3. Keep the advice practical, accurate, and inspiring.
`;

    const { result, modelName } = await executeWithRetryAndFallback(genAI, prompt);
    const reply = result.response.text();

    return {
      reply,
      isFallback: false,
      modelUsed: modelName,
    };
  } catch (error) {
    console.error('[Gemini API] ❌ askTravelAssistant failed:', error.message);
    const errorInfo = classifyError(error);

    if (errorInfo.type === 'AUTH_ERROR') {
      return {
        reply: `⚠️ Authentication Issue: Unable to connect to Gemini API. Please verify the GEMINI_API_KEY environment variable.`,
        isFallback: true,
        error: errorInfo.message,
      };
    }

    if (errorInfo.type === 'RATE_LIMIT') {
      return {
        reply: `⚠️ The AI service rate limit is currently reached. Here is a quick travel tip for ${
          tripContext?.destination || 'your trip'
        } (${tripContext?.duration || 1} days): Pack essentials for the local climate, carry offline maps, and check top cultural attractions in advance!`,
        isFallback: true,
        error: errorInfo.message,
      };
    }

    return {
      reply: `I ran into a temporary connection issue while contacting the AI service, but here is a quick tip for your ${
        tripContext?.duration || 1
      }-day trip to ${
        tripContext?.destination || 'your destination'
      }: Don't forget to check local weather forecasts, pack essentials according to the climate, and keep offline map directions handy!`,
      isFallback: true,
      error: errorInfo.message,
    };
  }
};

/**
 * Internal test function for verifying Gemini connectivity, key, and model execution
 */
export const testGeminiAPI = async () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key' || apiKey.trim() === '') {
    return {
      success: false,
      message: 'GEMINI_API_KEY is not configured in server environment',
      models: getCandidateModels(),
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const testPrompt = 'Respond with "Gemini API is fully operational" in 5 words.';
    const { result, modelName } = await executeWithRetryAndFallback(genAI, testPrompt);
    const responseText = result.response.text();

    return {
      success: true,
      modelUsed: modelName,
      candidateModels: getCandidateModels(),
      testResponse: responseText.trim(),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      candidateModels: getCandidateModels(),
    };
  }
};
