import { Router } from "express";
import authenticateUserAccessToken from "../middleware/authenticateUserAccessToken.js";
import { handleGetSpecificBlogDetail } from "../controllers/blogDetailController.js";

const router = Router();

//// * Get Reaction By Specific Blog

router.get(
    "/:id/userReaction",
    authenticateUserAccessToken,
    handleGetSpecificBlogDetail
);

export default router;
