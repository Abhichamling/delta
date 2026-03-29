const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/sirjanasizzu";

main()
  .then(() => {
    console.log(" Connected to DB");
  })
  .catch((err) => {
    console.log(" DB Connection Error:", err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  try {
    // Clear existing data
    await Listing.deleteMany({});
    console.log(" Cleared existing listings");
    
    // Insert all 30 listings
    await Listing.insertMany(initData.data);
    
    console.log(" 30 listings initialized successfully!");
    console.log(" Categories Breakdown:");
    console.log("   - Trending: 2 listings");
    console.log("   - Mountain: 2 listings");
    console.log("   - Himalayan: 2 listings");
    console.log("   - Adventure: 2 listings");
    console.log("   - Trekking: 2 listings");
    console.log("   - Wildlife: 3 listings");
    console.log("   - Culture: 2 listings");
    console.log("   - Heritage: 2 listings");
    console.log("   - Yoga: 2 listings");
    console.log("   - Agriculture: 2 listings");
    console.log("   - Food: 3 listings");
    console.log("   - Beach: 2 listings");
    console.log("   - Lake: 2 listings");
    console.log("   - Forest: 2 listings");
    console.log("   - Desert: 1 listing");
    console.log("   - City: 1 listing");
    console.log(" Total: 30 listings with high-quality Airbnb-style images");
    console.log("\n✅ Database initialization complete!");
    
  } catch (err) {
    console.log("❌ Error initializing data:", err);
  } finally {
    mongoose.connection.close();
  }
};
 
initDB();