const mongoose = require("mongoose");
const voucherSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
    },
    thumbnail: String,
    // Giá trị tối thiểu của đơn hàng để áp dụng
    minOrderValue: {
      type: Number,
      default: 0,
    },
    // Giá trị giảm giá tối đa mà voucher có thể áp dụng.
    maxDiscountValue: {
      type: Number,
      default: null,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    //Danh sách phòng có thể áp dụng (ID của rooms)
    applicableRooms: {
      type: Array,
      default: [],
    },
    // Số lần tối đa voucher có thể được sử dụng
    usageLimit: {
      type: Number,
      default: null,
    },
    // Số lần voucher đã được sử dụng
    usedCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
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
  { timestamps: true }
);

const Voucher = mongoose.model("Voucher", voucherSchema, "voucher");

module.exports = Voucher;
