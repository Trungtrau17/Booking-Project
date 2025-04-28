const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    parentId: {
      //   type: mongoose.Schema.Types.ObjectId,
      //   ref: "CategoryRooms",
      //   default: null,
      type: String,
      default: null,
    },
    position: Number,
    feature: String,
    thumbnail: Array,
    description: {
      type: String,
      trim: true,
    },
    status: String,
    slug: {
      type: String,
      slug: "title",
      unique: true,
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
const CategoryRooms = mongoose.model(
  "CategoryRooms",
  categorySchema,
  "category-room"
);

module.exports = CategoryRooms;
