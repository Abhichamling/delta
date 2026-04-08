const mongoose = require('mongoose');

// All available categories combined from both versions
const allCategories = [
  // Original categories
  "Wildlife", "Culture", "Heritage", "Trekking", "Adventure", 
  "Himalayan", "Agriculture", "Yoga", "Food", "Beach", "Lake", 
  "Desert", "Forest", "River", "City", "Village", "Farm", "Garden", 
  "Spa", "Meditation", "Photography", "Art", "Music", "Dance", 
  "Workshop", "Cooking", "Wine", "Coffee", "Tea", "Camping",
  
  // Additional categories from the new version
  "All", "Trending", "Mountain", "Education", "Kitchen"
];

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    url: String,
    filename: String
  }],
  price: {
    type: Number,
    required: true,
    min: 0
  },
  location: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  // Google Maps Link
  googleMapsUrl: {
    type: String,
    default: ''
  },
  // Coordinates for map
  longitude: {
    type: Number,
    default: 85.3240
  },
  latitude: {
    type: Number,
    default: 27.7172
  },
  // Geometry for geospatial queries (ALWAYS VISIBLE PIN)
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [85.3240, 27.7172] // [longitude, latitude]
    }
  },
  // Multiple categories (for new listings)
  categories: [{
    type: String,
    enum: allCategories
  }],
  // Single category (for backward compatibility)
  category: {
    type: String,
    enum: allCategories
  },
  // Optional fields
  bedrooms: {
    type: Number,
    default: 1
  },
  bathrooms: {
    type: Number,
    default: 1
  },
  maxGuests: {
    type: Number,
    default: 2
  },
  amenities: [String],
  experiences: [String],
  bestSeason: String,
  difficulty: {
    type: String,
    enum: ["Easy", "Moderate", "Challenging"],
    default: "Easy"
  },
  duration: String,
  included: [String],
  notIncluded: [String],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review"
  }]
}, { timestamps: true });

// Pre-save middleware to sync coordinates with geometry
listingSchema.pre('save', function(next) {
  // Sync categories
  if (this.categories && this.categories.length > 0 && !this.category) {
    this.category = this.categories[0];
  }
  if (this.category && (!this.categories || this.categories.length === 0)) {
    this.categories = [this.category];
  }
  
  // Sync geometry with coordinates
  if (this.longitude && this.latitude) {
    this.geometry.coordinates = [this.longitude, this.latitude];
  }
  
  next();
});

// Pre-update middleware to keep geometry in sync
listingSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.longitude && update.latitude) {
    update.geometry = {
      type: 'Point',
      coordinates: [update.longitude, update.latitude]
    };
  }
  next();
});

// Add geospatial index for faster queries
listingSchema.index({ geometry: '2dsphere' });
listingSchema.index({ longitude: 1, latitude: 1 });

module.exports = mongoose.model("Listing", listingSchema);