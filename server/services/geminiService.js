import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Helper to generate fallback itinerary data when API key is missing or fails in development
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

  const sampleActivitiesPool = [
    {
      time: '09:00 AM',
      title: `Morning Exploration of ${destination} Landmark`,
      description: `Start your journey exploring the iconic cultural sights and heritage quarters of ${destination}.`,
      estimatedCost: Math.round(budget * 0.02),
      category: 'Sightseeing',
    },
    {
      time: '01:00 PM',
      title: 'Authentic Local Culinary Tasting',
      description: `Savor regional delicacies at a highly recommended local cafe and food market.`,
      estimatedCost: Math.round(budget * 0.03),
      category: 'Food',
    },
    {
      time: '04:00 PM',
      title: `${interests[0] || 'Scenic'} Leisure & Discovery Walk`,
      description: `Immerse yourself in ${destination}'s vibrant neighborhoods, scenic vistas, and craft stalls.`,
      estimatedCost: Math.round(budget * 0.01),
      category: 'Leisure',
    },
    {
      time: '07:30 PM',
      title: 'Sunset Dinner & Relaxing Evening',
      description: `Unwind with scenic views and delicious dining tailored to your ${travelStyle.toLowerCase()} travel style.`,
      estimatedCost: Math.round(budget * 0.04),
      category: 'Dining',
    },
  ];

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
 * Generate Itinerary with Gemini API or Fallback
 */
export const generateItinerary = async (params) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key' || apiKey.trim() === '') {
    console.warn(
      '⚠️ [DEV ONLY] GEMINI_API_KEY is not configured in server/.env. Using structured development fallback.'
    );
    return generateFallbackItinerary(params);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-1.5-flash or gemini-2.0-flash
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Clean JSON response
    let cleanedText = responseText.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const parsedData = JSON.parse(cleanedText);
    return parsedData;
  } catch (error) {
    console.error('❌ Gemini API Error:', error.message);
    console.warn('⚠️ Falling back to development mock data due to AI API error.');
    return generateFallbackItinerary(params);
  }
};

/**
 * AI Travel Assistant Query
 */
export const askTravelAssistant = async ({ message, tripContext }) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key' || apiKey.trim() === '') {
    return {
      reply: `[DEV FALLBACK] I am your TripGenie assistant! Based on your trip to ${
        tripContext?.destination || 'your destination'
      } for ${tripContext?.travelers || 1} traveler(s) with a budget of ${
        tripContext?.budget || 'planned'
      } ${tripContext?.currency || 'USD'}, here is a helpful suggestion: Make sure to check weather forecasts, try local signature dishes, and keep transport passes handy. You asked: "${message}".`,
      isFallback: true,
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
You are TripGenie, a friendly, concise, and highly knowledgeable AI travel concierge assistant.
Answer the user's travel question clearly and practically in the context of their specific trip.

TRIP CONTEXT:
- Destination: ${tripContext?.destination || 'Unknown'}
- Dates: ${tripContext?.startDate || ''} to ${tripContext?.endDate || ''} (${tripContext?.duration || 1} days)
- Travelers: ${tripContext?.travelers || 1}
- Budget: ${tripContext?.budget || 'Flexible'} ${tripContext?.currency || 'USD'}
- Travel Style: ${tripContext?.travelStyle || 'Standard'}
- Interests: ${(tripContext?.interests || []).join(', ')}
- Destination Summary: ${tripContext?.destinationSummary || 'None provided'}

USER QUERY:
"${message}"

INSTRUCTIONS:
- Give a warm, helpful, and direct answer tailored to their destination, budget, and travel style.
- Use bullet points or short paragraphs for clarity.
- Keep the response concise, practical, and inspiring.
`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    return {
      reply,
      isFallback: false,
    };
  } catch (error) {
    console.error('❌ Gemini Travel Assistant Error:', error.message);
    return {
      reply: `I ran into a temporary connection issue while contacting the AI service, but here is a quick tip for ${
        tripContext?.destination || 'your trip'
      }: Don't forget to keep offline maps and essentials packed!`,
      isFallback: true,
    };
  }
};
