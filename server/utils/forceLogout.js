import { updateUserRefreshToken } from "../db/models/tokenModel.js";

export default async function forceLogout(res, googleId = null) {
    // Clear cookies
    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/authentication" });
    // If googleId was extracted earlier, reset refreshToken in DB
    if (googleId) {
        await updateUserRefreshToken(googleId, null);
    }
}
