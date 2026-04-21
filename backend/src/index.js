import app from "./app.js";
import "dotenv/config";

const PORT = Number(process.env.PORT);

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`[SERVER] Running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("[STARTUP ERROR]", error);
    process.exit(1);
  }
};

startServer();
