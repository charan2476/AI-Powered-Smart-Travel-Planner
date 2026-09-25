import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Destination name is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      required: true,
      enum: ['Beach', 'Mountain', 'Heritage', 'City', 'Nature', 'Culinary', 'Adventure'],
      default: 'City',
    },
    image: {
      type: String,
      required: true,
    },
    approximateBudget: {
      type: String,
      default: '$500 - $1,500',
    },
    bestFor: {
      type: String,
      default: 'Relaxed & Sightseeing',
    },
    attractions: {
      type: [String],
      default: [],
    },
    travelTips: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Destination = mongoose.model('Destination', destinationSchema);
export default Destination;
