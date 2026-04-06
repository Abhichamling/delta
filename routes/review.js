const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing");
const Review = require("../models/review");
const { isLoggedIn, isReviewAuthor } = require("../middleware");

// Create Review
router.post("/", isLoggedIn, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    
    req.flash("success", "Review added!");
    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    console.log(err);
    req.flash("error", "Failed to add review");
    res.redirect(`/listings/${req.params.id}`);
  }
});

// Delete Review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    
    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.log(err);
    req.flash("error", "Failed to delete review");
    res.redirect(`/listings/${req.params.id}`);
  }
});

module.exports = router;