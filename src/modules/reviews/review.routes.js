import express from "express";
import { createReview, deleteReview, getHomeTopReviews, getPropertyReviews } from "./review.controller.js";
import { verifyToken } from "../../middleware/authMiddleware.js";
import protectRoute from "../../middleware/protectRoute.js";
import { ROLES } from "../../utils/roles.js";


const router = express.Router();

router.get("/home-reviews", getHomeTopReviews)
router.get("/property/:propertyId", getPropertyReviews)
router.post("/create", verifyToken, protectRoute(ROLES.TENANT), createReview);
router.delete("/delete/:id", verifyToken, deleteReview)

export default router;