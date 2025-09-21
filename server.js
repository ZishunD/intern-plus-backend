import express from "express";
import { ApolloServer } from "apollo-server-express";
import { graphqlUploadExpress } from "graphql-upload";
import typeDefs from "./schema/index.js";
import resolvers from "./resolvers/index.js";
import cors from "cors";

const app = express();

app.use(cors({
    origin: "http://localhost:3000", // 前端地址
    credentials: true,
}));

// graphql-upload 中间件
app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

// Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });
await server.start();
server.applyMiddleware({
    app, cors: {
        origin: [
            "http://localhost:3000",
            "https://intern-plus-frontend.onrender.com"
        ], // 前端地址
        credentials: true,
    }
});

// 启动 Express
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
});
