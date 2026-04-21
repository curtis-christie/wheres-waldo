import { Router } from "express";
import { createSession, completeSession } from "../controllers/sessionController.js";

const router = Router();

router.post("/", createSession);
router.post("/:sessionId/complete", completeSession);

export default router;
