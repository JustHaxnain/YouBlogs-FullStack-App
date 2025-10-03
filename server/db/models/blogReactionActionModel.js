import pool from "../database.js";

//// * BLOG REACTION ACTION QUERY

//// ADD A BLOG REACTION
export async function insertBlogReaction(blogId, userGoogleId, reaction) {
    const [result] = await pool.query(
        `INSERT INTO blog_reactions (blog_id, user_googleId, reaction) VALUE (?, ?, ?)`,
        [blogId, userGoogleId, reaction]
    );
    return result.insertId;
}

//// DELETE A BLOG REACTION
export async function updateBlogReaction(blogId, userGoogleId, reaction) {
    const [result] = await pool.query(
        `
        UPDATE blog_reactions
        SET reaction = ?,
        updated_at = CURRENT_TIMESTAMP
        WHERE blog_id = ?
        AND user_googleId = ?
        `,
        [reaction, blogId, userGoogleId]
    );
    return result.affectedRows > 0;
}

//// UPDATE A BLOG REACTION
export async function deleteBlogReaction(blogId, userGoogleId) {
    const [result] = await pool.query(
        `
        DELETE FROM blog_reactions 
        WHERE blog_id = ?
        AND user_googleId = ?
        `,
        [blogId, userGoogleId]
    );
    return result.affectedRows > 0;
}
