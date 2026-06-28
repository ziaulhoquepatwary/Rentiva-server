import express from "express";
import { checkFavoriteStatus, toggleFavorite } from "./favorite.controller.js";
import { verifyToken } from "../../middleware/authMiddleware.js";


const router = express.Router();

router.post("/toggle", verifyToken, toggleFavorite);
router.get("/check/:id", verifyToken, checkFavoriteStatus);

export default router;