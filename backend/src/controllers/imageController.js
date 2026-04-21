import prisma from "../lib/prisma.js";

export async function getImageBySlug(req, res) {
  const { slug } = req.params;

  const image = await prisma.image.findUnique({
    where: { slug },
    include: {
      characters: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!image) {
    return res.status(404).json({ message: "Image not found" });
  }

  res.json(image);
}

export async function getLeaderboardBySlug(req, res) {
  const { slug } = req.params;

  const image = await prisma.image.findUnique({
    where: { slug },
  });

  if (!image) {
    return res.status(404).json({ message: "Image not found" });
  }

  const leaderboard = await prisma.gameSession.findMany({
    where: {
      imageId: image.id,
      completed: true,
      playerName: {
        not: null,
      },
    },
    orderBy: {
      finalTimeMs: "asc",
    },
    take: 10,
    select: {
      playerName: true,
      finalTimeMs: true,
    },
  });

  res.json(leaderboard);
}
