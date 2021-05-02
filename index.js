const { ApolloServer } = require('apollo-server');
const jwt = require('jsonwebtoken');

require('dotenv').config({ path: '.env' });

const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');

const connectDB = require('./config/db');

// connect to database
connectDB();

const server = new ApolloServer({
  typeDefs,
  resolvers,

  context: ({ req }) => {
    const token = (req.headers && req.headers.authorization) || '';

    if (token) {
      try {
        const user = jwt.verify(token, process.env.SECRET);

        return {
          user,
        };
      } catch (error) {}
    }
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
