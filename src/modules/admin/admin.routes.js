import express from "express";
import { getAllUser } from "./admin.controller.js";

const router = express.Router();

router.get("/user", getAllUser);

export default router;