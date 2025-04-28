const Order = require("../../models/order.model");
//  lấy ra đơn hàng đang trong quá trình chờ xác nhận
// [GET] /api/v1/client/order/success
module.exports.index = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart_id = req.cookies.cartId;
    // truy vấn ra các đơn hàng có trạng thái đang chờ xác nhận và ở đây khách hàng có thể hủy giao đơn hàng
    const orderPending = await Order.find({
      user_id: userId,
      cart_id: cart_id,
      status: "pending",
    });
    // console.log(orderPending);
    return res.status(200).json({
      message: "Get data success",
      data: orderPending,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, code: 500 });
  }
};

//[DELETE] /api/v1/client/order/cancel/:idOrder
module.exports.cancel = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart_id = req.cookies.cartId;
    const idOrder = req.params.idOrder;
    const result = await Order.deleteOne({
      user_id: userId,
      cart_id: cart_id,
      _id: idOrder,
      status: "pending",
    });
    if (result.deletedCount > 0) {
      return res.status(200).json({
        message: "Đơn hàng đã được xóa thành công.",
        code: 200,
      });
    } else {
      return res.status(400).json({
        message: "Đơn hàng xóa thất bại.",
        code: 400,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message, code: 500 });
  }
};