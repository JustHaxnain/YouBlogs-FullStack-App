import pool from "../database.js";

//// * USERS QUERY

export async function getAllUsers() {
    const [rows] = await pool.query("SELECT * FROM users");
    return rows;
}

export async function getUserByEmail(email) {
    const [row] = await pool.query(`SELECT * FROM users WHERE email = ?`, [
        email,
    ]);
    if (row.length > 0) {
        return row[0];
    } else {
        return null;
    }
}

export async function getUserByGoogleId(googleId) {
    const [result] = await pool.query(
        `SELECT * FROM users WHERE googleId = ?`,
        [googleId]
    );
    if (result.length > 0) {
        return result[0];
    } else {
        return null;
    }
}

export async function addUser(
    googleId,
    email,
    username,
    userImage,
    refreshToken
) {
    const [result] = await pool.query(
        `
        INSERT INTO users(googleId,email,username,userImage,refreshToken)
        VALUE(?,?,?,?,?)
        `,
        [googleId, email, username, userImage, refreshToken]
    );
    const id = result.insertId;
    const [rows] = await pool.query(
        `
        SELECT * FROM users WHERE id = ?
        `,
        [id]
    );
    return rows[0];
}
