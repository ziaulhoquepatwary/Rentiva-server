import express from "express";
import { getAllBookingHistory, getAllUser, getPendingProperties, getRunningBookedProperties, updatePendingProperty, updateUserRole } from "./admin.controller.js";

const router = express.Router();

router.get("/user", getAllUser);
router.patch("/users/:userId/role", updateUserRole);
router.get("/properties/pending", getPendingProperties);
router.patch("/properties/:propertyId/status", updatePendingProperty);
router.patch("/properties/booked", getRunningBookedProperties);
router.patch("/bookings/history", getAllBookingHistory);

export default router;