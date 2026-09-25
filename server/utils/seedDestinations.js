import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Destination from '../models/Destination.js';

dotenv.config();

const sampleDestinations = [
  {
    name: 'Goa',
    description: 'A coastal paradise famed for sun-drenched golden beaches, vibrant nightlife, Portuguese colonial architecture, and fresh seafood shacks.',
    category: 'Beach',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80',
    approximateBudget: '$400 - $900',
    bestFor: 'Relaxed & Beach Escapes',
    attractions: ['Baga & Anjuna Beaches', 'Fort Aguada', 'Dudhsagar Waterfalls', 'Old Goa Cathedrals', 'Fontainhas Latin Quarter'],
    travelTips: [
      'Rent a scooter or car for convenient beach hopping.',
      'Visit North Goa for vibrant parties and South Goa for serene tranquil beaches.',
      'Try authentic Goan fish curry and Bebinca dessert.'
    ]
  },
  {
    name: 'Manali',
    description: 'Nestled in the breathtaking Himalayas, Manali offers snow-capped peaks, pine forests, hot springs, and thrilling mountain adventures.',
    category: 'Mountain',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80',
    approximateBudget: '$350 - $800',
    bestFor: 'Adventure & Mountain Lovers',
    attractions: ['Solang Valley', 'Rohtang Pass', 'Hadimba Temple', 'Old Manali Cafes', 'Jogini Waterfall Trek'],
    travelTips: [
      'Pack warm layers, even during summer evenings.',
      'Pre-book Rohtang Pass permits in advance.',
      'Try paragliding and river rafting in Solang Valley.'
    ]
  },
  {
    name: 'Jaipur',
    description: 'The iconic "Pink City" of Rajasthan, known for grand royal palaces, majestic forts, intricate havelis, and rich cultural heritage.',
    category: 'Heritage',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80',
    approximateBudget: '$300 - $750',
    bestFor: 'Cultural & Heritage Explorers',
    attractions: ['Hawa Mahal', 'Amber Palace', 'City Palace', 'Jantar Mantar Observatory', 'Nahargarh Fort Sunset Point'],
    travelTips: [
      'Get a composite ticket for entry to multiple monuments.',
      'Shop for blue pottery, block print fabrics, and gems at Johari Bazaar.',
      'Visit Amber Palace early in the morning to beat the heat.'
    ]
  },
  {
    name: 'Kerala (Wayanad & Munnar)',
    description: "Known as God's Own Country, offering tranquil backwaters, lush emerald tea plantations, spice gardens, and Ayurvedic wellness retreats.",
    category: 'Nature',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80',
    approximateBudget: '$450 - $1,100',
    bestFor: 'Nature & Romantic Getaways',
    attractions: ['Alleppey Houseboat Backwaters', 'Munnar Tea Gardens', 'Eravikulam National Park', 'Periyar Wildlife Sanctuary', 'Varkala Cliff Beach'],
    travelTips: [
      'Book an overnight stay in an Alleppey traditional houseboat.',
      'Indulge in authentic Kerala Ayurvedic rejuvenation therapies.',
      'Savor Kerala Sadya served on a fresh banana leaf.'
    ]
  },
  {
    name: 'Ooty',
    description: 'The Queen of Hill Stations in the Nilgiri Hills, renowned for charming colonial cottages, botanical gardens, and scenic toy train rides.',
    category: 'Mountain',
    image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1000&q=80',
    approximateBudget: '$250 - $600',
    bestFor: 'Relaxed & Family Vacations',
    attractions: ['Nilgiri Mountain Railway Toy Train', 'Ooty Botanical Gardens', 'Pykara Lake & Waterfalls', 'Doddabetta Peak', 'Tea Factory & Museum'],
    travelTips: [
      'Book Nilgiri Toy Train tickets weeks ahead on IRCTC.',
      'Buy homemade gourmet chocolates and Nilgiri eucalyptus oil.',
      'Enjoy boating during sunset at Pykara Lake.'
    ]
  },
  {
    name: 'Hyderabad',
    description: 'A dynamic metropolis blending centuries-old Nizami grandeur, the historic Charminar, world-famous biryani, and a booming tech hub.',
    category: 'City',
    image: 'https://images.unsplash.com/photo-1618083707368-b3823daa2726?auto=format&fit=crop&w=1000&q=80',
    approximateBudget: '$250 - $650',
    bestFor: 'Food & Cultural Explorers',
    attractions: ['Charminar', 'Golconda Fort Sound & Light Show', 'Ramoji Film City', 'Chowmahalla Palace', 'Hussain Sagar Lake & Buddha Statue'],
    travelTips: [
      'Taste authentic Dum Biryani at Paradise or Shadab.',
      'Visit the vibrant Laad Bazaar for sparkling lacquer bangles and pearls.',
      'Climb to the top of Golconda Fort for a breathtaking panoramic city view.'
    ]
  },
  {
    name: 'Chennai',
    description: 'The cultural capital of South India, famous for classical Carnatic music, Dravidian temple architecture, filter coffee, and Marina Beach.',
    category: 'Heritage',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80',
    approximateBudget: '$250 - $600',
    bestFor: 'Art, Heritage & Temple Lovers',
    attractions: ['Kapaleeshwarar Temple', 'Marina Beach Promenade', 'San Thome Basilica', 'DakshinaChitra Heritage Village', 'Mahabalipuram Shore Temples'],
    travelTips: [
      'Take a day excursion to UNESCO heritage site Mahabalipuram.',
      'Start your day with piping hot degree filter coffee and crispy ghee roast dosas.',
      'Marina Beach is best experienced late afternoon during sunset.'
    ]
  },
  {
    name: 'Mumbai',
    description: 'The City of Dreams — a high-energy metropolis on the Arabian Sea, home to Bollywood, grand Victorian architecture, and legendary street food.',
    category: 'City',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1000&q=80',
    approximateBudget: '$400 - $1,200',
    bestFor: 'Urban Exploration & Nightlife',
    attractions: ['Gateway of India', 'Marine Drive Queen’s Necklace', 'Elephanta Caves Ferry', 'Chhatrapati Shivaji Maharaj Terminus', 'Bandra Bandstand'],
    travelTips: [
      'Walk along Marine Drive at sunset or late night for breezy sea views.',
      'Take the ferry from Gateway of India to Elephanta rock caves.',
      'Try Mumbai cutting chai, Vada Pav, and Pav Bhaji near Juhu Beach.'
    ]
  },
  {
    name: 'Delhi',
    description: 'The historic capital of India spanning Mughal wonders, bustling spice bazaars of Chandni Chowk, lush Lodi gardens, and world-class culinary scenes.',
    category: 'Heritage',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80',
    approximateBudget: '$300 - $800',
    bestFor: 'History, Food & Shopping',
    attractions: ['Red Fort & Jama Masjid', 'Qutub Minar Complex', 'Humayun’s Tomb', 'India Gate & Kartavya Path', 'Lotus Temple'],
    travelTips: [
      'Use the efficient Delhi Metro network for seamless cross-city travel.',
      'Take a food and heritage rickshaw walk through Chandni Chowk.',
      'Explore the handicrafts at Dilli Haat and artisan boutique shops.'
    ]
  },
  {
    name: 'Bengaluru',
    description: 'The Garden City and Silicon Valley of India, known for pleasant year-round weather, sprawling botanical parks, artisanal breweries, and cafe culture.',
    category: 'City',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1000&q=80',
    approximateBudget: '$300 - $700',
    bestFor: 'Craft Beer, Cafes & Green Parks',
    attractions: ['Lalbagh Botanical Gardens Glass House', 'Cubbon Park', 'Bangalore Palace', 'Bannerghatta National Park Safari', 'Indiranagar & Koramangala Cafe Street'],
    travelTips: [
      'Stroll through Cubbon Park on a crisp weekend morning.',
      'Tour local microbreweries in Indiranagar and Whitefield.',
      'Try traditional Benne Masala Dosa at Vidyarthi Bhavan or CTR.'
    ]
  }
];

export const seedDestinations = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tripgenie';
    await mongoose.connect(connUri);
    console.log('Connected to MongoDB for seeding...');

    await Destination.deleteMany({});
    console.log('Cleared existing destinations.');

    await Destination.insertMany(sampleDestinations);
    console.log(`✅ Successfully seeded ${sampleDestinations.length} popular destinations!`);

    if (process.argv[1] && process.argv[1].endsWith('seedDestinations.js')) {
      mongoose.connection.close();
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Error seeding destinations:', error.message);
    if (process.argv[1] && process.argv[1].endsWith('seedDestinations.js')) {
      process.exit(1);
    }
  }
};

// If run directly via node utils/seedDestinations.js
if (process.argv[1] && process.argv[1].endsWith('seedDestinations.js')) {
  seedDestinations();
}
