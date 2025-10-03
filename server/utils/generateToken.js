import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function generateNewAccessToken(payLoadGoogleId) {
    return jwt.sign(
        {
            googleId: payLoadGoogleId,
        },
        process.env.JWT_ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.JWT_ACCESS_TOKEN_TIMEOUT,
        }
    );
}

export function generateNewRefreshToken(payLoadGoogleId) {
    return jwt.sign(
        {
            googleId: payLoadGoogleId,
        },
        process.env.JWT_REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.JWT_REFRESH_TOKEN_TIMEOUT,
        }
    );
}
