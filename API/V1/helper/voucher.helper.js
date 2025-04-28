const Voucher = require("../models/voucher.model");
const crypto = require("crypto");

// Hàm tạo mã voucher không trùng lặp
const generateUniqueVoucherCode = async () => {
  let isUnique = false;
  let voucherCode;

  while (!isUnique) {
    // Tạo mã voucher ngẫu nhiên (6 ký tự chữ và số)
    voucherCode = crypto.randomBytes(3).toString("hex").toUpperCase();

    // Kiểm tra xem mã đã tồn tại trong cơ sở dữ liệu hay chưa
    const existingVoucher = await Voucher.findOne({ code: voucherCode });
    if (!existingVoucher) {
      isUnique = true; // Nếu không tồn tại, mã là duy nhất
    }
  }

  return voucherCode;
};

module.exports = generateUniqueVoucherCode;
