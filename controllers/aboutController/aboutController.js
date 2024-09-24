// Import
import About from "../../model/aboutModel/aboutModel.js";
import fs from "fs"; // For file system operations
import path from "path";

// Create About Controller
const createAbout = async (req, res) => {
  try {
    const {
      name,
      slug,
      designation,
      description,
      facebookUrl,
      instagramUrl,
      linkedinUrl,
      twitterUrl,
    } = req.body;

    const image = req.file ? req.file.filename : null;

    const newAbout = new About({
      name,
      slug,
      designation,
      description,
      facebookUrl,
      instagramUrl,
      linkedinUrl,
      twitterUrl,
      image,
    });

    await newAbout.save();

    res
      .status(201)
      .json({ message: "About Added Successfully", data: newAbout });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to Add About", err: error.message });
  }
};

// Controller to get all about entries
const getAllAbout = async (req, res) => {
  try {
    const about = await About.find();
    res.status(200).json(about);
  } catch (error) {
    res.status(500).json({ message: "Error fetching About", error });
  }
};

const getAboutById = async (req, res) => {
  try {
    const about = await About.findById(req.params.id);
    if (about) {
      res.status(200).json(about);
    } else {
      res.status(404).json({ message: "About not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAboutBySlug = async (req, res) => {
  try {
    const about = await About.findOne({ slug: req.params.slug });
    if (about) {
      res.status(200).json(about);
    } else {
      res.status(404).json({ message: "About not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAbout = async (req, res) => {
  try {
    const about = await About.findById(req.params.id);

    if (!about) {
      return res.status(404).json({ message: "About not found" });
    }

    // Delete the image from the file system if it exists
    if (about.image) {
      fs.unlink(path.join("public/uploads", about.image), (err) => {
        if (err) {
          console.error("Error deleting image:", err);
        }
      });
    }

    await about.deleteOne();
    res.status(200).json({ message: "About deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting About", error });
  }
};

const updateAbout = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      slug,
      designation,
      description,
      facebookUrl,
      instagramUrl,
      linkedinUrl,
      twitterUrl,
    } = req.body;

    const newImage = req.file ? req.file.filename : null;

    const about = await About.findById(id);
    if (!about) {
      return res.status(404).json({ message: "About not found" });
    }

    if (newImage && about.image) {
      const oldImagePath = path.resolve("public/uploads", about.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    about.name = name || about.name;
    about.slug = slug || about.slug;
    about.designation = designation || about.designation;
    about.description = description || about.description;
    about.facebookUrl = facebookUrl || about.facebookUrl;
    about.instagramUrl = instagramUrl || about.instagramUrl;
    about.linkedinUrl = linkedinUrl || about.linkedinUrl;
    about.twitterUrl = twitterUrl || about.twitterUrl;
    about.image = newImage || about.image;

    await about.save();

    res.status(200).json({ message: "About updated successfully", about });
  } catch (error) {
    res.status(500).json({ message: "Error updating about", error });
  }
};

// Export
export {
  createAbout,
  getAllAbout,
  getAboutById,
  getAboutBySlug,
  deleteAbout,
  updateAbout,
};
