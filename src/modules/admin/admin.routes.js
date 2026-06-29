import express from "express";
import { getAllUser, updatePendingProperty, updateUserRole } from "./admin.controller.js";

const router = express.Router();

router.get("/user", getAllUser);
router.patch("/users/:userId/role", updateUserRole);
router.patch("/properties/:propertyId/status", updatePendingProperty);

export default router;