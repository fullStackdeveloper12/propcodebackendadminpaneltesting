import mongoose from "mongoose";

// Create Testimonial Schema
const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  review: {
    type: String,
  },
  mapLink: {
    type: String,
  },
  image: {
    type: String,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
});

// Testimonial
const Testimonial = mongoose.model("Testimonial", testimonialSchema);

// Export
export default Testimonial;