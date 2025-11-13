import pool from "../utils/db.js";
import { GraphQLUpload } from 'graphql-upload';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO; // 替换为你仓库
const GITHUB_OWNER = process.env.GITHUB_OWNER;

function generate9DigitId() {
    // Math.random() 生成 0-1，乘 1e9 得到 0-999999999
    // 向下取整，确保是整数，再加 100000000 保证至少 9 位
    return Math.floor(Math.random() * 900_000_000) + 100_000_000;
}

/**
 * 确保生成的 ID 在数据库中唯一
 */
async function getUniqueApplicationId() {
    let id;
    let exists = true;

    while (exists) {
        id = generate9DigitId();

        const [rows] = await pool.query(
            "SELECT 1 FROM applications WHERE application_id = ? LIMIT 1",
            [id]
        );

        if (rows.length === 0) exists = false; // 不存在，则安全
    }

    return id;
}

// 上传函数
async function uploadToGitHub(file, path) {
    const { createReadStream, filename, mimetype } = await file.promise;
    const stream = createReadStream();
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
    }
    const content = Buffer.concat(chunks).toString("base64");

    const res = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message: `Upload ${filename}`,
            content,
            branch: 'main',
        }),
    });

    const data = await res.json();
    if (data.content && data.content.download_url) {
        return data.content.download_url;
    } else {
        console.error(data);
        throw new Error("GitHub upload failed");
    }
}

export const applyResolvers = {
    Upload: GraphQLUpload,
    Mutation: {
        applyInternship: async (_, { input }) => {
            const {
                first_name,
                last_name,
                email,
                phone,
                startDate,
                endDate,
                internshipType,
                resumeFile,
                portfolioFile,
                program_id
            } = input;

            const application_id = await getUniqueApplicationId();

            const [internRows] = await pool.query(
                `SELECT id FROM interns WHERE email = ?`,
                [email]
            );

            let intern_id = "";

            if (internRows.length > 0) {
                // 用户已存在
                intern_id = internRows[0].id;
            } else {
                throw new Error("No account found. Please register first.");
            }

            const resumeUrl = await uploadToGitHub(resumeFile, `uploads/${application_id}-resume.pdf`);
            let portfolioUrl = null;
            if (portfolioFile) {
                portfolioUrl = await uploadToGitHub(portfolioFile, `uploads/${application_id}-portfolio.pdf`);
            }

            // 插入数据库
            const [result] = await pool.query(
                `INSERT INTO applications
        (intern_id, start_date, end_date, internship_type, resume_file, portfolio_file, program_id, application_id, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
                [intern_id, startDate, endDate, internshipType, resumeUrl, portfolioUrl, program_id, application_id]
            );

            const id = result.insertId;

            await pool.query(
                `INSERT INTO application_tasks
        (application_id, task_name, due_date, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, NOW(), NOW())`,
                [id, "pending", endDate, "pending"]
            );

            await pool.query(
                `UPDATE interns SET status = 'pending', updated_at = NOW() WHERE email = ?`,
                [email]
            );

            return { application_id };
        },
    },
};
