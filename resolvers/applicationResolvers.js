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
      return rows[0] || null;

    },
    getApplicationInformationById: async (_, { application_id }) => {
      const sql = `
        SELECT 
  a.application_id,
  p.title,
  a.status,
  t.status AS task_status,
  a.internship_type,
  i.first_name AS fname,
  i.last_name AS lname,
  i.phone_number,
  i.email
FROM applications a
JOIN intern_programs p 
  ON a.program_id = p.id
JOIN interns i 
  ON a.intern_id = i.id
JOIN application_tasks t 
  ON t.application_id = a.id
  AND t.task_name = a.status
WHERE a.application_id = ?;

      `;
      const [rows] = await pool.query(sql, [application_id]);
      return rows[0] || null;
    }
  }
}