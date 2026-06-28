import express from "express";
import { createReview, deleteReview, getPropertyReviews } from "./review.controller.js";
import { verifyToken } from "../../middleware/authMiddleware.js";
import protectRoute from "../../middleware/protectRoute.js";
import { ROLES } from "../../utils/roles.js";


const router = express.Router();

router.get("/property/:id", getPropertyReviews)
router.post("/create", verifyToken, protectRoute(ROLES.TENANT), createReview);
router.delete("/delete/:id", verifyToken, deleteReview)

export default router;