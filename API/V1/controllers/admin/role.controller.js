const Role = require("../../models/roles.model");
/*
    
        "category_view",
        "category_create",
        "category_delete",
        "category_edit",
        "room_view",
        "room_edit",
        "room_delete",
        "room_create",
        "account_view",
        "account_create",
        "account_edit",
        "account_delete"
        bố xong rồi ấy khi nào rảnh pull code về xong mày làm nốt phân quyền cho controller admin, category,room nhé cú pháp như controller roles nhé 
        lưu ý bên admin không phân quyền cho api đăng nhập với đăng ký nhé bro
*/
// [GET] /api/v1/admin/roles
module.exports.index = async (req, res) => {
  try {
    if (req.admin && req.roles.permissions.includes("role_view")) {
      const find = {
        deleted: false,
      };
      const data = await Role.find(find);

      return res.status(200).json({
        message: "Successfully!",
        code: 200,
        data: data,
        permissions: req.roles.permissions,
      });
    } else {
      return res.status(403).json({
        message: "Forbidden: You don't have permission to access this resource",
        code: 403,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "SERVER ERROR!",
      code: 500,
    });
  }
};

// [POST] /api/v1/admin/roles/create
module.exports.createRole = async (req, res) => {
  try {
    if (req.admin && req.roles.permissions.includes("role_create")) {
      const createData = req.body;

      // Kiểm tra dữ liệu đầu vào
      if (!createData || Object.keys(createData).length === 0) {
        return res.status(400).json({
          message: "No data provided for update!",
          code: 400,
        });
      }
      if (!req.body.title) {
        return res.status(400).json({
          message: "Title is required!",
          code: 400,
        });
      }
      const dataNew = new Role(createData);
      await dataNew.save();
      return res.status(200).json({
        message: "Create successful!",
        code: 200,
      });
    } else {
      return res.status(403).json({
        message: "Forbidden: You don't have permission to access this resource",
        code: 403,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "SERVER ERROR!",
      code: 500,
    });
  }
};

//[GET] /api/v1/admin/roles/edit/:roleId
module.exports.getRole = async (req, res) => {
  try {
    if (req.admin && req.roles.permissions.includes("role_edit")) {
      const { idRole } = req.params;

      const data = await Role.findOne({ deleted: false, _id: idRole });

      if (!data) {
        return res.status(400).json({
          message: "idRole not exist",
          code: 400,
        });
      }
      return res.status(200).json({
        message: "Successful!",
        code: 200,
        data: data,
      });
    } else {
      return res.status(403).json({
        message: "Forbidden: You don't have permission to access this resource",
        code: 403,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "SERVER ERROR!",
      code: 500,
      error: error,
    });
  }
};

//[PATCH] /api/v1/admin/roles/edit/:roleId
module.exports.patchRole = async (req, res) => {
  try {
    if (req.admin && req.roles.permissions.includes("role_edit")) {
      const updateData = req.body;
      const { idRole } = req.params;
      // Kiểm tra dữ liệu đầu vào
      if (!updateData || Object.keys(updateData).length === 0) {
        return res.status(400).json({
          message: "No data provided for update!",
          code: 400,
        });
      }
      const data = await Role.findOne({ _id: idRole, deleted: false });
      if (!data) {
        return res.status(400).json({
          message: "Role not exist!",
          code: 400,
        });
      }
      await Role.updateOne(
        { _id: idRole, deleted: false },
        {
          $set: updateData,
        }
      );
      return res.status(200).json({
        message: "Edit Successful!",
        code: 200,
      });
    } else {
      return res.status(403).json({
        message: "Forbidden: You don't have permission to access this resource",
        code: 403,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "SERVER ERROR!",
      code: 500,
      error: error,
    });
  }
};

// [GET] /admin/roles/permissions

module.exports.getPermission = async (req, res) => {
  try {
    if (req.admin && req.roles.permissions.includes("role_edit")) {
      const roles = await Role.find({ deleted: false });
      return res.status(200).json({
        message: "Successful!",
        code: 200,
        data: roles,
      });
    } else {
      return res.status(403).json({
        message: "Forbidden: You don't have permission to access this resource",
        code: 403,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "SERVER ERROR!",
      code: 500,
      error: error,
    });
  }
};

// [PATCH] /admin/roles/permissions
module.exports.patchPermission = async (req, res) => {
  try {
    if (req.admin && req.roles.permissions.includes("role_edit")) {
      const { permissions } = req.body;

      // Kiểm tra dữ liệu đầu vào
      if (
        !permissions ||
        !Array.isArray(permissions) ||
        permissions.length === 0
      ) {
        return res.status(400).json({
          message: "Invalid permissions data!",
          code: 400,
        });
      }

      // Cập nhật quyền cho từng vai trò
      for (const item of permissions) {
        if (!item.id || !Array.isArray(item.permissions)) {
          return res.status(400).json({
            message: "Invalid item format!",
            code: 400,
          });
        }
        await Role.updateOne(
          { _id: item.id },
          { permissions: item.permissions }
        );
      }

      return res.status(200).json({
        message: "Permissions updated successfully!",
        code: 200,
      });
    } else {
      return res.status(403).json({
        message: "Forbidden: You don't have permission to access this resource",
        code: 403,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "SERVER ERROR!",
      code: 500,
      error: error,
    });
  }
};
