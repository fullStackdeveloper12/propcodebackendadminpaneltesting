// Import
import mongoose from "mongoose";

// Create Blog Schema
const blogSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  slug: {
    type: String,
  },
  projecttitle: {
    type: String,
  },
  projecttitledesc: {
    type: String,
  },
  date: {
    type: String,
  },
  readingTime: {
    type: String,
  },
  headingOne: {
    type: String,
  },
  headingOnedesc: {
    type: String,
  },
  summary: {
    type: String,
  },
  blogimg: {
    type: String,
  },
  singleblogimg: {
    type: String,
  },
  metatitle: {
    type: String,
  },
  metadescription: {
    type: String,
  },
  metakeywords: {
    type: String,
  },
  canonical: {
    type: String,
  },
  metaschema: {
    type: String,
  },
  isComplete: {
    type: Boolean,
    default: false,
  },
});

// Blog
const Blog = mongoose.model("Blog", blogSchema);

// Export
export default Blog;
