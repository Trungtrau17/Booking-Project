const mongoose = require("mongoose");

const roleschema = new mongoose.Schema(
  {
    title: String,
    description: String,
    permissions: {
      type: Array,
      default: [],
    },
    deleted: {
      type: Boolean,
      default: false,
    },
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

const Role = mongoose.model("Role", roleschema, "roles");

module.exports = Role;
