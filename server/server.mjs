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

app.use(cors(), bodyParser.json(), expressMiddleware(server));

// const client = new MongoClient(URI, {
//     serverApi: {
//       version: ServerApiVersion.v1,
//       strict: true,
//       deprecationErrors: true,
//     }
// });
// async function connectToMongoDB() {
//     try {
//         await client.connect();
//         await client.db("admin").command({ ping: 1 });
//         console.log(
//             "Pinged your deployment. You successfully connected to MongoDB!"
//         );
//         await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
//         console.log(`🚀 Server ready at http://localhost:${PORT}`);
//     } catch (e) {
//         console.error("MongoDB connection error:", e);
//     } finally {
//         await client.close();
//     }
// }

// connectToMongoDB().catch(console.error);

mongoose.connect(URI)
.then(async () => {
    console.log("Connected to MongoDB with Mongoose");
    await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
}).catch((error) => {
    console.error("MongoDB connection error:", error);
});

// Get all notebooks
// fetch('http://localhost:4000', {
//     method: "POST",
//     headers: {
//         "Content-Type": "application/json",
//         "Accept": "application/json",
//     },
//     body: JSON.stringify({ query: "{ notebooks { id name createdAt} }" })
// }).then(response => response.json()).then(data => console.log(data));

// Get a single notebook
// const query = `
//     query notebook($id: String) {
//         notebook(id: $id) {
//             id
//             name
//             createdAt
//         }
//     }
// `
// const variables = {
//     id: "1"
// };
// fetch('http://localhost:4000', {
//         method: 'POST',
//         headers: {
//             "Accept": "application/json",
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//             query,
//             variables,
//         }),
//     })
//     .then(response => response.json())
//     .then(data => console.log(data));
