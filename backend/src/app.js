import express from "express";
import cors from "cors";
import imageRoutes from "./routes/imageRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import guessRoutes from "./routes/guessRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "Server up and healthy." });
});

app.use("/api/images", imageRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/guesses", guessRoutes);

export default app;
