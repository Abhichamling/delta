const express = require('express');
const router = express.Router();
const Notice = require('../models/notice');
const wrapAsync = require('../utils/warapAsync');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// ============ CLOUDINARY CONFIGURATION ============
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'notices',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        transformation: [{ width: 800, height: 600, crop: 'limit' }] // Optimize for mobile
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Debug middleware
router.use((req, res, next) => {
    console.log('=== NOTICE ROUTE DEBUG ===');
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    next();
});

// ============ API ROUTES FOR MOBILE NOTICEBOARD ============

// GET all active notices for public NoticeBoard (Mobile friendly)
router.get('/api/notices', wrapAsync(async (req, res) => {
    try {
        const notices = await Notice.find({ isActive: true }).sort({ createdAt: -1 });
        
        // Convert image paths to absolute URLs for mobile
        const host = req.get('host');
        const protocol = req.protocol;
        
        const noticesWithFullUrls = notices.map(notice => {
            const noticeObj = notice.toObject();
            
            // Fix image paths for mobile (Cloudinary URLs are already absolute)
            if (noticeObj.imageFile && noticeObj.imageFile.startsWith('/uploads/')) {
                noticeObj.imageFile = `${protocol}://${host}${noticeObj.imageFile}`;
            }
            // Cloudinary URLs are already full URLs, no need to modify
            if (noticeObj.imageUrl && (noticeObj.imageUrl.startsWith('http://') || noticeObj.imageUrl.startsWith('https://'))) {
                // Already absolute URL
                noticeObj.imageUrl = noticeObj.imageUrl;
            } else if (noticeObj.imageUrl && noticeObj.imageUrl.startsWith('/uploads/')) {
                noticeObj.imageUrl = `${protocol}://${host}${noticeObj.imageUrl}`;
            }
            
            return noticeObj;
        });
        
        res.json({ 
            success: true, 
            notices: noticesWithFullUrls,
            count: notices.length 
        });
    } catch (err) {
        console.error('API Error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
}));

// GET single notice by ID (API)
router.get('/api/notices/:id', wrapAsync(async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id);
        if (!notice) {
            return res.status(404).json({ success: false, error: 'Notice not found' });
        }
        res.json({ success: true, notice });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}));

// GET active notice for homepage widget
router.get('/api/active', wrapAsync(async (req, res) => {
    const notice = await Notice.findOne({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, notice });
}));

// Track notice views (mobile)
router.post('/api/seen', wrapAsync(async (req, res) => {
    const { noticeId } = req.body;
    if (noticeId) {
        req.session.seenNotices = req.session.seenNotices || [];
        if (!req.session.seenNotices.includes(noticeId)) {
            req.session.seenNotices.push(noticeId);
        }
    }
    res.json({ success: true });
}));

// ============ ADMIN ROUTES (Server-side rendering) ============

// GET all notices (admin panel)
router.get('/', wrapAsync(async (req, res) => {
    const notices = await Notice.find({}).sort({ createdAt: -1 });
    res.render('notices/index', { notices });
}));

// GET new notice form
router.get('/new', wrapAsync(async (req, res) => {
    res.render('notices/new');
}));

// CREATE new notice (with Cloudinary upload)
router.post('/', upload.single('image'), wrapAsync(async (req, res) => {
    console.log('===== CREATE NOTICE =====');
    console.log('Form data:', req.body);
    console.log('Cloudinary file:', req.file);
    
    const { title, content, author, imageUrl, isActive } = req.body;
    
    if (!title || !content) {
        req.flash('error', 'Title and Content are required!');
        return res.redirect('/notices/new');
    }
    
    const noticeData = {
        title: title.trim(),
        content: content.trim(),
        author: author || 'Admin',
        isActive: isActive === 'on' || isActive === 'true'
    };
    
    // If file uploaded to Cloudinary
    if (req.file) {
        noticeData.imageFile = req.file.path; // Cloudinary URL
        console.log('✅ Image uploaded to Cloudinary:', req.file.path);
    }
    
    // If external image URL provided
    if (imageUrl && imageUrl.trim() !== '') {
        noticeData.imageUrl = imageUrl.trim();
    }
    
    const notice = new Notice(noticeData);
    await notice.save();
    
    req.flash('success', 'Notice published successfully with Cloudinary image!');
    res.redirect('/notices');
}));

// GET single notice (admin view)
router.get('/:id', wrapAsync(async (req, res) => {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
        req.flash('error', 'Notice not found');
        return res.redirect('/notices');
    }
    res.render('notices/show', { notice });
}));

// GET edit notice form
router.get('/:id/edit', wrapAsync(async (req, res) => {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
        req.flash('error', 'Notice not found');
        return res.redirect('/notices');
    }
    res.render('notices/edit', { notice });
}));

// UPDATE notice (with Cloudinary upload)
router.put('/:id', upload.single('image'), wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { title, content, author, imageUrl, isActive } = req.body;
    
    const noticeData = {
        title: title.trim(),
        content: content.trim(),
        author: author || 'Admin',
        isActive: isActive === 'on' || isActive === 'true'
    };
    
    // If new file uploaded to Cloudinary
    if (req.file) {
        noticeData.imageFile = req.file.path; // Cloudinary URL
        console.log('✅ Updated image uploaded to Cloudinary:', req.file.path);
    }
    
    // If external image URL provided
    if (imageUrl && imageUrl.trim() !== '') {
        noticeData.imageUrl = imageUrl.trim();
    }
    
    await Notice.findByIdAndUpdate(id, noticeData);
    req.flash('success', 'Notice updated successfully!');
    res.redirect(`/notices/${id}`);
}));

// DELETE notice (optionally delete from Cloudinary too)
router.delete('/:id', wrapAsync(async (req, res) => {
    const notice = await Notice.findById(req.params.id);
    
    // Optional: Delete image from Cloudinary
    if (notice.imageFile && notice.imageFile.includes('cloudinary')) {
        try {
            // Extract public ID from Cloudinary URL
            const publicId = notice.imageFile.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`notices/${publicId}`);
            console.log('✅ Deleted image from Cloudinary');
        } catch (err) {
            console.error('Failed to delete from Cloudinary:', err);
        }
    }
    
    await Notice.findByIdAndDelete(req.params.id);
    req.flash('success', 'Notice deleted successfully!');
    res.redirect('/notices');
}));

// TOGGLE notice active status
router.post('/:id/toggle', wrapAsync(async (req, res) => {
    const notice = await Notice.findById(req.params.id);
    notice.isActive = !notice.isActive;
    await notice.save();
    req.flash('success', `Notice ${notice.isActive ? 'activated' : 'deactivated'} successfully!`);
    res.redirect('/notices');
}));

module.exports = router;