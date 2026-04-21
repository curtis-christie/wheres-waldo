import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/api/health", (req, res) => {
  res.send("Server up and healthy.");
});

app.post("/api/click", (req, res) => {
  const { x, y } = req.body;

  console.log("Clicked at:", x, y);
  res.json({ message: "Coordinates received", x, y });
});

export default app;
