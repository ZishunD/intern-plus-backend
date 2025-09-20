import { internResolvers } from "./internResolvers.js";
import { internProgramResolvers } from "./programResolvers.js";
import { applyResolvers } from "./applyResolvers.js";

export default {
    Query: {
        ...internResolvers.Query, // 合并所有 Query 解析器
        ...internProgramResolvers.Query
    },
    Mutation: {
        ...internResolvers.Mutation, // 合并所有 Mutation 解析器
        ...internProgramResolvers.Mutation,
        ...applyResolvers.Mutation
    },
};
