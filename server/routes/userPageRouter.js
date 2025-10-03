import { Router } from "express";
import authenticateUserAccessToken from "../middleware/authenticateUserAccessToken.js";
import {
    handleGetUserProfile,
    handlerGetUserAuthorBlogs,
} from "../controllers/getUserInfoController.js";

const router = Router();

//// * Get User Profile

router.get("/profile", authenticateUserAccessToken, handleGetUserProfile);

//// * Get User Author Blogs

router.get(
    "/getAuthorBlogs",
    authenticateUserAccessToken,
    handlerGetUserAuthorBlogs
);

export default router;
