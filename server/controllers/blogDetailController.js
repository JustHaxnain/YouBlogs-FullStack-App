import { getBlog } from "../db/models/blogModel.js";
import { getBlogReactionByUser } from "../db/models/blogReactionModel.js";

//// * Get Reaction By Specific Blog Handler

export async function handleGetSpecificBlogDetail(req, res) {
    try {
        const blogId = req.params.id;
        const userGoogleId = req.user.googleId;
        // check if the blog exist
        const currentBlog = await getBlog(blogId);
        if (!currentBlog) {
            return res.status(404).send({ message: "The Blog Doesn't Exist." });
        }
        // get the user reaction
        const userReaction = await getBlogReactionByUser(blogId, userGoogleId);
        res.status(200).send({
            userReaction: userReaction,
        });
    } catch (error) {
        res.status(500).send({
            message: error,
        });
    }
}
