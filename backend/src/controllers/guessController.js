import prisma from "../lib/prisma.js";

export async function submitGuess(req, res) {
  const { sessionId, x, y } = req.body;

  if (!sessionId || x === undefined || y === undefined) {
    return res.status(400).json({ message: "sessionId, x, and y are required" });
  }

  const session = await prisma.gameSession.findUnique({
    where: { id: sessionId },
    include: {
      image: {
        include: {
          characters: true,
        },
      },
    },
  });

  if (!session) {
    return res.status(404).json({ message: "Session not found" });
  }

  if (session.completed) {
    return res.status(400).json({ message: "Game already completed" });
  }

  const waldo = session.image.characters[0];

  if (!waldo) {
    return res.status(500).json({ message: "No Waldo data found for this image" });
  }

  const alreadyFound = await prisma.sessionFoundCharacter.findFirst({
    where: {
      sessionId,
      characterId: waldo.id,
    },
  });

  if (alreadyFound) {
    return res.status(400).json({ message: "Waldo already found" });
  }

  const isCorrect =
    Number(x) >= waldo.xMin &&
    Number(x) <= waldo.xMax &&
    Number(y) >= waldo.yMin &&
    Number(y) <= waldo.yMax;

  if (!isCorrect) {
    return res.json({
      correct: false,
      message: "That is not Waldo.",
    });
  }

  await prisma.sessionFoundCharacter.create({
    data: {
      sessionId,
      characterId: waldo.id,
    },
  });

  const endedAt = new Date();
  const finalTimeMs = endedAt.getTime() - new Date(session.startedAt).getTime();

  await prisma.gameSession.update({
    where: { id: sessionId },
    data: {
      completed: true,
      endedAt,
      finalTimeMs,
    },
  });

  res.json({
    correct: true,
    gameCompleted: true,
    finalTimeMs,
    marker: {
      x: waldo.markerX,
      y: waldo.markerY,
    },
  });
}
