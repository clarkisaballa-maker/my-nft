const mongoose = require('mongoose');

const VipLevelSchema = new mongoose.Schema(
    {
        level: {
            type: Number,
            required: true,
            unique: true // VIP 1, 2, 3, 4, 5
        },

        name: {
            type: String,
            required: true,
            trim: true // Starter, Silver, Gold, Platinum, Diamond
        },

        packagePrice: {
            type: Number,
            required: true // 100, 500, 1000, 3000, 10000
        },

        dailyProducts: {
            type: Number,
            required: true // 10, 25, 40, 60, 100
        },

        dailyProfitPercent: {
            type: Number,
            required: true // 2, 3, 4, 5, 8
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('VipLevel', VipLevelSchema);