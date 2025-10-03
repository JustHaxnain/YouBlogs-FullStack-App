import pool from "../database.js";

//// * BLOG REACTION DETAILS QUERY

//// Get User Reaction By User Google Id And Blog Id
export async function getBlogReactionByUserGoogleId(blogId, userGoogleId) {
    const [row] = await pool.query(
        `
        SELECT blog_reactions.reaction FROM blog_reactions
        WHERE blog_id = ?
        AND user_googleId = ?
        `,
        [blogId, userGoogleId]
    );
    if (row[0]) {
        return row[0];
    } else {
        return null;
    }
}

//// GET REACTION COUNT BY BLOG ID
export async function getBlogReactionCountsByBlogId(blogId) {
    const [rows] = await pool.query(
        `
        SELECT reaction,
        COUNT(*) as cnt FROM blog_reactions
        WHERE blog_id = ?
        GROUP BY reaction
        `,
        [blogId]
    );
    const counts = { like: 0, dislike: 0 };
    rows.forEach((r) => [(counts[r.reaction] = r.cnt)]);
    return counts;
}

//// GET USER REACTION BY GOOGLE_ID and BLOG_ID
export async function getBlogReactionByUser(blogId, userGoogleId) {
    const [rows] = await pool.query(
        `
        SELECT * FROM blog_reactions 
        WHERE blog_id = ?
        AND user_googleId = ?
        `,
        [blogId, userGoogleId]
    );
    return rows[0] || null;
}
