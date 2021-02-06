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
    feed: () => links
  },
  Mutation: {
    post: (parent, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      }
      links.push(link);
      return link;
    },
    update: (parent, args) => {
      console.log("UPDATE");
    }
  },
};

const fs = require('fs');
const path = require('path');

let readDefs = fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8');

const prisma = new PrismaClient();

const server = new ApolloServer({
  typeDefs: readDefs,
  resolvers,
  context: { prisma, }
});

server
  .listen({ port: 4001 })
  .then(({ url }) => console.log(`Server is running on ${url}`));