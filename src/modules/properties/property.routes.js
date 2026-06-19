import express from "express";
import { createProperty, getAllProperty, getMyProperties, getSingleProperty } from "./property.controller.js";


const router = express.Router();

router.get("/", getAllProperty)
router.get("/owner-property", getMyProperties)
router.get("/:id", getSingleProperty)
router.post("/", createProperty);


export default router;