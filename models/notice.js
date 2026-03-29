const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['info', 'urgent', 'promo', 'announcement'],
    default: 'info'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isOneTime: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date
  },
  backgroundColor: {
    type: String,
    default: '#ffffff'
  },
  textColor: {
    type: String,
    default: '#333333'
  },
  image: {
    type: String
  },
  buttonText: {
    type: String,
    default: 'Got it!'
  },
  buttonLink: {
    type: String
  },
  views: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notice', noticeSchema);