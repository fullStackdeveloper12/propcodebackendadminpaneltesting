// Import
import express from "express";

import multer from "multer";
import path from "path";
import {
  createProperty,
  deleteProperty,
  getProperty,
  getPropertyById,
  getPropertyBySlug,
  REMOVEIMAGE,
  updateProperty,
} from "../../controllers/propertyController/propertyController.js";

const propertyRouter = express.Router();

// Multer Configuration For File Storage
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

const imageFields = [
  { name: "amenitiesImg", maxCount: 20 },
  { name: "images", maxCount: 20 },
  { name: "bannerimg", maxCount: 20 },
  { name: "builderImg", maxCount: 20 },
  { name: "siteMap", maxCount: 20 },
  { name: "sitePlan", maxCount: 20 },
  { name: "pdf", maxCount: 2 },
];

// Create Property Route
propertyRouter.post("/addproperty", upload.fields(imageFields), createProperty);

// Get Property Route
propertyRouter.get("/getproperties", getProperty);

// Get Property By Slug
propertyRouter.get("/property/:slug", getPropertyBySlug);

// Get Property By Id
propertyRouter.get("/getproperty/:id", getPropertyById);

// Delete Property
propertyRouter.delete("/deleteproperty/:id", deleteProperty);

// Update Property
propertyRouter.patch(
  "/updateproperty/:id",
  upload.fields(imageFields),
  updateProperty
);

propertyRouter.delete(
  "/property/:propertyId/image/:fieldName/:imageId",
  REMOVEIMAGE
);

// Export
export default propertyRouter;
