const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const { isLoggedIn, isOwner } = require("../middleware"); 
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { extractCoordinatesFromGoogleMapsUrl } = require('../utils/geo');
const Notice = require('../models/notice');

// ========== HELPER FUNCTION TO CLEAN ARRAY DATA ==========
function cleanArrayField(data) {
    if (!data) return [];
    
    // If it's already a simple array of strings
    if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'string') {
        return data.filter(item => item && item.trim() !== '');
    }
    
    // If it's an array of objects (the problem case)
    if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
        const result = [];
        for (let obj of data) {
            for (let key in obj) {
                if (obj[key] && typeof obj[key] === 'string' && obj[key].trim() !== '') {
                    result.push(obj[key].trim());
                }
            }
        }
        return result;
    }
    
    // If it's a single string
    if (typeof data === 'string') {
        if (data.includes(',')) {
            return data.split(',').map(item => item.trim()).filter(item => item !== '');
        }
        return data.trim() !== '' ? [data.trim()] : [];
    }
    
    // If it's a single object
    if (typeof data === 'object' && data !== null) {
        return Object.values(data).filter(v => v && typeof v === 'string' && v.trim() !== '');
    }
    
    return [];
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// All available categories
const allCategories = [
  "Mountain", "Wildlife", "Culture", "Heritage", "Trekking", "Adventure",
  "Himalayan", "Agriculture", "Yoga", "Food", "Beach", "Lake", 
  "Desert", "Forest", "River", "City", "Village", "Farm", "Garden", 
  "Spa", "Meditation", "Photography", "Art", "Music", "Dance", 
  "Workshop", "Cooking", "Wine", "Coffee", "Tea", "Camping"
];

// ========== GET ROUTES ==========

// Index route
router.get('/', async (req, res) => {
    try {
        const notices = await Notice.find({ 
            isOneTime: { $ne: true }
        }).sort({ 
            isPinned: -1,
            createdAt: -1 
        });
        
        let selectedNotice = null;
        if (req.query.noticeId) {
            try {
                selectedNotice = await Notice.findById(req.query.noticeId);
            } catch (e) {
                console.log("Invalid noticeId:", req.query.noticeId);
            }
        }
        
        const oneTimeNotice = await Notice.findOne({
            isActive: true
        }).sort({ createdAt: -1 });
        
        const allListings = await Listing.find({});
        
        let filter = {};
        if (req.query.category) filter.category = req.query.category;
        if (req.query.difficulty) filter.difficulty = req.query.difficulty;
        if (req.query.search) {
            filter.title = { $regex: req.query.search, $options: 'i' };
        }
        
        const listings = await Listing.find(filter);
        
        res.render('listings/index', {
            notices: notices,
            oneTimeNotice: oneTimeNotice,
            selectedNotice: selectedNotice,
            listings: listings,
            allListings: allListings,
            search: req.query.search || '',
            category: req.query.category || '',
            difficulty: req.query.difficulty || '',
            currentPath: req.path
        });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Could not fetch listings');
        res.redirect('/');
    }
});

// Category filter
router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const allListings = await Listing.find({ categories: category }).populate("owner");
    res.render("listings/index", { 
      allListings, 
      search: "", 
      category,
      difficulty: "",
      categories: allCategories,
      currentUser: req.user
    });
  } catch (err) {
    req.flash("error", "Cannot find listings");
    res.redirect("/listings");
  }
});

// Search
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    const allListings = await Listing.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
        { country: { $regex: q, $options: "i" } },
        { categories: { $regex: q, $options: "i" } }
      ]
    }).populate("owner");
    res.render("listings/index", { 
      allListings, 
      search: q, 
      category: "All",
      difficulty: "",
      categories: allCategories,
      currentUser: req.user
    });
  } catch (err) {
    req.flash("error", "Search failed");
    res.redirect("/listings");
  }
});

// New Route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new", { 
    categories: allCategories,
    currentUser: req.user 
  });
});

// Show Route
router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate("owner")
      .populate({
        path: "reviews",
        populate: {
          path: "author"
        }
      });
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }
    res.render("listings/show", { 
      listing,
      currentUser: req.user 
    });
  } catch (err) {
    console.log(err);
    req.flash("error", "Something went wrong");
    res.redirect("/listings");
  }
});

