import express from "express";
import { handleStripeWebhook } from "./booking.controller.js";

const router = express.Router();

router.post("/stripe-webhook", express.raw({ type: "application/json" }), handleStripeWebhook);

router.use(express.json());

export default router;