import mongoose from "mongoose";

// Create About Schema
const aboutSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  slug: {
    type: String,
  },
  designation: {
    type: String,
  },
  image: {
    type: String,
  },
  description: {
    type: String,
  },
  facebookUrl: {
    type: String,
  },
  instagramUrl: {
    type: String,
  },
  linkedinUrl: {
    type: String,
  },
  twitterUrl: {
    type: String,
  },
});

// About
const About = mongoose.model("About", aboutSchema);

// Export
export default About;
