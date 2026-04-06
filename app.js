if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');

// Require Models
const User = require('./models/user.js');

// Require Routes
const listingRouter = require('./routes/listings.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');
const noticeRouter = require('./routes/notice.js');

// Check for MongoDB URL
const MONGO_URL = process.env.ATLASDB_URL;
if (!MONGO_URL) {
  console.error(' ATLASDB_URL is not defined in .env file');
  process.exit(1);
}

// Database connection
async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log(" Connected to MongoDB");
  } catch (err) {
    console.error(" Database connection error:", err.message);
    process.exit(1);
  }
}
main();

// App settings
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// Session configuration
const sessionOptions = {
  secret: process.env.SESSION_SECRET || 'mysecretcode',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGO_URL,
    touchAfter: 24 * 3600,
  }),
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
};

app.use(session(sessionOptions));
app.use(flash());

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global middleware
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentPath = req.path;
  res.locals.search = req.query.search || null;
  res.locals.category = req.query.category || null;
  res.locals.difficulty = req.query.difficulty || null;
  res.locals.oneTimeNotice = null;
  next();
});

// ============ ROUTES - ORDER MATTERS! ============
app.use('/', userRouter);                    // /signup, /login, /logout
app.use('/notices', noticeRouter);           // /notices (Admin panel + API)
app.use('/listings', listingRouter);         // /listings
app.use('/listings/:id/reviews', reviewRouter); // reviews

// ============ MOBILE NOTICEBOARD ROUTE ============
// This creates a public mobile-friendly NoticeBoard page
app.get('/noticeboard', async (req, res) => {
  try {
    const Notice = require('./models/notice');
    const notices = await Notice.find({ isActive: true }).sort({ createdAt: -1 });
    res.render('notices/mobile', { notices, currentUser: req.user });
  } catch (err) {
    console.error('NoticeBoard error:', err);
    res.render('notices/mobile', { notices: [], currentUser: req.user });
  }
});

// ============ API ROUTE FOR MOBILE NOTICEBOARD ============
// This is used by the JavaScript fetch() call
app.get('/api/notices', async (req, res) => {
  try {
    const Notice = require('./models/notice');
    const notices = await Notice.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, notices: notices });
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});
// Debug route to check images
app.get('/debug-images', async (req, res) => {
    const Notice = require('./models/notice');
    const notices = await Notice.find({});
    const imageInfo = notices.map(n => ({
        title: n.title,
        imageFile: n.imageFile,
        imageUrl: n.imageUrl,
        image: n.image,
        fullPath: n.imageFile ? `http://localhost:8080${n.imageFile}` : null
    }));
    res.json(imageInfo);
});

// Root route
app.get('/', (req, res) => {
  res.redirect('/listings');
});

// 404 Error handler
app.all('*', (req, res, next) => {
  const err = new Error('Page not found!');
  err.statusCode = 404;
  next(err);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(' Error:', err);
  res.status(err.statusCode || 500).render('listings/error', { 
    err,
    currentUser: req.user 
  });
});

// Try to find an available port
const tryPort = (port) => {
  return new Promise((resolve, reject) => {
    const server = require('net').createServer();
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false);
      } else {
        reject(err);
      }
    });
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    server.listen(port);
  });
};

// Start server with fallback
async function startServer() {
  let port = parseInt(process.env.PORT) || 8080;
  const maxAttempts = 10;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const available = await tryPort(port + attempt);
    if (available) {
      app.listen(port + attempt, () => {
        console.log(` Server is running on port ${port + attempt}`);
        console.log(` NoticeBoard (Mobile): http://localhost:${port + attempt}/noticeboard`);
        console.log(` Admin Panel: http://localhost:${port + attempt}/notices`);
        console.log(` Listings: http://localhost:${port + attempt}/listings`);
        
        if (attempt > 0) {
          console.log(` Note: Port ${port} was busy, using port ${port + attempt} instead`);
          console.log(` To use port ${port}, kill the process with:`);
          console.log(`   netstat -ano | findstr :${port}`);
          console.log(`   taskkill /PID [PID] /F`);
        }
      });
      return;
    }
  }
  
  console.error(`❌ Could not find an available port after ${maxAttempts} attempts`);
  process.exit(1);
}

startServer();

module.exports = app;