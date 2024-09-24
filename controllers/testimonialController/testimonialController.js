import fs from "fs"; // For file system operations
import path from "path";
import Testimonial from "../../model/testimonialModel/testimonialModel.js";

// Controller for creating a testimonial
export const createTestimonial = async (req, res) => {
  try {
    const { name, review, mapLink, rating } = req.body;
    const image = req.file ? req.file.filename : null;

    const newTestimonial = new Testimonial({
      name,
      review,
      mapLink,
      image,
      rating,
    });

    await newTestimonial.save();
    res
      .status(201)
      .json({ message: "Testimonial created successfully", newTestimonial });
  } catch (error) {
    res.status(500).json({ message: "Error creating testimonial", error });
  }
};

// Controller to get all testimonials
export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ message: "Error fetching testimonials", error });
  }
};

// Controller to delete a testimonial
export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    // Delete the image from the file system if it exists
    if (testimonial.image) {
      fs.unlink(`./public/uploads/${testimonial.image}`, (err) => {
        if (err) {
          console.error("Error deleting image:", err);
        }
      });
    }

    await testimonial.deleteOne();
    res.status(200).json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting testimonial", error });
  }
};

// Controller to update a testimonial
export const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, review, mapLink, rating } = req.body;
    const newImage = req.file ? req.file.filename : null; // Ensure you're using multer and handling single image uploads correctly

    // Find the testimonial by ID
    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    // Delete the old image if a new one is being uploaded
    if (newImage && testimonial.image) {
      const oldImagePath = path.join("./public/uploads/", testimonial.image); // Uses the path module correctly now
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update the testimonial with new data
    testimonial.name = name || testimonial.name;
    testimonial.review = review || testimonial.review;
    testimonial.mapLink = mapLink || testimonial.mapLink;
    testimonial.rating = rating || testimonial.rating;
    testimonial.image = newImage || testimonial.image;

    await testimonial.save();

    res
      .status(200)
      .json({ message: "Testimonial updated successfully", testimonial });
  } catch (error) {
    console.error("Error updating testimonial:", error); // Add more logging to troubleshoot errors
    res.status(500).json({ message: "Error updating testimonial", error });
  }
};
