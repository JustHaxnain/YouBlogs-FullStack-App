import {
    getUserRefreshToken,
    updateUserRefreshToken,
} from "../db/models/tokenModel.js";
import {
    generateNewAccessToken,
    generateNewRefreshToken,
} from "../utils/generateToken.js";
import forceLogout from "../utils/forceLogout.js";
import jwt from "jsonwebtoken";

//// * Token Refresh Route Handler

export async function handleTokenRefreshRoute(req, res) {
    //// Refresh Token From Cookie
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
        return res.status(401).json({ message: "No Refresh token" });
    try {
        //// Verify Refresh Token
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
        if (!refreshTokenExist)
            return res
                .status(403)
                .json({ message: "RT doesn't match the DB RT" });
        //// If The RT Is In DB Generate The New RT And AT
        //// Generate New Refresh Token
        const newRefreshToken = generateNewRefreshToken(payLoad.googleId);
        //// New Access Token
        const newAccessToken = generateNewAccessToken(payLoad.googleId);
        //// Store The New RT in DB with The User The Previous RT Belonged To
        await updateUserRefreshToken(payLoad.googleId, newRefreshToken);
        //// Set Both RT + AT Tokens
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 2 * 24 * 60 * 60 * 1000,
            path: "/",
        })
            .cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 2 * 24 * 60 * 60 * 1000,
                path: "/authentication",
            })
            .status(200)
            .send({
                message: "Access Token refreshed",
            });
    } catch (error) {
        const googleId = jwt.decode(refreshToken)?.googleId;
        await forceLogout(res, googleId);
        if (error.name === "TokenExpiredError") {
            return res
                .status(401)
                .send({ message: "TokenExpired", forceLogout: true });
        }
        return res
            .status(401)
            .send({ message: "Invalid Token", forceLogout: true });
    }
}
