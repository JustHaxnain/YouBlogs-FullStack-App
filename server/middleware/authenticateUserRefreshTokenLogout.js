import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { getUserRefreshToken } from "../db/models/tokenModel.js";
import forceLogout from "../utils/forceLogout.js";
dotenv.config();

export default async function authenticateUserRefreshTokenLogout(
    req,
    res,
    next
) {
    //// Check For Refresh Token
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
        return res.status(401).json({ message: "No refresh token" });
    try {
        //// Verify The Refresh Token
        const payLoad = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_TOKEN_SECRET
        );
        //// Check Refresh Token In DB
        const refreshTokenExist = await getUserRefreshToken(
            payLoad.googleId,
            refreshToken
        );
        //// If The RT Is Not In DB
        if (!refreshTokenExist) {
            return res
                .status(403)
                .json({ message: "RT doesn't match the DB RT" });
        }
        //// Attach User Google Id To Req For The LogOut Route
        req.user = payLoad;
        next();
    } catch (error) {
        const googleId = jwt.decode(refreshToken)?.googleId;
        await forceLogout(res, googleId);
        if (error.name === "TokenExpiredError") {
            return res
                .status(401)
                .json({ message: "Refresh token expired", forceLogout: true });
        }
        return res
            .status(401)
            .json({ message: "Invalid token", forceLogout: true });
    }
}
