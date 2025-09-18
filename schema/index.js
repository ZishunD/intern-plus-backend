import fs from "fs";
import path from "path";

const __dirname = path.resolve();
const internSchema = fs.readFileSync(path.join(__dirname, "schema/intern.graphql"), "utf-8");
const programSchema = fs.readFileSync(path.join(__dirname, "schema/program.graphql"), "utf-8");

const schema = [internSchema, programSchema].join("\n");

export default schema;