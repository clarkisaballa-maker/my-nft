const express = require("express");
const router = express.Router();
const Referral = require("../models/Referral");

// =========================
// CREATE REFERRAL SETTINGS
// =========================
router.post("/create", async (req, res) => {
    try {
        const { depositRewardPercent, perProductCommissionPercent } = req.body;

        if (depositRewardPercent === undefined || perProductCommissionPercent === undefined) {
            return res.status(400).json({
                success: false,
                error: "depositRewardPercent and perProductCommissionPercent are required"
            });
        }

        const existing = await Referral.findOne();
        if (existing) {
            return res.status(409).json({
                success: false,
                error: "Referral settings already exist. Use update instead."
            });
        }

        const referral = new Referral({
            depositRewardPercent,
            perProductCommissionPercent,
        });

        await referral.save();

        res.status(201).json({
            success: true,
            message: "Referral settings created successfully!",
            data: referral
        });

    } catch (error) {
        console.error("Create Referral Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// =========================
// GET REFERRAL SETTINGS
// =========================
router.get("/", async (req, res) => {
    try {
        const referral = await Referral.findOne();

        if (!referral) {
            return res.status(404).json({
                success: false,
                error: "Referral settings not found"
            });
        }

        res.status(200).json({
            success: true,
            data: referral
        });

    } catch (error) {
        console.error("Fetch Referral Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// =========================
// GET REFERRAL SETTINGS BY ID
// =========================
router.get("/:id", async (req, res) => {
    try {
        const referral = await Referral.findById(req.params.id);

        if (!referral) {
            return res.status(404).json({
                success: false,
                error: "Referral settings not found"
            });
        }

        res.status(200).json({
            success: true,
            data: referral
        });

    } catch (error) {
        console.error("Get Referral Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// =========================
// UPDATE REFERRAL SETTINGS
// =========================
router.put("/update/:id", async (req, res) => {
    try {
        const updated = await Referral.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({
                success: false,
                error: "Referral settings not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Referral settings updated successfully!",
            data: updated
        });

    } catch (error) {
        console.error("Update Referral Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// =========================
// DELETE REFERRAL SETTINGS
// =========================
router.delete("/delete/:id", async (req, res) => {
    try {
        const deleted = await Referral.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                error: "Referral settings not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Referral settings deleted successfully!"
        });

    } catch (error) {
        console.error("Delete Referral Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;