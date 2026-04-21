import prisma from "../lib/prisma.js";

export async function createSession(req, res) {
  try {
    const { imageId } = req.body;

    if (!imageId) {
      return res.status(400).json({ message: "imageId is required" });
    }

    const image = await prisma.image.findUnique({
      where: { id: Number(imageId) },
    });

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    const session = await prisma.gameSession.create({
      data: {
        imageId: image.id,
      },
      select: {
        id: true,
        startedAt: true,
        imageId: true,
      },
    });

    res.status(201).json(session);
  } catch (error) {
    console.error("[createSession error]", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function completeSession(req, res) {
  try {
    const { sessionId } = req.params;
    const { playerName } = req.body;

    if (!playerName || !playerName.trim()) {
      return res.status(400).json({ message: "playerName is required" });
    }

    const session = await prisma.gameSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (!session.completed) {
      return res.status(400).json({ message: "Game is not complete yet" });
    }

    const updated = await prisma.gameSession.update({
      where: { id: sessionId },
      data: {
        playerName: playerName.trim(),
      },
      select: {
        id: true,
        playerName: true,
        finalTimeMs: true,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error("[completeSession error]", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
