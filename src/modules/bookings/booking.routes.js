import express from "express";
import { getTenantBookings, handleStripeWebhook } from "./booking.controller.js";
import { verifyToken } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/stripe-webhook", express.raw({ type: "application/json" }), handleStripeWebhook);

router.use(express.json());

router.get("/tenant-booking", verifyToken, getTenantBookings);

export default router;