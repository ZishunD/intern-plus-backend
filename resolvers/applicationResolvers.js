import pool from "../utils/db.js";

export const applicationResolvers = {
    Query: {
        getApplicationById: async (_, { application_id }) => {
            const sql = `
        SELECT 
          a.application_id,
          a.id,
          p.title,
          p.category,
          p.total_positions,
          p.location,
          a.status,
          a.internship_type,
          a.start_date,
          a.end_date
        FROM applications a
        JOIN intern_programs p ON a.program_id = p.id
        WHERE a.application_id = ?

      `;
            const [rows] = await pool.query(sql, [application_id]);
            console.log("Row from DB:", rows[0]);
            return rows[0] || null;

        }
    }
}