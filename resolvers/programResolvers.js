import pool from "../utils/db.js";

export const internProgramResolvers = {
    Query: {
        // 获取所有实习项目，可选过滤 category
        internPrograms: async (_, { filter }) => {
            let sql = `
        SELECT id, hr_account_id, title, description, location, open_date, close_date, total_positions, category, status, created_at, updated_at
        FROM intern_programs
      `;
            const params = [];

            if (filter?.category) {
                sql += " WHERE category = ?";
                params.push(filter.category);
            }

            const [rows] = await pool.query(sql, params);
            return rows;
        },
        programSum: async () => {
            const [rows] = await pool.query(`SELECT COUNT(*) AS sum FROM intern_programs`);
            console.log(rows);
            return rows[0]?.sum || 0;
        },

        positionSum: async () => {
            const [rows] = await pool.query(`SELECT SUM(total_positions) AS sum FROM intern_programs`);
            return rows[0]?.sum || 0;
        },

        categorySum: async () => {
            const [rows] = await pool.query(`
        SELECT category, COUNT(DISTINCT category) AS sum FROM intern_programs GROUP BY category
    `);
            return rows.length ? rows.map(row => ({ category: row.category, sum: row.sum })) : [];
        },
    },

    Mutation: {
        // 创建新的实习项目
        createInternProgram: async (_, { input }) => {
            const {
                hr_account_id,
                title,
                description,
                location,
                open_date,
                close_date,
                total_positions,
                category,
                status,
            } = input;

            const [result] = await pool.query(
                `INSERT INTO intern_programs 
         (hr_account_id, title, description, location, open_date, close_date, total_positions, category, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
                [hr_account_id, title, description, location, open_date, close_date, total_positions, category, status || "open"]
            );

            // 返回新插入的项目
            const [rows] = await pool.query(
                "SELECT * FROM intern_programs WHERE id = ?",
                [result.insertId]
            );
            return rows[0];
        },
    },
};
