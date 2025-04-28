const Voucher = require("../../models/voucher.model");

//[GET] /api/v1/client/vouchers
module.exports.index = async (req, res) => {
  try {
    const {
      status = null,
      keyword = null,
      limit = 2,
      page = 1,
      sortkey = "position",
      sortvalue = "asc",
    } = req.query;
    const find = {
      deleted: false,
      endDate:{ $gte: new Date() } // lấy gte lá lớn hơn hoặc bắng và lte là nhỏ hơn hoặc bằng 
    };

    if (status) {
      find.status = status;
    }
    if (keyword) {
      const title = new RegExp(keyword, "i");
      find.nameRoom = title;
    }
    const allVoucher = await Voucher.countDocuments(find);

    const sort = {};
    if (sortkey && sortvalue) {
      sort[sortkey] = sortvalue;
    } else {
      sort.position = "asc";
    }

    const data = await Voucher.find(find)
      .limit(parseInt(limit))
      .skip((page - 1) * parseInt(limit))
      .sort(sort);
    res.status(200).json({
      message: "Truy cap du lieu thanh cong!",
      code: 200,
      data: data,
      pagination: {
        total: allVoucher,
        page: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      code: 500,
    });
  }
};