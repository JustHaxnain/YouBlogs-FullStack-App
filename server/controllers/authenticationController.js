import { google } from "googleapis";
import oAuth2Client from "../utils/googleConfig.js";
import { updateUserRefreshToken } from "../db/models/tokenModel.js";
import { addUser, getUserByEmail } from "../db/models/usersModel.js";
import {
    generateNewAccessToken,
    generateNewRefreshToken,
} from "../utils/generateToken.js";
import dotenv from "dotenv";
dotenv.config();

//// * Google Login Route Handler

export default async function googleLoginController(req, res) {
    try {
        //// Getting the Auth Code From The Front End
        const authCode = req.body.AuthCode;
        if (!authCode) {
            return res.status(400).json({ error: "Missing Auth Code" });
        }
        //// Exchanging The Auth Code For Access Token
        const { tokens } = await oAuth2Client.getToken(authCode);
        //// SET CREDENTIALS INTO THE CLIENT (enables SDK calls)
        oAuth2Client.setCredentials(tokens);
        //// Verifying The Id_Token
        const ticket = await oAuth2Client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        //// To Get Unique Google Id [ sub ]
        const payload = ticket.getPayload();
        const googleId = payload.sub;
        //// Getting Users Info
        const oAuth2 = google.oauth2({ auth: oAuth2Client, version: "v2" });
        const { data: profile } = await oAuth2.userinfo.get();
        //// Create The User Object
        let user = {
            googleId,
            email: profile.email,
            name: profile.name,
            picture: profile.picture,
        };
        //// UPSERT THE DATABSE
        //// CHECK IF THE USER ALREADY EXIST IN THE DATABSE
        const userExist = await getUserByEmail(user.email);
        //// Create Access Token
        const accessToken = generateNewAccessToken(user.googleId);
        //// Create Refresh Token
        const refreshToken = generateNewRefreshToken(user.googleId);
        //// IF USER DON"T EXIST ADD THEM IN DATABSE
        if (!userExist) {
            await addUser(
                user.googleId,
                user.email,
                user.name,
                user.picture,
                refreshToken
            );
        } else {
            await updateUserRefreshToken(user.googleId, refreshToken);
        }
        //// Send the Access Token Cookie
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 2 * 24 * 60 * 60 * 1000,
            path: "/",
        })
            //// Send the Refresh Token Cookie
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 2 * 24 * 60 * 60 * 1000,
                path: "/authentication",
            })
            .status(200)
            .send({
                message: "Login successful",
            });
    } catch (error) {
        res.status(500).send({
            message: "Internal server error",
        });
    }
}
