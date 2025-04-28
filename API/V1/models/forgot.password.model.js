const mongoose = require("mongoose");

const forgorschema = new mongoose.Schema(
  {
    email: String,
    otp: Number,
    expireAt: {
      type: Date,
      expires: 0, // 0 seconds
      default: () => new Date(Date.now() + 300 * 1000), // Now + 5 phút
    },
  },
  { timestamps: true }
);

const ForgorPassword = mongoose.model(
  "ForgorPassword",
  forgorschema,
  "forgot-password"
);

module.exports = ForgorPassword;
