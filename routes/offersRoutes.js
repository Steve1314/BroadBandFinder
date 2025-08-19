// routes/offers.routes.js
import express from "express";
import {
    createOffer,
    deleteOffer,
    getOffer,
    getOffers,
    updateOffer
} from "../controllers/offerController.js";

const router = express.Router();

// Create offer (optional image)
router.post("/", createOffer);

// Get list (with pagination & search)
router.get("/", getOffers);

// Get single
router.get("/:id", getOffer);

// Delete
router.delete("/:id", deleteOffer);

router.put("/:id", updateOffer);

export default router;
