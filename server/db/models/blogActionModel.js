import pool from "../database.js";

//// * BLOG ACTION QUERY

export async function uploadBlog(title, content, thumbnail, authorGoogleId) {
    const [result] = await pool.query(
        `
        INSERT INTO blogs(title,content,thumbnail,author_googleId)
        VALUES(?,?,?,?)
        `,
        [title, content, thumbnail, authorGoogleId]
    );
    const id = result.insertId;
    const [rows] = await pool.query(
        `
        SELECT * FROM blogs WHERE id = ?
        `,
        [id]
    );
    return rows[0];
}

export async function deleteBlog(id, currentUserGoogleId) {
    const [result] = await pool.query(
        `
        DELETE FROM blogs
        WHERE id = ?
        AND author_googleId = ?
        `,
        [id, currentUserGoogleId]
    );
    return result;
}

export async function updateBlog(
    id,
    currentUserGoogleId,
    { title, content, thumbnail }
) {
    const [result] = await pool.query(
        `
        UPDATE blogs 
        SET title = ?,
        content = ?,
        thumbnail = ?
        WHERE id = ?
        AND author_googleId = ?
        `,
        [title, content, thumbnail, id, currentUserGoogleId]
    );
    return result;
}
