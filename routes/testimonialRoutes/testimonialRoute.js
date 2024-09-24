import express from "express";
import multer from "multer";
import path from "path";
import {
  createTestimonial,
  deleteTestimonial,
  getTestimonials,
  updateTestimonial,
} from "../../controllers/testimonialController/testimonialController.js";

const testimonialRouter = express.Router();

// Multer configuration for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/"); // Folder where images will be stored
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

// Create Testimonial Route
testimonialRouter.post("/add", upload.single("image"), createTestimonial);

// Route to get all testimonials
testimonialRouter.get("/testimonials", getTestimonials);

// Route to delete a testimonial by id
testimonialRouter.delete("/delete/:id", deleteTestimonial);

// Update Testimonial Route
testimonialRouter.put("/update/:id", upload.single("image"), updateTestimonial);

// Export
export default testimonialRouter;
