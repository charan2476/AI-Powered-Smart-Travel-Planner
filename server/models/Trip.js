import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  time: {
    type: String,
    default: '09:00 AM',
  },
  title: {
    type: String,
    required: [true, 'Activity title is required'],
  },
  description: {
    type: String,
    default: '',
  },
  estimatedCost: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    default: 'Sightseeing',
  },
});

const dayPlanSchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    default: '',
  },
  theme: {
    type: String,
    default: '',
  },
  activities: [activitySchema],
});

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true,
    },
    startDate: {
      type: String,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: String,
      required: [true, 'End date is required'],
    },
    duration: {
      type: Number,
      required: true,
      min: [1, 'Trip must be at least 1 day'],
    },
    travelers: {
      type: Number,
      default: 1,
      min: [1, 'At least 1 traveler required'],
    },
    budget: {
      type: Number,
      required: [true, 'Budget is required'],
      min: [1, 'Budget must be positive'],
    },
    currency: {
      type: String,
      default: 'USD',
    },
    travelStyle: {
      type: String,
      enum: [
        'Relaxed',
        'Adventure',
        'Luxury',
        'Budget',
        'Family',
        'Romantic',
        'Cultural',
        'Food & Exploration',
      ],
      default: 'Relaxed',
    },
    interests: {
      type: [String],
      default: [],
    },
    tripTitle: {
      type: String,
      default: '',
    },
    destinationSummary: {
      type: String,
      default: '',
    },
    estimatedTotalCost: {
      type: Number,
      default: 0,
    },
    budgetBreakdown: {
      accommodation: { type: Number, default: 0 },
      food: { type: Number, default: 0 },
      transportation: { type: Number, default: 0 },
      activities: { type: Number, default: 0 },
      miscellaneous: { type: Number, default: 0 },
    },
    days: [dayPlanSchema],
    travelTips: {
      type: [String],
      default: [],
    },
    packingSuggestions: {
      type: [String],
      default: [],
    },
    importantNotes: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['Upcoming', 'Completed', 'Planning', 'Draft'],
      default: 'Upcoming',
    },
  },
  {
    timestamps: true,
  }
);

const Trip = mongoose.model('Trip', tripSchema);
export default Trip;
