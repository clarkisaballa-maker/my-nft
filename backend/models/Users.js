const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    phone: { type: String, required: true },
    loginPassword: { type: String, required: true },
    transactionPassword: { type: String, required: true },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    myinviteCode: { type: String, required: true },
    refinviteCode: { type: String, required: true },
    profileimage: { type: String, required: true },

    currentVIPLevel: {
      number: { type: Number, default: 0 },
      upgradedAt: { type: Date, default: null },
    },

    profile: {
      photoLink: { type: String, default: "" },
      identifier: { type: String, default: "" },
    },

    totalBalance: { type: Number, default: 0 },
    creditScore: { type: Number, default: 100 },

    notifications: [
      {
        message: { type: String, required: true },
        type: {
          type: String,
          enum: ["info", "warning", "success", "error"],
          default: "info",
        },
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    allowWithdrawal: { type: Boolean, default: false },
  },
  { timestamps: true }
);

leadSchema.pre("save", async function (next) {
  if (this.isNew) return next();

  const oldDoc = await this.constructor.findById(this._id).select(
    "currentVIPLevel.number"
  );

  if (
    oldDoc &&
    oldDoc.currentVIPLevel.number !== this.currentVIPLevel.number
  ) {
    this.currentVIPLevel.upgradedAt = new Date();
  }

  next();
});

module.exports = mongoose.model("Users", leadSchema);
