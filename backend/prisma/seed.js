import prisma from "../src/lib/prisma.js";

async function main() {
  await prisma.sessionFoundCharacter.deleteMany();
  await prisma.gameSession.deleteMany();
  await prisma.character.deleteMany();
  await prisma.image.deleteMany();

  await prisma.image.create({
    data: {
      slug: "waldo1",
      title: "Find Waldo 1",
      imageUrl: "/images/waldo1.jpg",
      width: 2560,
      height: 1608,
      characters: {
        create: [
          {
            name: "Waldo",
            xMin: 0.91,
            xMax: 0.92375,
            yMin: 0.544732,
            yMax: 0.574553,
            markerX: 0.916875,
            markerY: 0.559642,
          },
        ],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
