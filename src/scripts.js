const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const main = async function () {
  const newLink = await prisma.link.create({
    data: {
      description: 'Fullstack tutorial for GQL',
      url: 'www.howtographql.com'
    }
  });
  const allLinks = await prisma.link.findFirst();
  console.log(allLinks);
};

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });