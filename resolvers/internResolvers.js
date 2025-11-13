import pool from "../utils/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const internResolvers = {
    Query: {
        getInterns: async () => {
            const [rows] = await pool.query(
                `SELECT id, first_name, last_name, email, phone_number, provider, avatar_url, status, application_id, created_at 
         FROM interns`
            );
            return rows;
        },
    },

    Mutation: {
        createIntern: async (_, { input }) => {
            const { first_name, last_name, phone_number, email, password, provider_id, provider, avatar_url, application_id } = input;

            // 检查 email 是否存在
            const [existing] = await pool.query("SELECT id FROM interns WHERE email = ?", [email]);
            if (existing.length > 0) throw new Error("Intern already exists");

            // 密码加密
            const hashedPassword = await bcrypt.hash(password, 10);

            // 插入数据库
            const [result] = await pool.query(
                `INSERT INTO interns 
         (first_name, last_name, phone_number, email, password, provider_id, provider, avatar_url, status, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, "guest", NOW(), NOW())`,
                [first_name, last_name, phone_number, email, hashedPassword, provider_id, provider, avatar_url, application_id]
            );

            // 返回新创建的 Intern
            const [rows] = await pool.query("SELECT id, first_name, last_name, email, phone_number, provider, avatar_url, status, application_id, created_at FROM interns WHERE id = ?", [result.insertId]);
            return rows[0];
        },

        loginIntern: async (_, { email, password, remember }) => {
            const [rows] = await pool.query("SELECT * FROM interns WHERE email = ?", [email]);
            if (rows.length === 0) throw new Error("Intern not found");

            const intern = rows[0];

            const valid = await bcrypt.compare(password, intern.password);
            if (!valid) throw new Error("Invalid password");

            const token = jwt.sign({ internId: intern.id, email: intern.email }, JWT_SECRET, { expiresIn: remember ? "7d" : "1h" });

            return token;
        },
    },
};
