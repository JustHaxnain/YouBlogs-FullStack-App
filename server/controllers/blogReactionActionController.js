import {
    insertBlogReaction,
    deleteBlogReaction,
    updateBlogReaction,
} from "../db/models/blogReactionActionModel.js";
import { getUserByGoogleId } from "../db/models/usersModel.js";
import { getBlog } from "../db/models/blogModel.js";
import {
    getBlogReactionByUserGoogleId,
    getBlogReactionByUser,
    getBlogReactionCountsByBlogId,
} from "../db/models/blogReactionModel.js";

//// * Post Blog Reaction Handler

export async function handlePostBlogReaction(req, res) {
    try {
        const blogId = req.params.id;
        const userGoogleId = req.user.googleId;
        const { reaction } = req.body;
        // check if the user exist
        const currentUser = await getUserByGoogleId(userGoogleId);
        if (!currentUser) {
            return res
                .status(404)
                .send({ message: "You Must Authenticate First." });
        }
        // check if the blog exist
        const currentBlog = await getBlog(blogId);
        if (!currentBlog) {
            return res.status(404).send({ message: "The Blog Doesn't Exist." });
        }
        // check if the user has submitted a correct reaction option
        if (!["like", "dislike"].includes(reaction)) {
            return res.status(400).send({ message: "Invalid reaction" });
        }
        // check if the user already has a existing reaction
        const existingReaction = await getBlogReactionByUserGoogleId(
            blogId,
            userGoogleId
        );
        if (!existingReaction) {
            // if no previous reaction then add / insert the reaction
            const insertedReaction = await insertBlogReaction(
                blogId,
                userGoogleId,
                reaction
            );
        } else if (existingReaction.reaction === reaction) {
            // if the previous reaction is same as the current reaction then remove / delete it
            const deletedReaction = await deleteBlogReaction(
                blogId,
                userGoogleId
            );
        } else {
            // if the previous reaction exist but isn't the same as the current reaction then update it
            const updatedReaction = await updateBlogReaction(
                blogId,
                userGoogleId,
                reaction
            );
        }
        // get the updated reaction count
        const updateCounts = await getBlogReactionCountsByBlogId(blogId);
        // get the updated user reaction
        const updatedUserReaction = await getBlogReactionByUser(
            blogId,
            userGoogleId
        );
        res.status(201).send({
            message: `you ${reaction}d the post successfully`,
            likeCount: updateCounts.like || 0,
            dislikeCount: updateCounts.dislike || 0,
            updatedUserReaction: updatedUserReaction?.reaction
                ? updatedUserReaction?.reaction
                : "",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: error,
        });
    }
}
