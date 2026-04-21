import { Router } from "express";
import { submitGuess } from "../controllers/guessController.js";

const router = Router();

router.post("/", submitGuess);

export default router;
