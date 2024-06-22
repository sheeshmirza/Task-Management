const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const schema = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
const authMiddleware = require("./middlewares/auth");

dotenv.config();
const app = express();
app.use(express.json());
app.use(authMiddleware);

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: ({ req }) => ({ user: req.user }),
  formatError: (error) => ({
    message: error.message,
    path: error.path,
  }),
  playground: true,
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app, path: "/api/graphql" });
}

startServer();

const PORT = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));
