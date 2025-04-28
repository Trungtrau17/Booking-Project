const Admin = require("../../models/admin.model");
const createToken = require("../../helper/create.token");
const md5 = require("md5");
const path = require('path');

// [POST] /api/v1/admin/register
module.exports.register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const existEmail = await Admin.findOne({ deleted: false, email: email });
    if (existEmail) {
      return res.status(400).json({
        message: "Email was exist!",
        code: 400,
      });
    }
    const token = createToken.createToken(30);
    const admin = new Admin({
      fullName: fullName,
      email: email,
      password: md5(password),
      token: token,
    });
    await admin.save();
    res.cookie("tokenAdmin", admin.token);
    // return res.status(200).json({
    //   message: "Create admin successful!",
    //   code: 200,
    // });
    res.redirect('/api/v1/admin/login')
  } catch (error) {
    return res.status(500).json({
      message: "SERVER ERROR!",
      code: 500,
    });
  }
};

// [POST] /api/v1/admin/login
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existEmail = await Admin.findOne({ deleted: false, email: email });
    if (!existEmail) {
      return res.status(400).json({
        message: "Email not exist!",
        code: 400,
      });
    }
    if (existEmail.password !== md5(password)) {
      return res.status(400).json({
        message: "Password not exist!",
        code: 400,
      });
    }
    res.cookie("tokenAdmin", existEmail.token);
    // return res.status(200).json({
    //   message: "Login successful!",
    //   code: 200,
    // });
    res.redirect('/api/v1/admin/dashboard')
  } catch (error) {
    return res.status(500).json({
      message: "SERVER ERROR!",
      code: 500,
    });
  }
};

// [GET] /api/v1/admin/account-manage
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
      find.fullName = title;
    }
    const allAdmin = await Admin.countDocuments(find);

    const sort = {};
    // console.log(req.query);
    if (sortkey && sortvalue) {
      sort[sortkey] = sortvalue;
    } else {
      sort.position = "asc";
    }

    const data = await Admin.find(find)
      .limit(parseInt(limit))
      .skip((page - 1) * parseInt(limit))
      .sort(sort)
      .select("-password -token");
    res.status(200).json({
      message: "Truy cap du lieu thanh cong!",
      code: 200,
      data: data,
      pagination: {
        total: allAdmin,
        page: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "SERVER ERROR!",
      code: 500,
    });
  }
};

// [PATCH] /api/v1/admin/account-manage/delete/:statusDelete/:idAccount
module.exports.deleteAccount = async (req, res) => {
  try {
    const { statusDelete, idAccount } = req.params;

    switch (statusDelete) {
      case "delete": {
        const accountExist = await Admin.findOne({
          deleted: false,
          _id: idAccount,
        });

        if (!accountExist) {
          return res.status(400).json({
            message: "Account not exist!",
            code: 400,
          });
        }
        await Admin.updateOne(
          { _id: idAccount, deleted: false },
          {
            deleted: true,
          }
        );
        return res.status(200).json({
          message: "Update successfully!",
          code: 200,
        });
      }

      case "undelete": {
        const accountExist = await Admin.findOne({
          deleted: true,
          _id: idAccount,
        });

        if (!accountExist) {
          return res.status(400).json({
            message: "Account not exist!",
            code: 400,
          });
        }
        await Admin.updateOne(
          { _id: idAccount, deleted: true },
          {
            deleted: false,
          }
        );
        return res.status(200).json({
          message: "Update successfully!",
          code: 200,
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      message: "SERVER ERROR!",
      code: 500,
    });
  }
};

// [GET] /api/v1/admin/account-manage/edit/:idAccount
module.exports.getEdit = async (req, res) => {
  try {
    const { idAccount } = req.params;
    const accountExist = await Admin.findOne({
      deleted: false,
      _id: idAccount,
    }).select("-password -token");

    if (!accountExist) {
      return res.status(400).json({
        message: "Account not exist!",
        code: 400,
      });
    }
    return res.status(200).json({
      message: "Successfully!",
      code: 200,
      data: accountExist,
    });
  } catch (error) {
    return res.status(500).json({
      message: "SERVER ERROR!",
      code: 500,
    });
  }
};

// [PATCH] /api/v1/admin/account-manage/edit/:idAccount
module.exports.patchEdit = async (req, res) => {
  try {
    const { idAccount } = req.params;
    const data = req.body;
    // Kiểm tra dữ liệu đầu vào
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({
        message: "No data provided for update!",
        code: 400,
      });
    }
    const accountExist = await Admin.findOne({
      deleted: false,
      _id: idAccount,
    }).select("-password -token");

    if (!accountExist) {
      return res.status(400).json({
        message: "Account not exist!",
        code: 400,
      });
    }
    // Kiểm tra xem email có tồn tại không
    if (data.email && data.email !== accountExist.email) {
      const emailExist = await Admin.findOne({
        deleted: false,
        email: data.email,
      });
      if (emailExist) {
        return res.status(400).json({
          message: "Email already exists!",
          code: 400,
        });
      }
    }
    if (data.password) data.password = md5(data.password);
    await Admin.updateOne(
      { deleted: false, _id: idAccount },
      {
        $set: data,
      }
    );
    return res.status(200).json({
      message: "Successfully pdated!",
      code: 200,
    });
  } catch (error) {
    return res.status(500).json({
      message: "SERVER ERROR!",
      code: 500,
    });
  }
};
module.exports.viewLogin = (req, res) => {
  res.sendFile(path.join(__dirname, '../../../../TravelBooking/views/Admin/Login.html'));
}
module.exports.viewRegister = (req, res) => {
  res.sendFile(path.join(__dirname, '../../../../TravelBooking/views/Admin/Register.html'));
}
module.exports.viewDashboard = (req, res) => {
  res.sendFile(path.join(__dirname, '../../../../TravelBooking/views/Admin/index.html'));
}
module.exports.viewRoom = (req, res) => {
  res.sendFile(path.join(__dirname, '../../../../TravelBooking/views/Admin/room.html'));
}
module.exports.viewRole = (req, res) => {
  res.sendFile(path.join(__dirname, '../../../../TravelBooking/views/Admin/role.html'));
}
module.exports.viewAccount = (req, res) => {
  res.sendFile(path.join(__dirname, '../../../../TravelBooking/views/Admin/account.html'));
}
module.exports.viewCategory = (req, res) => {
  res.sendFile(path.join(__dirname, '../../../../TravelBooking/views/Admin/category.html'));
}