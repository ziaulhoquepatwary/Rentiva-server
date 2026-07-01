import express from "express";
import { getAdminDashboardStats, getAllUser, getBookingHistory, getPendingProperties, getRunningBookings, updatePendingProperty, updateUserRole } from "./admin.controller.js";

const router = express.Router();

router.get("/user", getAllUser);
router.get("/user/count", getAdminDashboardStats);
router.patch("/users/:userId/role", updateUserRole);
router.get("/properties/pending", getPendingProperties);
router.patch("/properties/:propertyId/status", updatePendingProperty);
router.get("/bookings/running", getRunningBookings);
router.get("/bookings/history", getBookingHistory);

export default router;