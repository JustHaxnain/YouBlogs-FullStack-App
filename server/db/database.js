import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql
    .createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
    })
    .promise();

(async () => {
    try {
        await pool.query("SELECT 1");
        console.log("✅ MySQL DB is connected");
    } catch (error) {
        console.log("❌ Database connection failed:", error);
    }
})();

export default pool;
