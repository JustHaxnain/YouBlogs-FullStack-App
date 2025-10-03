import {
    updateBlog,
    deleteBlog,
    uploadBlog,
} from "../db/models/blogActionModel.js";
import { getUserByGoogleId } from "../db/models/usersModel.js";
import { getBlog } from "../db/models/blogModel.js";

//// * Upload Blog Handler

export async function handleUploadBlog(req, res) {
    try {
        const authorGoogleId = req.user.googleId;
        const author = await getUserByGoogleId(req.user.googleId);
        if (!author)
            return res.status(404).send({ message: "Author not found" });
        const { title, content, thumbnail } = req.body;
        const response = await uploadBlog(
            title,
            content,
            thumbnail,
            authorGoogleId
        );
        if (!response)
            return res
                .status(500)
                .send({ message: `${response} Failed to uplaod blog` });
        res.status(201).send({
            message: "Blog Published !",
            response: response,
        });
    } catch (error) {
        res.status(500).send({ message: error });
    }
}

//// * Delete Blog Handler

export async function handleDeleteBlog(req, res) {
    try {
        const blogId = req.params.id;
        const currentUserGoogleId = req.user.googleId;
        // check if the user exist
        const currentUser = await getUserByGoogleId(currentUserGoogleId);
        if (!currentUser) {
            return res
                .status(404)
                .send({ message: "You Must Authenticate First." });
        }
        // fetch the blog
        const currentBlog = await getBlog(blogId);
        if (!currentBlog) {
            return res.status(404).send({ message: "Blog Not Found." });
        }
        // ownership check
        if (currentUser.googleId !== currentBlog.author_googleId) {
            return res.status(403).json({
                message: "Not Authorized To Delete This.",
            });
        } else if (currentUser.googleId === currentBlog.author_googleId) {
            const response = await deleteBlog(blogId, currentUser.googleId);
            // check if response is okay
            if (response.affectedRows === 0) {
                return res
                    .status(403)
                    .json({ message: "Not Authorized or Blog Not Found" });
            }
            res.status(200).send({
                message: "Deleted successfully",
            });
        }
    } catch (error) {
        res.status(500).send({
            message: error,
        });
    }
}

//// * Edit Blog Handler

export async function handleEditBlog(req, res) {
    try {
        const blogId = req.params.id;
        const { title, content, thumbnail } = req.body;
        // check if the user exist
        const currentUserGoogleId = req.user.googleId;
        const currentUser = await getUserByGoogleId(currentUserGoogleId);
        if (!currentUser) {
            return res
                .status(404)
                .send({ message: "You Must Authenticate First." });
        }
        // fetch the blog
        const currentBlog = await getBlog(blogId);
        if (!currentBlog) {
            return res.status(404).send({ message: "Blog Not Found." });
        }
        // ownership check
        if (currentUser.googleId !== currentBlog.author_googleId) {
            return res.status(403).json({
                message: "Not Authorized To Edit This.",
            });
        } else if (currentUser.googleId === currentBlog.author_googleId) {
            const response = await updateBlog(blogId, currentUserGoogleId, {
                title,
                content,
                thumbnail,
            });
            // check if response is okay
            if (response.affectedRows === 0) {
                return res
                    .status(403)
                    .json({ message: "Not Authorized or Blog Not Found" });
            }
            res.status(200).send({
                message: "Blog Updated Successfully",
            });
        }
    } catch (error) {
        res.status(500).send({
            message: error,
        });
    }
}
