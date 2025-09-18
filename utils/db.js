import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from 'path';
import fs from 'fs'

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true
});

// migration
async function runMigrations() {
    const conn = await pool.getConnection();
    try {
        // 1️⃣ 创建 migrations 表（记录已执行）
        await conn.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        run_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        // 2️⃣ 获取 migrations 文件夹所有 SQL 文件
        const migrationsDir = path.resolve("migrations");
        if (!fs.existsSync(migrationsDir)) {
            console.log("⚠️ migrations 文件夹不存在，跳过迁移");
            return;
        }

        const files = fs
            .readdirSync(migrationsDir)
            .filter((f) => f.endsWith(".sql"))
            .sort(); // 排序保证顺序执行 001,002,003...

        for (const file of files) {
            // 3️⃣ 检查文件是否已执行过
            const [rows] = await conn.query(
                "SELECT * FROM migrations WHERE name = ?",
                [file]
            );
            if (rows.length > 0) {
                console.log(`⏩ Skipping ${file} (already run)`);
                continue;
            }

            // 4️⃣ 读取 SQL 文件并执行
            const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
            console.log(`🚀 Running migration: ${file}`);
            await conn.query(sql);

            // 5️⃣ 记录已执行
            await conn.query("INSERT INTO migrations (name) VALUES (?)", [file]);
        }

        console.log("✅ All migrations executed!");
    } catch (err) {
        console.error("❌ Migration failed:", err.message);
    } finally {
        conn.release();
    }
}

// connect database and run migration
(async () => {
    try {
        const conn = await pool.getConnection();
        console.log("✅ MySQL connected!");
        conn.release();

        await runMigrations(); // 自动迁移
    } catch (err) {
        console.error("❌ DB Connection Error:", err.message);
    }
})();

export default pool;
