const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const User = require('./resolvers/User');
const Link = require('./resolvers/Link');

const resolvers = {
  Query,
  Mutation,
  User,
  Link
};

const fs = require('fs');
const path = require('path');
let readDefs = fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8');
const { getUserId } = require('./utils');
const prisma = new PrismaClient();

const server = new ApolloServer({
  typeDefs: readDefs,
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      userId:
        req && req.headers.authorization ? getUserId(req) : null
    };
  }
});

server
  .listen({ port: 4001 })
  .then(({ url }) => console.log(`Server is running on ${url}`));