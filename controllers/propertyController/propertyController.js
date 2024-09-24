// Import
import Property from "../../model/propertyModel/propertyModel.js";
import path from "path";
import fs from "fs";

const deleteImageFromDisk = (filename) => {
  const imgPath = path.join(process.cwd(), "public", "uploads", filename);
  if (fs.existsSync(imgPath)) {
    fs.unlinkSync(imgPath);
  }
};

const processImageFields = (files, body) => {
  const processedData = {};

  if (files && files.amenitiesImg) {
    processedData.amenitiesImg = files.amenitiesImg.map((file, index) => ({
      img: file.filename,
      label: body.amenitiesImgLabel ? body.amenitiesImgLabel[index] : "",
    }));
  }

  ["images", "bannerimg", "builderImg", "siteMap", "sitePlan"].forEach(
    (field) => {
      if (files && files[field]) {
        processedData[field] = files[field].map((file) => file.filename);
      }
    }
  );

  return processedData;
};

// Create Property Controller
const createProperty = async (req, res) => {
  try {
    // Parse the typebhk and faq fields if they are JSON strings
    if (typeof req.body.typebhk === "string") {
      req.body.typebhk = JSON.parse(req.body.typebhk);
    }

    if (typeof req.body.faq === "string") {
      req.body.faq = JSON.parse(req.body.faq);
    }

    const imageData = processImageFields(req.files, req.body);
    const newProperty = new Property({ ...req.body, ...imageData });
    await newProperty.save();
    res
      .status(201)
      .json({ message: "Property added successfully!", property: newProperty });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to Add Property", error: err.message });
  }
};

// Get Property
const getProperty = async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).json(properties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Property By Slug
const getPropertyBySlug = async (req, res) => {
  try {
    const property = await Property.findOne({ slug: req.params.slug });
    if (!property) {
      return res.status(404).json({ message: "Property not found!" });
    }
    res.status(200).json(property);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found!" });
    }

    // Delete all associated images
    [
      "amenitiesImg",
      "images",
      "bannerimg",
      "builderImg",
      "siteMap",
      "sitePlan",
      "pdf",
    ].forEach((field) => {
      if (Array.isArray(property[field])) {
        property[field].forEach((item) => {
          const filename = typeof item === "string" ? item : item.img;
          deleteImageFromDisk(filename);
        });
      }
    });

    await Property.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Property deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found!" });
    }

    const imageData = processImageFields(req.files, req.body);
    const updatedData = { ...req.body, ...imageData };

    // Delete old images if new ones are uploaded
    [
      "amenitiesImg",
      "images",
      "bannerimg",
      "builderImg",
      "siteMap",
      "sitePlan",
    ].forEach((field) => {
      if (imageData[field]) {
        if (Array.isArray(property[field])) {
          property[field].forEach((item) => {
            const filename = typeof item === "string" ? item : item.img;
            deleteImageFromDisk(filename);
          });
        }
      }
    });

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    res.status(200).json({
      message: "Property updated successfully!",
      property: updatedProperty,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const REMOVEIMAGE = async (req, res) => {
  try {
    const { propertyId, fieldName, imageId } = req.params;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found!" });
    }

    if (!Array.isArray(property[fieldName])) {
      return res.status(400).json({ message: "Invalid field name!" });
    }

    const imageIndex = property[fieldName].findIndex(
      (img) =>
        (typeof img === "string" && img === imageId) ||
        (img._id && img._id.toString() === imageId)
    );

    if (imageIndex === -1) {
      return res.status(404).json({ message: "Image not found!" });
    }

    const imageToRemove = property[fieldName][imageIndex];
    const filename =
      typeof imageToRemove === "string" ? imageToRemove : imageToRemove.img;
    deleteImageFromDisk(filename);

    property[fieldName].splice(imageIndex, 1);
    await property.save();

    res.status(200).json({ message: "Image removed successfully!", property });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPropertyById = async (req, res) => {
  try {
    const about = await Property.findById(req.params.id);
    if (about) {
      res.status(200).json(about);
    } else {
      res.status(404).json({ message: "Jodit not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export
export {
  createProperty,
  getProperty,
  getPropertyBySlug,
  deleteProperty,
  updateProperty,
  REMOVEIMAGE,
  getPropertyById,
};
