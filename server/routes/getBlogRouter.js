import { Router } from "express";
import {
    handleGetAllBlogs,
    handleGetSpecificBlog,
} from "../controllers/getBlogController.js";
const router = Router();

//// * Get Specific Blog

router.get("/specificBlog/:id", handleGetSpecificBlog);

//// * Get All Blogs

router.get("/getAllBlogs", handleGetAllBlogs);

export default router;
