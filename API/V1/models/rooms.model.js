const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const roomSchema = new mongoose.Schema(
  {
    nameRoom: String,
    numberRoom: Number,
    category_id: String,
    price: Number,
    status: String,
    description: String,
    capacity: Number,
    position: Number,
    thumbnail: {
      type: Array,
      default: [],
    },
    imageArray: {
      type: Array,
      default: [],
    },
    bed: Number,
    livePeople: Number,
    windowView: String, // Loại tầm nhìn của phòng
    discountPersent: Number,
    slug: {
      type: String,
      slug: "nameRoom",
      unique: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    floor: Number,
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

const Rooms = mongoose.model("Rooms", roomSchema, "rooms");

module.exports = Rooms;
