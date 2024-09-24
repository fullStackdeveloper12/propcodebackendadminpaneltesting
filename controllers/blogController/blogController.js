import Blog from "../../model/blogModel/blogModel.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// Multer configuration for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Helper function to create slug from project title
// const generateSlug = (title) => {
//   return title.toLowerCase().split(" ").join("-");
// };

// Create Blog Controller
const createBlog = async (req, res) => {
  // console.log(req.files);
  // console.log(req.body);
  const {
    name,
    slug,
    projecttitle,
    projecttitledesc,
    date,
    readingTime,
    headingOne,
    headingOnedesc,
    summary,
    metatitle,
    metadescription,
    metakeywords,
    canonical,
    metaschema,
    isComplete,
  } = req.body;

  // const slug = generateSlug(projecttitle);

  const blogimg = req.files["blogimg"]
    ? req.files["blogimg"][0].filename
    : null;
  const singleblogimg = req.files["singleblogimg"]
    ? req.files["singleblogimg"][0].filename
    : null;

  // if (!blogimg || !singleblogimg) {
  //   return res.status(400).json({ message: "Image upload failed" });
  // }

  // console.log(Image : ${blogimg}, ${singleblogimg});

  try {
    const newBlog = new Blog({
      name,
      slug,
      projecttitle,
      projecttitledesc,
      date,
      readingTime,
      headingOne,
      headingOnedesc,
      summary,
      metatitle,
      metadescription,
      metakeywords,
      canonical,
      metaschema,
      isComplete,
      blogimg,
      singleblogimg,
    });

    await newBlog.save();
    res.status(201).json({ message: "Blog Added Successfully", data: newBlog });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to Add Blog", error: error.message });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Blog by ID Controller
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      res.status(200).json(blog);
    } else {
      res.status(404).json({ message: "Blog not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Blog by Slug Controller
const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (blog) {
      res.status(200).json(blog);
    } else {
      res.status(404).json({ message: "Blog not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Blog by ID Controller
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Update fields
    const fieldsToUpdate = [
      "name",
      "slug",
      "projecttitle",
      "projecttitledesc",
      "date",
      "readingTime",
      "headingOne",
      "headingOnedesc",
      "summary",
      "metatitle",
      "metadescription",
      "metakeywords",
      "canonical",
      "metaschema",
      "isComplete",
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        blog[field] = req.body[field];
      }
    });

    // Handle file uploads
    if (req.files) {
      if (req.files["blogimg"]) {
        if (blog.blogimg) {
          const oldPath = path.join("./public/uploads/", blog.blogimg);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        blog.blogimg = req.files["blogimg"][0].filename;
      }
      if (req.files["singleblogimg"]) {
        if (blog.singleblogimg) {
          const oldPath = path.join("./public/uploads/", blog.singleblogimg);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        blog.singleblogimg = req.files["singleblogimg"][0].filename;
      }
    }

    const updatedBlog = await blog.save();
    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Blog by ID Controller
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Delete associated images
    if (blog.blogimg) {
      const blogImgPath = path.join("./public/uploads/", blog.blogimg);
      if (fs.existsSync(blogImgPath)) {
        fs.unlinkSync(blogImgPath);
      }
    }

    if (blog.singleblogimg) {
      const singleBlogImgPath = path.join(
        "./public/uploads/",
        blog.singleblogimg
      );
      if (fs.existsSync(singleBlogImgPath)) {
        fs.unlinkSync(singleBlogImgPath);
      }
    }

    await blog.deleteOne();
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export
export {
  createBlog,
  upload,
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
};
