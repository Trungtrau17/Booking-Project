const mongoose = require("mongoose");
const tokenCreate = require("../helper/create.token");
const userSchema = new mongoose.Schema(
  {
    //  tao truong du lieu
    name: String,
    email: String,
    password: String,
    phone: String,
    thumbnail: Array,
    status: String,
    address: String,
    deleted: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      // default: tokenCreate.createToken(30),
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema, "user");

module.exports = User;
