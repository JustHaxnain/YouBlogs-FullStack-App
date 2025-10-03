import { updateUserRefreshToken } from "../db/models/tokenModel.js";

export async function logoutHandler(req, res) {
    try {
        //// Clear Cookies
        res.clearCookie("accessToken", {
            secure: false,
            sameSite: "lax",
            path: "/",
        });
        res.clearCookie("refreshToken", {
            secure: false,
            sameSite: "strict",
            path: "/authentication",
        });
        //// Clear From DB
        await updateUserRefreshToken(req.user.googleId, null);
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).send({
            message: error,
        });
    }
}
