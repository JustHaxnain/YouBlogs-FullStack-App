import pool from "../database.js";

//// * AUTHENTICATION TOKENS QUERY

export async function updateUserRefreshToken(userGoogleId, refreshToken) {
    const [result] = await pool.query(
        `
        UPDATE users SET refreshToken = ?
        WHERE googleId = ?  
        `,
        [refreshToken, userGoogleId]
    );
    return result.affectedRows > 0;
}

export async function getUserRefreshToken(userGoogleId, refreshToken) {
    const [row] = await pool.query(
        `
        SELECT * FROM users 
        WHERE googleId = ? 
        AND refreshToken = ?
        `,
        [userGoogleId, refreshToken]
    );
    if (row.length > 0) {
        return row[0];
    } else {
        return null;
    }
}
