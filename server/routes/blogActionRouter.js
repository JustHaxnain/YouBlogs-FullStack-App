import { Router } from "express";
import authenticateUserAccessToken from "../middleware/authenticateUserAccessToken.js";
import {
    handleUploadBlog,
    handleEditBlog,
    handleDeleteBlog,
} from "../controllers/blogActionController.js";
import { handlePostBlogReaction } from "../controllers/blogReactionActionController.js";
const router = Router();

//// * Upload Blog Route

router.post("/uploadBlog", authenticateUserAccessToken, handleUploadBlog);

//// * Delete Blog Route

router.delete("/deleteBlog/:id", authenticateUserAccessToken, handleDeleteBlog);

//// * Edit Blog Route

router.put("/editBlog/:id", authenticateUserAccessToken, handleEditBlog);

//// * Post Blog Reaction Route

router.post(
    "/:id/reactions",
    authenticateUserAccessToken,
    handlePostBlogReaction
);

export default router;
