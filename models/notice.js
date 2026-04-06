const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        trim: true
    },
    description: {
        type: String,
        default: null
    },
    
    // Images - Fixed version
    image: {
        type: String,
        default: null
    },
    imageUrl: {
        type: String,
        default: null
    },
    imageFile: {
        type: String,
        default: null
    },
    
    listings: {
        type: Array,
        default: []
    },
    
    author: {
        type: String,
        default: 'Admin'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    
    displayFrom: {
        type: Date,
        default: Date.now
    },
    displayUntil: {
        type: Date,
        default: null
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Method to get valid image URL
noticeSchema.methods.getImageUrl = function() {
    if (this.imageFile && this.imageFile !== '') {
        return this.imageFile;
    }
    if (this.imageUrl && this.imageUrl !== '') {
        return this.imageUrl;
    }
    if (this.image && this.image !== '') {
        return this.image;
    }
    return null;
};

noticeSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: new Date() });
    next();
});

noticeSchema.pre('updateOne', function(next) {
    this.set({ updatedAt: new Date() });
    next();
});

noticeSchema.methods.isCurrentlyActive = function() {
    const now = new Date();
    if (!this.isActive) return false;
    if (this.displayFrom && this.displayFrom > now) return false;
    if (this.displayUntil && this.displayUntil < now) return false;
    return true;
};

noticeSchema.statics.getActiveNotices = function() {
    const now = new Date();
    return this.find({
        isActive: true,
        displayFrom: { $lte: now },
        $or: [
            { displayUntil: null },
            { displayUntil: { $gte: now } }
        ]
    }).sort({ createdAt: -1 });
};

noticeSchema.virtual('bestImage').get(function() {
    return this.getImageUrl();
});

noticeSchema.virtual('shortContent').get(function() {
    const text = this.content || this.description || '';
    if (text.length <= 120) return text;
    return text.substring(0, 120) + '...';
});

noticeSchema.set('toJSON', { virtuals: true });
noticeSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Notice', noticeSchema);