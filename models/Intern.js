import pool from "../utils/db.js";
import bcrypt from "bcryptjs";

export async function createIntern(data) {
    const {
        first_name,
        last_name,
        phone_number,
        email,
        password,
        provider_id,
        provider,
        avatar_url,
        application_id
    } = data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
        `INSERT INTO interns 
    (first_name, last_name, phone_number, email, password, provider_id, provider, avatar_url, application_id, created_at, updated_at) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
            first_name,
            last_name,
            phone_number,
            email,
            hashedPassword,
            provider_id,
            provider,
            avatar_url,
            application_id
        ]
    );

    const [rows] = await pool.query("SELECT * FROM interns WHERE id = ?", [result.insertId]);
    return rows[0];
}
