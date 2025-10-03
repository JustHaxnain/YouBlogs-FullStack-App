import { Router } from "express";
import googleLoginController from "../controllers/authenticationController.js";
import { handleTokenRefreshRoute } from "../controllers/refreshAuthController.js";
import authenticateUserRefreshTokenLogout from "../middleware/authenticateUserRefreshTokenLogout.js";
import { logoutHandler } from "../controllers/logoutController.js";
const router = Router();

//// * Token Refresh Route

router.post("/refresh", handleTokenRefreshRoute);

//// * Log Out Route

router.post("/logout", authenticateUserRefreshTokenLogout, logoutHandler);

//// * Google Login Route

router.post("/google", googleLoginController);

export default router;
