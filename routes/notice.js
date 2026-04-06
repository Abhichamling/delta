const express = require('express');
const router = express.Router();
const Notice = require('../models/notice');
const wrapAsync = require('../utils/warapAsync');
const multer = require('multer');
const path = require('path');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }
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
            
            // Fix image paths for mobile
            if (noticeObj.imageFile && noticeObj.imageFile.startsWith('/uploads/')) {
                noticeObj.imageFile = `${protocol}://${host}${noticeObj.imageFile}`;
            }
            if (noticeObj.imageUrl && noticeObj.imageUrl.startsWith('/uploads/')) {
                noticeObj.imageUrl = `${protocol}://${host}${noticeObj.imageUrl}`;
            }
            if (noticeObj.image && noticeObj.image.startsWith('/uploads/')) {
                noticeObj.image = `${protocol}://${host}${noticeObj.image}`;
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

// CREATE new notice
router.post('/', upload.single('image'), wrapAsync(async (req, res) => {
    console.log('===== CREATE NOTICE =====');
    console.log('Form data:', req.body);
    console.log('Uploaded file:', req.file);
    
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
    
    if (req.file) {
        noticeData.imageFile = '/uploads/' + req.file.filename;
    }
    
    if (imageUrl && imageUrl.trim() !== '') {
        noticeData.imageUrl = imageUrl.trim();
    }
    
    const notice = new Notice(noticeData);
    await notice.save();
    
    req.flash('success', 'Notice published successfully!');
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

// UPDATE notice
router.put('/:id', upload.single('image'), wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { title, content, author, imageUrl, isActive } = req.body;
    
    const noticeData = {
        title: title.trim(),
        content: content.trim(),
        author: author || 'Admin',
        isActive: isActive === 'on' || isActive === 'true'
    };
    
    if (req.file) {
        noticeData.imageFile = '/uploads/' + req.file.filename;
    }
    
    if (imageUrl && imageUrl.trim() !== '') {
        noticeData.imageUrl = imageUrl.trim();
    }
    
    await Notice.findByIdAndUpdate(id, noticeData);
    req.flash('success', 'Notice updated successfully!');
    res.redirect(`/notices/${id}`);
}));

// DELETE notice
router.delete('/:id', wrapAsync(async (req, res) => {
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