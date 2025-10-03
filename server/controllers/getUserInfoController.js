import { getAuthorBlogs } from "../db/models/blogModel.js";
import { getUserByGoogleId } from "../db/models/usersModel.js";

//// * Get User Profile Handler

export async function handleGetUserProfile(req, res) {
    try {
        const user = await getUserByGoogleId(req.user.googleId);
        if (!user) return res.status(404).send({ message: "User not found" });
        res.send({
            message: "Authenticated !",
            user: user,
        });
    } catch (error) {
        res.status(500).send({ message: "Server Error" });
    }
}

//// * Get User Author Blogs handler

export async function handlerGetUserAuthorBlogs(req, res) {
    try {
        const authorGoogleId = req.user.googleId;
        const author = await getUserByGoogleId(req.user.googleId);
        if (!author)
            return res.status(404).send({ message: "Author not found" });
        const response = await getAuthorBlogs(authorGoogleId);
        res.status(201).send({
            response: response,
        });
    } catch (error) {
        res.status(500).send({ message: error });
    }
}
