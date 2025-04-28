const CategoryRooms = require("../../models/category.room");
/*
Tao vừa làm cái chỉnh xem là người thêm, sửa, xóa tạo nhé ở bên controller room mày xem xong làm theo ở mấy còn controller khác nhé
*/
// [GET] /ap1/v1/admin/category-rooms
module.exports.getCategory = async (req, res) => {
  try {
    const { parentId = null, page = 1, limit = 5 } = req.query;
    const find = {
      deleted: false,
      parentId: parentId,
    };

    const totalCategories = await CategoryRooms.countDocuments(find);
    console.log(totalCategories);
    const data = await CategoryRooms.find(find)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("parentId");
    if (data.lenth === 0) {
      return res.status(400).json({
        message: "PARENT_ID NOTS EXIST!",
        code: 400,
      });
    }
    return res.status(200).json({
      message: "Successful!",
      code: 200,
      data: data,
      pagination: {
        total: totalCategories,
        page: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "SERVER ERROR!",
      code: 500,
    });
  }
};

// [POST] /ap1/v1/admin/category-rooms/create
module.exports.createCategory = async (req, res) => {
  try {
    if (!req.body.title) {
      return res.status(400).json({
        message: "Title is required!",
        code: 400,
      });
    }
    const allCategory = await CategoryRooms.countDocuments();
    const position =
      req.body.position !== undefined ? req.body.position : allCategory + 1;
    const data = req.body;
    data.position = position;
    const categoryNew = new CategoryRooms(data);
    await categoryNew.save();
    return res.status(200).json({
      message: "Successful!",
      code: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "SERVER ERROR!",
      code: 500,
    });
  }
};

// [GET] /ap1/v1/admin/category-rooms/edit/:idCategory
module.exports.editGetCategory = async (req, res) => {
  try {
    const idCategory = req.params.idCategory;
    const category = await CategoryRooms.findOne({
      deleted: false,
      _id: idCategory,
    });
    if (!category) {
      return res.status(400).json({
        message: "Category not exist!",
        code: 400,
      });
    }
    return res.status(200).json({
      message: "Successful!",
      code: 200,
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      message: "SERVER ERROR!",
      code: 500,
    });
  }
};
// [PATCH] /ap1/v1/admin/category-rooms/edit/:idCategory
module.exports.editPostCategory = async (req, res) => {
  try {
    const idCategory = req.params.idCategory;
    const updateData = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "No data provided for update!",
        code: 400,
      });
    }
    const category = await CategoryRooms.findOne({
      deleted: false,
      _id: idCategory,
    });
    if (!category) {
      return res.status(400).json({
        message: "Category not exist!",
        code: 400,
      });
    }
    await CategoryRooms.updateOne(
      { _id: idCategory, deleted: false },
      {
        $set: updateData,
      }
    );
    return res.status(200).json({
      message: "Edit Successful!",
      code: 200,
    });
  } catch (error) {
    return res.status(500).json({
      message: "SERVER ERROR!",
      code: 500,
    });
  }
};