// Test route for uploads
router.get("/test/uploads", (req, res) => {
  const uploadsDir = path.join(__dirname, '../uploads');
  
  let files = [];
  let error = null;
  
  try {
    if (fs.existsSync(uploadsDir)) {
      files = fs.readdirSync(uploadsDir);
    } else {
      error = 'Uploads folder does not exist';
    }
  } catch (err) {
    error = err.message;
  }
  
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Uploads Test</title>
        <style>
            body { font-family: Arial; padding: 20px; }
            .file-item { margin: 10px 0; padding: 10px; border: 1px solid #ddd; }
            img { max-width: 200px; max-height: 200px; margin-top: 10px; }
            .success { color: green; }
            .error { color: red; }
        </style>
    </head>
    <body>
        <h1>📁 Uploads Folder Test</h1>
        <p><strong>Path:</strong> ${uploadsDir}</p>
        <p><strong>Exists:</strong> ${fs.existsSync(uploadsDir) ? '✅ Yes' : '❌ No'}</p>
  `;
  
  if (error) {
    html += `<p class="error"> Error: ${error}</p>`;
  } else {
    html += `<p><strong>Files found:</strong> ${files.length}</p>`;
    
    if (files.length === 0) {
      html += `<p class="error"> No files in uploads folder</p>`;
    } else {
      html += `<h3>Files:</h3>`;
      files.forEach(file => {
        const fileUrl = `/uploads/${file}`;
        const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file);
        
        html += `<div class="file-item">`;
        html += `<p><strong>${file}</strong></p>`;
        html += `<p>URL: <a href="${fileUrl}" target="_blank">${fileUrl}</a></p>`;
        
        if (isImage) {
          html += `<img src="${fileUrl}" onerror="this.style.display='none'; this.parentNode.innerHTML+='<p class=\'error\'>❌ Image failed to load</p>'">`;
        }
        
        html += `</div>`;
      });
    }
  }
  
  html += `
        <p><a href="/listings">← Back to Listings</a></p>
    </body>
    </html>
  `;
  
  res.send(html);
});

// Map Search Route
router.get("/map/search", async (req, res) => {
  try {
    console.log("Map search route called");
    const listings = await Listing.find({}).populate('owner');
    console.log(`Found ${listings.length} listings for map`);
    res.render('listings/map-search', { 
      listings,
      currentUser: req.user 
    });
  } catch (err) {
    console.error("Error in map search route:", err);
    req.flash("error", "Cannot load map: " + err.message);
    res.redirect('/listings');
  }
});

// ========== POST ROUTE (CREATE) - FIXED ==========
router.post("/", isLoggedIn, upload.array('listing[images]', 30), async (req, res) => {
  try {
    console.log("========== NEW LISTING SUBMISSION ==========");
    console.log("Files received:", req.files ? req.files.length : 0);
    
    const listingData = { ...req.body.listing };
    
    // CLEAN AMENITIES AND EXPERIENCES - This fixes the error
    listingData.amenities = cleanArrayField(listingData.amenities);
    listingData.experiences = cleanArrayField(listingData.experiences);
    
    console.log("Cleaned amenities:", listingData.amenities);
    console.log("Cleaned experiences:", listingData.experiences);
    
    // Handle Google Maps URL and extract coordinates
    if (listingData.googleMapsUrl && listingData.googleMapsUrl.trim() !== '') {
      try {
        const { lat, lng } = await extractCoordinatesFromGoogleMapsUrl(listingData.googleMapsUrl);
        listingData.latitude = lat;
        listingData.longitude = lng;
        console.log('Extracted coordinates:', { lat, lng });
      } catch (err) {
        listingData.latitude = 27.7172;
        listingData.longitude = 85.3240;
      }
    } else {
      listingData.latitude = 27.7172;
      listingData.longitude = 85.3240;
    }
    
    // Handle categories
    if (listingData.categories) {
      if (!Array.isArray(listingData.categories)) {
        listingData.categories = [listingData.categories];
      }
      listingData.category = listingData.categories[0] || 'All';
    } else {
      listingData.categories = [];
      listingData.category = 'All';
    }
    
    // Handle images - ONLY from file uploads
    if (req.files && req.files.length > 0) {
      listingData.images = req.files.map(file => ({
        url: `/uploads/${file.filename}`,
        filename: file.filename
      }));
      console.log(`Added ${req.files.length} uploaded images`);
    } else {
      // If no files uploaded, use default image
      listingData.images = [{
        url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
        filename: "default"
      }];
      console.log("No images uploaded, using default image");
    }
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'price', 'location', 'country'];
    for (let field of requiredFields) {
      if (!listingData[field]) {
        throw new Error(`Field "${field}" is required`);
      }
    }
    
    if (!listingData.categories || listingData.categories.length === 0) {
      throw new Error("At least one category is required");
    }
    
    // Create listing
    const listing = new Listing(listingData);
    listing.owner = req.user._id;
    
    await listing.save();
    console.log("Listing saved with ID:", listing._id);
    
    req.flash("success", "New listing created successfully!");
    res.redirect(`/listings/${listing._id}`);
    
  } catch (err) {
    console.error("ERROR CREATING LISTING:", err);
    req.flash("error", "Failed to create listing: " + err.message);
    res.redirect("/listings/new");
  }
});

// ========== EDIT ROUTE ==========
router.get("/:id/edit", isLoggedIn, isOwner, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }
    res.render("listings/edit", { 
      listing, 
      categories: allCategories,
      currentUser: req.user 
    });
  } catch (err) {
    console.log(err);
    req.flash("error", "Something went wrong");
    res.redirect("/listings");
  }
});

// ========== UPDATE ROUTE - FIXED ==========
router.put('/:id', isLoggedIn, isOwner, upload.array('listing[images]', 30), async (req, res) => {
  try {
    const { id } = req.params;
    const listingData = { ...req.body.listing };
    
    // CLEAN AMENITIES AND EXPERIENCES - This fixes the error
    listingData.amenities = cleanArrayField(listingData.amenities);
    listingData.experiences = cleanArrayField(listingData.experiences);
    
    // Handle Google Maps URL
    if (listingData.googleMapsUrl && listingData.googleMapsUrl.trim() !== '') {
      const { lat, lng } = await extractCoordinatesFromGoogleMapsUrl(listingData.googleMapsUrl);
      listingData.latitude = lat;
      listingData.longitude = lng;
    }
    
    // Handle categories
    if (listingData.categories) {
      if (!Array.isArray(listingData.categories)) {
        listingData.categories = [listingData.categories];
      }
      listingData.categories = listingData.categories.filter(cat => cat && cat.trim() !== '');
    }
    
    // Handle new images
    if (req.files && req.files.length > 0) {
      listingData.images = req.files.map(file => ({
        url: `/uploads/${file.filename}`,
        filename: file.filename
      }));
    }
    
    const updatedListing = await Listing.findByIdAndUpdate(id, listingData, { 
      new: true, 
      runValidators: true 
    });
    
    if (!updatedListing) {
      req.flash('error', 'Listing not found');
      return res.redirect('/listings');
    }
    
    req.flash('success', 'Successfully updated listing!');
    res.redirect(`/listings/${updatedListing._id}`);
  } catch (err) {
    console.error('Error updating listing:', err);
    req.flash('error', err.message);
    res.redirect(`/listings/${req.params.id}/edit`);
  }
});

// ========== DELETE ROUTE ==========
router.delete("/:id", isLoggedIn, isOwner, async (req, res) => {
  try {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
  } catch (err) {
    console.log(err);
    req.flash("error", "Failed to delete listing");
    res.redirect("/listings");
  }
});

// ========== CATEGORY GROUP ROUTE ==========
router.get('/category-group/:group', async (req, res) => {
  try {
    const { group } = req.params;
    let categoryFilter = {};
    
    const categoryGroups = {
      'historic-cultural': ['Heritage', 'Culture', 'Art', 'Workshop', 'Photography'],
      'religious': ['Meditation', 'Yoga', 'Heritage'],
      'natural-wildlife': ['Mountain', 'Himalayan', 'Wildlife', 'Lake', 'Desert', 'Forest', 'River', 'Beach'],
      'cities': ['City', 'Village'],
      'trekking': ['Mountain', 'Himalayan', 'Trekking', 'Adventure', 'Camping'],
      'food': ['Food', 'Kitchen', 'Cooking', 'Wine', 'Coffee', 'Tea'],
      'agriculture': ['Agriculture', 'Farm', 'Garden']
    };
    
    if (categoryGroups[group]) {
      categoryFilter = { categories: { $in: categoryGroups[group] } };
    }
    
    const listings = await Listing.find(categoryFilter).populate('owner');
    
    const groupNames = {
      'historic-cultural': 'Historic & Cultural Sites',
      'religious': 'Religious Landmarks',
      'natural-wildlife': 'Natural & Wildlife Areas',
      'cities': 'Major Cities & Hubs',
      'trekking': 'Trekking Regions & Villages',
      'food': 'Food & Culinary Experiences',
      'agriculture': 'Agriculture & Farm Stays'
    };
    
    res.render('listings/category-group', {
      listings,
      groupName: groupNames[group],
      group,
      categoryGroups: categoryGroups[group] || [],
      allCategories,
      currentUser: req.user
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Cannot find listings');
    res.redirect('/listings');
  }
});

// Debug route
router.get("/debug/images", async (req, res) => {
    try {
        const listings = await Listing.find({});
        const imageInfo = listings.map(listing => ({
            title: listing.title,
            images: listing.images,
            firstImageUrl: listing.images && listing.images[0] ? listing.images[0].url : 'No images'
        }));
        res.json(imageInfo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mobile route
router.get('/mobile', async (req, res) => {
    try {
        // Fetch data for mobile view
        const listings = await Listing.find().limit(10);
        const categories = await Category.find(); // if you have categories
        const bookings = req.user ? await Booking.find({ user: req.user._id }) : [];
        
        res.render('listings/mobile-index', {
            title: 'Airbnb - Mobile',
            listings: listings,
            categories: categories,
            bookings: bookings,
            currentUser: req.user,
            messages: [] // Fetch messages if you have messaging system
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading mobile view');
    }
});
// When rendering index page with map
router.get('/', async (req, res) => {
    const allListings = await Listing.find({});
    
    // Format listings for map (with coordinates)
    const listingsForMap = allListings.map(listing => ({
        _id: listing._id,
        title: listing.title,
        location: listing.location,
        geometry: listing.geometry  // Make sure this exists in your schema
    }));
    
    res.render('listings/index.ejs', { 
        listings: allListings,
        localListings: listingsForMap  // Pass to map
    });
});
module.exports = router;