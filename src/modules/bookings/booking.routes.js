import express from "express";
import { getOwnerBookedProperties, getTenantBookings, getTenantDashboardStats, handleStripeWebhook } from "./booking.controller.js";
import { verifyToken } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/stripe-webhook", express.raw({ type: "application/json" }), handleStripeWebhook);

router.use(express.json());

router.get("/tenant-booking", verifyToken, getTenantBookings);
router.get("/owner-booked", verifyToken, getOwnerBookedProperties);
router.get("/tenant/deshboard-overview", verifyToken, getTenantDashboardStats);

export default router;