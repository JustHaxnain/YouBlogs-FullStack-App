import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default function authenticateUserAccessToken(req, res, next) {
    //// Access Token From Cookie
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).send({ message: "No Access token" });
    try {
        const payLoad = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
        req.user = payLoad;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).send({ message: "TokenExpired" });
        }
        return res.status(401).send({ message: "Invalid token" });
    }
}
