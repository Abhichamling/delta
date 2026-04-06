// Helper function at the top of your controller
const cleanArrayField = (field) => {
  if (!field) return [];
  if (Array.isArray(field)) {
    return field.filter(item => item && typeof item === 'string');
  }
  if (typeof field === 'string') {
    return [field];
  }
  if (typeof field === 'object') {
    return Object.values(field).filter(v => v && typeof v === 'string');
  }
  return [];
};

// THEN in your create listing function:
const amenitiesArray = cleanArrayField(req.body.amenities);
const experiencesArray = cleanArrayField(req.body.experiences);

const newListing = new Listing({
  // ... other fields
  amenities: amenitiesArray,
  experiences: experiencesArray
});