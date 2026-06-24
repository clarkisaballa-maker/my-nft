const mongoose = require("mongoose");

const ReferralSchema = new mongoose.Schema(
    {
        depositRewardPercent: {
            type: Number,
            required: true,
            default: 0,
        },

        perProductCommissionPercent: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Referral", ReferralSchema, "referral");