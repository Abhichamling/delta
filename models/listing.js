const mongoose = require('mongoose');

// All available categories
const allCategories = [
  "Mountain", "Himalayan", "Adventure", "Trekking", "Camping",
  "Wildlife", "Culture", "Heritage", "Yoga", "Meditation",
  "Agriculture", "Education", "Food", "Kitchen", "Cooking",
  "Beach", "Lake", "Desert", "Forest", "River",
  "City", "Village", "Farm", "Garden", "Spa",
  "Photography", "Art", "Music", "Dance", "Workshop",
  "Wine", "Coffee", "Tea", "All", "Trending"
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
  googleMapsUrl: {
    type: String,
    default: ''
  },
  longitude: {
    type: Number,
    default: 85.3240
  },
  latitude: {
    type: Number,
    default: 27.7172
  },
  categories: [{
    type: String,
    enum: allCategories
  }],
  category: {
    type: String,
    enum: allCategories
  },
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

// Pre-save middleware
listingSchema.pre('save', function(next) {
  if (this.categories && this.categories.length > 0 && !this.category) {
    this.category = this.categories[0];
  }
  if (this.category && (!this.categories || this.categories.length === 0)) {
    this.categories = [this.category];
  }
  next();
});

module.exports = mongoose.model("Listing", listingSchema);