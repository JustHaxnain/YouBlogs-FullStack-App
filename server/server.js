import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authenticationRouter from "./routes/authenticationRouter.js";
import userPageRouter from "./routes/userPageRouter.js";
import getBlogRouter from "./routes/getBlogRouter.js";
import getBlogDetails from "./routes/getBlogDetails.js";
import blogActionRouter from "./routes/blogActionRouter.js";

import "./db/database.js";

const app = express();
dotenv.config();
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 8080;

app.use("/authentication", authenticationRouter);
app.use("/user", userPageRouter);
app.use("/getBlog", getBlogRouter);
app.use("/getBlogDetails", getBlogDetails);
app.use("/blogAction", blogActionRouter);

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
