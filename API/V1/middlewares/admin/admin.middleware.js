const Admin = require("../../models/admin.model");
const Role = require("../../models/roles.model");
module.exports.adminAuthencation = async (req, res, next) => {
  try {
    const tokenBeare = req.headers.tokenadmin || req.cookies.tokenadmin;
    const userDataBase = await Admin.findOne({
      token: tokenBeare,
      deleted: false,
    });
    // console.log(userDataBase);
    if (!userDataBase) {
      res.status(400).json({
        message: "Token incorrect!",
        code: 400,
      });
      return;
    }
    const role = await Role.findOne({
      deleted: false,
      _id: userDataBase.roleId,
    });

    req.admin = userDataBase;
    req.roles = role;

    next();
  } catch (error) {
    res.json({
      message: "Server error!",
      code: 500,
    });
    return;
  }
};