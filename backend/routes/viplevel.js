const express = require("express");
const router = express.Router();
const VipLevel = require("../models/VipLevel");

// =========================
// CREATE NEW VIP LEVEL
// =========================
router.post("/create", async (req, res) => {
    try {
        const { level, name, packagePrice, dailyProducts, dailyProfitPercent, isActive } = req.body;

        if (!level || !name || !packagePrice || !dailyProducts || !dailyProfitPercent) {
            return res.status(400).json({
                success: false,
                error: "level, name, packagePrice, dailyProducts and dailyProfitPercent are required"
            });
        }

        const existing = await VipLevel.findOne({ level });
        if (existing) {
            return res.status(409).json({
                success: false,
                error: `VIP Level ${level} already exists`
            });
        }

        const vipLevel = new VipLevel({
            level,
            name,
            packagePrice,
            dailyProducts,
            dailyProfitPercent,
            isActive: isActive ?? true
        });

        await vipLevel.save();

        res.status(201).json({
            success: true,
            message: "VIP Level created successfully!",
            data: vipLevel
        });

    } catch (error) {
        console.error("Create VIP Level Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// =========================
// GET ALL VIP LEVELS
// =========================
router.get("/", async (req, res) => {
    try {
        const vipLevels = await VipLevel.find().sort({ level: 1 });

        res.status(200).json({
            success: true,
            data: vipLevels
        });

    } catch (error) {
        console.error("Fetch VIP Levels Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// =========================
// GET SINGLE VIP LEVEL BY ID
// =========================
router.get("/:id", async (req, res) => {
    try {
        const vipLevel = await VipLevel.findById(req.params.id);

        if (!vipLevel) {
            return res.status(404).json({
                success: false,
                error: "VIP Level not found"
            });
        }

        res.status(200).json({
            success: true,
            data: vipLevel
        });

    } catch (error) {
        console.error("Get VIP Level Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// =========================
// UPDATE VIP LEVEL BY ID
// =========================
router.put("/update/:id", async (req, res) => {
    try {
        const updated = await VipLevel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({
                success: false,
                error: "VIP Level not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "VIP Level updated successfully!",
            data: updated
        });

    } catch (error) {
        console.error("Update VIP Level Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// =========================
// DELETE VIP LEVEL BY ID
// =========================
router.delete("/delete/:id", async (req, res) => {
    try {
        const deleted = await VipLevel.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                error: "VIP Level not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "VIP Level deleted successfully!"
        });

    } catch (error) {
        console.error("Delete VIP Level Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;