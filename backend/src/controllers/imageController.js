import prisma from "../lib/prisma.js";

export async function getImageBySlug(req, res) {
  try {
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
  } catch (error) {
    console.error("[getImageBySlug error]", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getLeaderboardBySlug(req, res) {
  try {
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
  } catch (error) {
    console.error("[getLeaderboardBySlug error]", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
