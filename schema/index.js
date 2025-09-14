import fs from "fs";
import path from "path";

const __dirname = path.resolve();
const userSchema = fs.readFileSync(path.join(__dirname, "schema/intern.graphql"), "utf-8");

export default userSchema;