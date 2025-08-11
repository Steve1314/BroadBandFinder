import express from "express";
import {
    createZipcode,
    deleteZipcode,
    getCities,
    getStats,
    getZipcodes,
    updateZipcode
} from "../controllers/zipcodeController.js";

const router = express.Router();

router.post("/", createZipcode);
router.get("/", getZipcodes);
router.get("/cities", getCities);
router.get("/stats", getStats); // New dashboard stats route
router.put("/:id", updateZipcode);
router.delete("/:id", deleteZipcode);

export default router;
