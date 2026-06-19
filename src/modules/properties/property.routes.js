import express from "express";
import { createProperty, getAllProperty } from "./property.controller.js";


const router = express.Router();

router.get("/", getAllProperty)
router.post("/", createProperty);


export default router;