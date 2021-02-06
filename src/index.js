const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');



let links = [{
  id: 'link-0',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL'
}];


let idCount = links.length;
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: async (parent, args, context) => {
      return context.prisma.link.findMany();
    },
  },
  Mutation: {
    post: (parent, args, context, info) => {
      const newLink = context.prisma.link.create({
        data: {
          url: args.url,
          description: args.description,
        },
      });
      return newLink;
    },
  },
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