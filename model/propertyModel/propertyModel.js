// Import
import mongoose from "mongoose";

// Create Property Schema
const propertySchema = new mongoose.Schema(
  {
    // General Information
    name: {
      type: String,
    },
    location: {
      type: String,
    },
    price: {
      type: String,
    },
    builderName: {
      type: String,
    },
    sizes: {
      type: String,
    },
    configurations: {
      type: String,
    },
    bhk: {
      type: String,
    },
    pricingDetails: {
      type: String,
    },
    towers: {
      type: String,
    },
    possession: {
      type: String,
    },
    reraId: {
      type: String,
    },
    totalProjectArea: {
      type: String,
    },
    floors: {
      type: String,
    },
    units: {
      type: String,
    },
    mapLocation: {
      type: String,
    },
    metaTitle: {
      type: String,
    },
    metaKeywords: {
      type: String,
    },
    metaDesc: {
      type: String,
    },
    metaSchema: {
      type: String,
    },
    slug: {
      type: String,
    },
    canonical: {
      type: String,
    },
    latitude: {
      type: String,
    },
    longitude: {
      type: String,
    },
    propertyType: {
      type: String,
    },
    status: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },

    // User reference
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // PDF
    pdf: {
      type: String,
    },

    // Amenities Images
    amenitiesImg: {
      type: [{ img: String, label: String }],
    },

    // Type BHK
    typebhk: {
      type: [
        {
          bhktype: String,
          size: String,
          price: String,
          metadescription: String,
          metatitle: String,
          metakeywords: String,
          typebhkslug: String,
        },
      ],
    },

    // Images
    images: {
      type: [String],
    },

    // Banner Images
    bannerimg: {
      type: [String],
    },

    // Builder Image
    builderImg: {
      type: [String],
    },

    // Highlight
    highlight: {
      type: [String],
    },

    // Site Map
    siteMap: {
      type: [String],
    },

    // Site Plan
    sitePlan: {
      type: [String],
    },

    // Location Advantages
    locationAdvantages: {
      type: [String],
    },

    // Youtube Videos
    youtubeid: {
      type: [String],
    },

    // FAQ
    faq: {
      type: [{ question: String, answer: String }],
    },

    // Description
    description: {
      type: String,
    },
    isComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Property
const Property = mongoose.model("Property", propertySchema);

// Export
export default Property;
