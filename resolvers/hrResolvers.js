import pool from "../utils/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const hrResolvers = {
    Query: {},

    Mutation: {
        createHr: async (_, { input }) => {
            const { first_name, last_name, phone_number, email, password, provider_id, provider, avatar_url, application_id } = input;

            // 检查 email 是否存在
            const [existing] = await pool.query("SELECT id FROM interns WHERE email = ?", [email]);
            if (existing.length > 0) throw new Error("Hr already exists");

            // 密码加密
            const hashedPassword = await bcrypt.hash(password, 10);

            // 插入数据库
            const [result] = await pool.query(
                `INSERT INTO hr_accounts 
         (first_name, last_name, phone_number, email, password, provider_id, provider, avatar_url, status, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, NOW(), NOW())`,
                [first_name, last_name, phone_number, email, hashedPassword, provider_id, provider, avatar_url]
            );

            // 返回新创建的 hr
            const [rows] = await pool.query("SELECT id, first_name, last_name, email, phone_number, provider, avatar_url, status, created_at FROM hr_accounts WHERE id = ?", [result.insertId]);
            return rows[0];
        },

        loginHr: async (_, { email, password, remember }) => {
            const [rows] = await pool.query("SELECT * FROM hr_accounts WHERE email = ?", [email]);
            if (rows.length === 0) throw new Error("Intern not found");

            const hr = rows[0];

            const valid = await bcrypt.compare(password, hr.password);
            if (!valid) throw new Error("Invalid password");

            const token = jwt.sign({ hrId: hr.id, email: hr.email }, JWT_SECRET, { expiresIn: remember ? "7d" : "1h" });

            return token;
        },
    },
};
