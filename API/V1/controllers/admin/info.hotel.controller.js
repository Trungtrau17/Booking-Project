const Hotel = require("../../models/info.hotel");
// [GET] /api/v1/admin/info-hotel
module.exports.index = async (req, res) => {
  try {
    if (req.admin && req.roles.permissions.includes("hotel_view")) {
      const data = await Hotel.findOne({ deleted: false });
      // Kiểm tra xem dữ liệu có tồn tại không
      if (!data) {
        return res.status(404).json({
          message: "Hotel information not found",
          code: 404,
        });
      }
      return res.status(200).json({
        message: "Successfully!",
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

// [PATCH] /api/v1/admin/info-hotel/edit
module.exports.Edit = async (req, res) => {
  try {
    if (req.admin && req.roles.permissions.includes("hotel_edit")) {
      const updateData = req.body;

      // Kiểm tra dữ liệu đầu vào
      if (!updateData || Object.keys(updateData).length === 0) {
        return res.status(400).json({
          message: "No data provided for update!",
          code: 400,
        });
      }

      // Kiểm tra xem thông tin khách sạn có tồn tại không
      const hotelExist = await Hotel.findOne({ deleted: false });
      if (!hotelExist) {
        return res.status(404).json({
          message: "Hotel information not found",
          code: 404,
        });
      }

      // Cập nhật thông tin khách sạn
      await Hotel.updateOne(
        { _id: hotelExist.id, deleted: false },
        { $set: updateData }
      );

      return res.status(200).json({
        message: "Successfully updated!",
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
