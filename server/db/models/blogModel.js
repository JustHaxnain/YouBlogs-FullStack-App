import pool from "../database.js";

//// * BLOG QUERY

export async function getBlog(id) {
    const [row] = await pool.query(
        `
        SELECT 
        blogs.*,
        users.username,
        users.userImage,
        (SELECT COUNT(*) FROM blog_reactions 
        WHERE blog_reactions.blog_id = ?
        AND blog_reactions.reaction = 'like'
        ) AS likeCount,
        (SELECT COUNT(*) FROM blog_reactions 
        WHERE blog_reactions.blog_id = ?
        AND blog_reactions.reaction = 'dislike'
        ) AS dislikeCount
        FROM blogs
        LEFT JOIN users on blogs.author_googleId = users.googleId
        WHERE blogs.id = ?
        `,
        [id, id, id]
    );
    if (row.length > 0) {
        return row[0];
    } else {
        return null;
    }
}

export async function getAuthorBlogs(authorGoogleId) {
    const [result] = await pool.query(
        `
        SELECT blogs.* , users.username, users.userImage
        FROM blogs
        JOIN users ON blogs.author_googleId = users.googleId
        WHERE blogs.author_googleId = ?
        ORDER BY blogs.created_at DESC
        `,
        [authorGoogleId]
    );
    return result;
}

export async function getAllBlogs(limit, offset) {
    const [result] = await pool.query(
        `
        SELECT blogs.*, users.username , users.userImage 
        FROM blogs 
        JOIN users 
        ORDER BY created_at DESC
        LIMIT ?
        OFFSET ?
        `,
        [limit, offset]
    );
    return result;
}

export async function getAllBlogsCount() {
    const [total] = await pool.query(
        `
        SELECT COUNT(*) as total FROM blogs
        `
    );
    return total[0].total;
}

export async function getSearchBlogs(searchTerm, limit, offset) {
    const likeSearchTerm = `%${searchTerm}%`;
    const [result] = await pool.query(
        `
        SELECT blogs.*, users.username, users.userImage
        FROM blogs
        JOIN users
        WHERE blogs.title LIKE ? 
        OR blogs.content LIKE ?
        OR users.username LIKE ?
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
        `,
        [likeSearchTerm, likeSearchTerm, likeSearchTerm, limit, offset]
    );
    return result;
}

export async function searchBlogsCount(searchTerm) {
    const likeSearchTerm = `%${searchTerm}%`;
    const [result] = await pool.query(
        `
        SELECT COUNT(*) as total
        FROM blogs
        JOIN users
        WHERE blogs.title LIKE ? 
        OR blogs.content LIKE ?
        OR users.username LIKE ?
        `,
        [likeSearchTerm, likeSearchTerm, likeSearchTerm]
    );
    return result[0].total;
}
