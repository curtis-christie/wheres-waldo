import { Router } from "express";
import { getImageBySlug, getLeaderboardBySlug } from "../controllers/imageController.js";

const router = Router();

router.get("/:slug", getImageBySlug);
router.get("/:slug/leaderboard", getLeaderboardBySlug);

export default router;
