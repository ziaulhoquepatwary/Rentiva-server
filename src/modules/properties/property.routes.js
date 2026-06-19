import express from "express";
import { createProperty, getAllProperty, getSingleProperty } from "./property.controller.js";


const router = express.Router();

router.get("/", getAllProperty)
router.get("/:id", getSingleProperty)
router.post("/", createProperty);


export default router;