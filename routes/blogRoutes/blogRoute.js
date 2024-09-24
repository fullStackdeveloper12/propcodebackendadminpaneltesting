import express from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  updateBlog,
  upload,
} from "../../controllers/blogController/blogController.js";

const blogRouter = express.Router();

blogRouter.post(
  "/create",
  upload.fields([{ name: "blogimg" }, { name: "singleblogimg" }]),
  createBlog
);

blogRouter.get("/blogs", getAllBlogs);

blogRouter.get("/blog/:id", getBlogById);

blogRouter.get("/slug/:slug", getBlogBySlug);

blogRouter.patch(
  "/update/:id",
  upload.fields([{ name: "blogimg" }, { name: "singleblogimg" }]),
  updateBlog
);

blogRouter.delete("/delete/:id", deleteBlog);

export default blogRouter;
