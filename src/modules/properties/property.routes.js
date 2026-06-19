import express from "express";
import { createProperty } from "./property.controller.js";


const router = express.Router();

router.post("/", createProperty);


export default router;