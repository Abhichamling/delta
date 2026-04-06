const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;

  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "New review added!");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted!");
  res.redirect(`/listings/${id}`);
};
// controllers/reviewController.js
const deleteReview = async (req, res) => {
  try {
    // Your deletion logic here
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  deleteReview,
  // other functions...
};