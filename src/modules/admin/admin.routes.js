import express from "express";
import { getAllUser, updateUserRole } from "./admin.controller.js";

const router = express.Router();

router.get("/user", getAllUser);
router.get("/users/:userId/role", updateUserRole);

export default router;