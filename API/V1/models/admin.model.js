const mongoose = require("mongoose");
const tokenCreate = require("../helper/create.token");
const adminSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    thumbnail: Array,
    status: String,
    address: String,
    position: Number,
    deleted: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      // default: tokenCreate.createToken(30),
    },
    roleId: String,
    createdBy: {
      account_id: String,
      fullName: String,
      createAt: Date,
    },
    editBy: [
      {
        account_id: String,
        fullName: String,
        editAt: Date,
      },
    ],

    deletedBy: {
      account_id: String,
      fullName: String,
      deletedAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model("Admin", adminSchema, "admin");
module.exports = Admin;
