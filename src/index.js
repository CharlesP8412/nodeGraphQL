const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const User = require('./resolvers/User');
const Link = require('./resolvers/Link');
const Subscription = require('./resolvers/Subscription');
const fs = require('fs');
const path = require('path');
const { getUserId } = require('./utils');
const { PubSub } = require('apollo-server');

const prisma = new PrismaClient();
const pubsub = new PubSub();

let readDefs = fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8');
const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Link
};



const server = new ApolloServer({
  typeDefs: readDefs,
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      pubsub,
      userId:
        req && req.headers.authorization ? getUserId(req) : null
    };
  }
});

server
  .listen({ port: 4001 })
  .then(({ url }) => console.log(`Server is running on ${url}`));