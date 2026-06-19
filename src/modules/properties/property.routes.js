import express from "express";
import { createProperty, getAllProperty, getMyProperties, getSingleProperty, updateProperty, updatePropertyStatus } from "./property.controller.js";


const router = express.Router();

router.get("/", getAllProperty)
router.get("/owner-property", getMyProperties)
router.get("/:id", getSingleProperty)
router.post("/", createProperty);
router.patch("/:id", updateProperty)
router.patch("/admin/:id", updatePropertyStatus)


export default router;