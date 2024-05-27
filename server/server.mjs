import express from "express";
import http from "http";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import bodyParser from "body-parser";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import mongoose from "mongoose";

import { resolvers } from "./resolvers/index.js";
import { typeDefs } from "./schemas/index.js";

import "dotenv/config";

const app = express();
const httpServer = http.createServer(app);

//Connect to DB
const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster-0.l6duvss.mongodb.net/noteDB?retryWrites=true&w=majority&appName=cluster-0`;
const PORT = process.env.PORT || 4000;
const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(cors(), bodyParser.json({limit: '50mb'}),expressMiddleware(server));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

mongoose.connect(URI)
.then(async () => {
    console.log("Connected to MongoDB with Mongoose");
    await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
}).catch((error) => {
    console.error("MongoDB connection error:", error);
});