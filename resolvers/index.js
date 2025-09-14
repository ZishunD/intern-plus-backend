import { internResolvers } from "./internResolvers.js";

export default {
    Query: {
        ...internResolvers.Query, // 合并所有 Query 解析器
    },
    Mutation: {
        ...internResolvers.Mutation, // 合并所有 Mutation 解析器
    },
};