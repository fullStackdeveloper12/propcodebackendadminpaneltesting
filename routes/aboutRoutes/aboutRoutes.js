import express from "express";
import multer from "multer";
import path from "path";
import {
  createAbout,
  deleteAbout,
  getAboutById,
  getAboutBySlug,
  getAllAbout,
  updateAbout,
} from "../../controllers/aboutController/aboutController.js";

const aboutRouter = express.Router();

// Configure multer for file uploads
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

// Create About Route
aboutRouter.post("/add", upload.single("image"), createAbout);

// Get All About
aboutRouter.get("/abouts", getAllAbout);

// Get About by Id
aboutRouter.get("/about/:id", getAboutById);

// Get About by Slug
aboutRouter.get("/about/slugs/:slug", getAboutBySlug);

// Delete About
aboutRouter.delete("/delete/:id", deleteAbout);

// Update About
aboutRouter.patch("/update/:id", upload.single("image"), updateAbout);

export default aboutRouter;
