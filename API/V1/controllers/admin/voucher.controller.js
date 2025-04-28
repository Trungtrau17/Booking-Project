const Voucher = require("../../models/voucher.model");
const generateUniqueVoucherCode = require("../../helper/voucher.helper");
//[GET] /api/v1/admin/vouchers
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

//[POST] /api/v1/admin/vouchers/add
module.exports.addVoucher = async (req, res) => {
  try {
    const {
      description,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscountValue,
      startDate,
      endDate,
      thumbnail,
      applicableRooms,
      usageLimit,
    } = req.body;

    const voucherCode = await generateUniqueVoucherCode();
    const newVoucher = new Voucher({
      code: voucherCode,
      description,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscountValue,
      startDate,
      endDate,
      thumbnail,
      applicableRooms,
      usageLimit,
      createdBy: {
        account_id: req.admin.id,
        fullName: req.admin.fullName,
        createAt: new Date(),
      },
    });
    await newVoucher.save();
    return res.status(200).json({
      message: "Voucher created successfully!",
      data: newVoucher,
      code: 200,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      code: 500,
    });
  }
};
//[GET] /api/v1/admin/vouchers/detail/:idVoucher
module.exports.getEditVoucer = async (req, res) => {
  try {
    const id = req.params.idVoucher;
    const voucher = await Voucher.findOne({ deleted: false, _id: id });
    if (!voucher) {
      return res.status(400).json({
        message: "Voucher not exist!",
        code: 400,
      });
    }

    return res.status(200).json({
      message: "Successfully",
      code: 200,
      data: voucher,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      code: 500,
    });
  }
};

//[PATCH] /api/v1/admin/vouchers/edit/:idVoucher
module.exports.patchEditVoucher = async (req, res) => {
  try {
    const id = req.params.idVoucher;
    const voucher = await Voucher.findOne({ deleted: false, _id: id });
    if (!voucher) {
      return res.status(400).json({
        message: "Voucher not exist!",
        code: 400,
      });
    }
    const adminEdit = {
      account_id: req.admin.id,
      fullName: req.admin.fullName,
      editAt: Date.now(),
    };

    await Voucher.updateOne(
      {
        _id: id,
        deleted: false,
      },
      {
        ...req.body,
        $push: { editBy: adminEdit },
      }
    );

    return res.status(200).json({
      code: 200,
      message: "Edit voucher successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      code: 500,
    });
  }
};

//[PATCH] /api/v1/admin/vouchers/delete/:idVoucher
module.exports.deleteVoucher = async (req, res) => {
  try {
    const id = req.params.idVoucher;
    const voucher = await Voucher.findOne({ deleted: false, _id: id });
    if (!voucher) {
      res.status(400).json({
        message: "Voucher not exist!",
        code: 400,
      });
      return;
    }
    const adminDelete = {
      account_id: req.admin.id,
      fullName: req.admin.fullName,
      deletedAt: Date.now(),
    };
    await Voucher.updateOne(
      {
        _id: id,
      },
      {
        deleted: true,
        deletedBy: adminDelete,
      }
    );
    return res.status(200).json({
      message: `Delete voucher has ${id} successful!`,
      code: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "SERVER ERROR!",
      code: 500,
      error: error,
    });
  }
};