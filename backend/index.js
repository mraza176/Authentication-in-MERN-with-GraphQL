import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import db from "./db/db.js";

import passport from "passport";
import session from "express-session";
import ConnectMongoDBSession from "connect-mongodb-session";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { buildContext } from "graphql-passport";

import { typeDefs } from "./schemas/userSchema.js";
import { resolvers } from "./resolvers/userResolver.js";
import { configurePassport } from "./passport/passportConfig.js";

configurePassport();

const app = express();

const httpServer = http.createServer(app);

const MongoDBStore = ConnectMongoDBSession(session);
const store = new MongoDBStore({
  uri: process.env.DB_URI,
  collection: "sessions",
});
store.on("error", (error) => console.error(error));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60, httpOnly: true },
    store: store,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  "/",
  cors({ origin: "http://localhost:5173", credentials: true }),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req, res }) => buildContext({ req, res }),
  })
);

await new Promise((resolve) => httpServer.listen({ port: 5000 }, resolve));

await db();

console.log(`🚀 Server ready at http://localhost:5000/`);
