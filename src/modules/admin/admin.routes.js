import express from "express";
import { getAllUser, getPendingProperties, getRunningBookings, updatePendingProperty, updateUserRole } from "./admin.controller.js";

const router = express.Router();

router.get("/user", getAllUser);
router.patch("/users/:userId/role", updateUserRole);
router.get("/properties/pending", getPendingProperties);
router.patch("/properties/:propertyId/status", updatePendingProperty);
router.patch("/bookings/running", getRunningBookings);

export default router;