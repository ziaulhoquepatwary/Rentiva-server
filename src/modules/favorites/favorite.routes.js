import express from "express";
import { checkFavoriteStatus, getTenantFavorites, toggleFavorite } from "./favorite.controller.js";
import { verifyToken } from "../../middleware/authMiddleware.js";


const router = express.Router();

router.post("/toggle", verifyToken, toggleFavorite);
router.get("/check/:id", verifyToken, checkFavoriteStatus);
router.get("/my-favorites", verifyToken, getTenantFavorites);

export default router;