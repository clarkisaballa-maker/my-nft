const mongoose = require("mongoose");

const VersionSchema = new mongoose.Schema(
    {
        currentVersion: {
            type: Number,
            required: true,
            default: 1,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Version", VersionSchema, "version");