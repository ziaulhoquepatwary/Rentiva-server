import express from "express";
import { createProperty, deleteProperty, getAllProperty, getMyProperties, getSingleProperty, updateProperty, updatePropertyStatus } from "./property.controller.js";
import { verifyToken } from "../../middleware/authMiddleware.js";
import protectRoute from "../../middleware/protectRoute.js";
import { ROLES } from "../../utils/roles.js";


const router = express.Router();

router.get("/", getAllProperty)
router.get("/owner-property", verifyToken, getMyProperties)
router.get("/:id", verifyToken, getSingleProperty)
router.post("/", verifyToken, protectRoute(ROLES.OWNER), createProperty);
router.patch("/:id", verifyToken, updateProperty)
router.patch("/admin/:id", updatePropertyStatus)
router.delete("/:id", deleteProperty)


export default router;