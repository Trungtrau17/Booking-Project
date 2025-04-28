const Cart = require("../../models/cart.model");
const Room = require("../../models/rooms.model");
const Order = require("../../models/order.model");
const Voucher = require("../../models/voucher.model");
const priceHelper = require("../../helper/price.helper");
const momoHelper = require("../../helper/momo.helper");
// ham tinh gia cho 1 don hang
const allPriceOreder = (array) => {
  const totalPrice = array.reduce((sum, item) => {
    const sumOnePrice =
      item.price * item.quantity -
      item.price * (item.discountPersent / 100) * item.quantity;

    return sum + sumOnePrice;
  }, 0);

  return totalPrice;
};
//[GET] /api/v1/client/cart
module.exports.getCart = async (req, res) => {
  try {
    const roomCart = res.locals.cart.products;
    data = [];
    for (const item of roomCart) {
      const room = await Room.findOne({ deleted: false, _id: item.product_id });
      const roomNew = priceHelper.priceItem(room);

      const objectRoom = {
        id: roomNew.id,
        priceNew: roomNew.newPrice,
        price: roomNew.price,
        title: roomNew.nameRoom,
        numberRoom: roomNew.numberRoom,
        capacity: roomNew.capacity,
        discountPersent: roomNew.discountPersent,
        quantity: item.quantity,
        thumbnail: roomNew.thumbnail[0],
        floor: roomNew.floor,
        windowView: roomNew.windowView,
      };
      data.push(objectRoom);
    }
    return res.status(200).json({
      message: "Successfully!",
      code: 200,
      data: data,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, code: 500 });
  }
};
//[POST] /api/v1/client/cart/add/:roomId
module.exports.addCartProduct = async (req, res) => {
  try {
    const id = req.params.roomId;

    const cart_id = req.cookies.cartId;
    const quantity = parseInt(req.body.quantity);

    // Kiểm tra số lượng hợp lệ
    if (!quantity || quantity < 1) {
      return res
        .status(400)
        .json({ message: "Quantity must be greater than 0!", code: 400 });
    }
    const room = await Room.findOne({ deleted: false, _id: id });
    if (!room) {
      return res.status(404).json({ message: "Room not found!", code: 404 });
    }
    const checkCart = res.locals.cart.products.find(
      (item) => item.product_id === id
    );
    // console.log(checkCart);
    if (checkCart) {
      await Cart.updateOne(
        { _id: cart_id, userId: req.user.id, "products.product_id": id },
        {
          $set: {
            "products.$.quantity": checkCart.quantity + parseInt(quantity),
          },
        }
      );
    } else {
      const roomQuantity = {
        product_id: id,
        quantity: quantity,
      };
      await Cart.updateOne(
        { _id: cart_id, userId: req.user.id },
        {
          $push: { products: roomQuantity },
        }
      );
    }
    return res
      .status(200)
      .json({ message: "Add room to cart successfully!", code: 200 });
  } catch (error) {
    return res.status(500).json({ message: error.message, code: 500 });
  }
};

//[GET] /api/v1/client/cart/delete/:roomId
module.exports.deleteRoomOfCart = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const room = await Room.findOne({ deleted: false, _id: roomId });
    if (!room) {
      return res.status(404).json({ message: "Room not found!", code: 404 });
    }
    const cart_id = req.cookies.cartId;
    await Cart.updateOne(
      { _id: cart_id },
      {
        $pull: {
          products: { product_id: roomId },
        },
      }
    );
    return res.status(200).json({
      message: "Successfully!",
      code: 200,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, code: 500 });
  }
};

//[POST] /api/v1/client/cart/change/:roomId
module.exports.changeQuantity = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const room = await Room.findOne({ deleted: false, _id: roomId });
    if (!room) {
      return res.status(404).json({ message: "Room not found!", code: 404 });
    }
    const newQuantity = parseInt(req.body.quantity);
    if (!newQuantity || newQuantity < 1) {
      return res
        .status(400)
        .json({ message: "Quantity must be greater than 0!", code: 400 });
    }
    const cart_id = req.cookies.cartId;
    await Cart.updateOne(
      { _id: cart_id, "products.product_id": roomId },
      {
        $set: { "products.$.quantity": newQuantity },
      }
    );
    return res.status(200).json({
      message: "Update Successfully!",
      code: 200,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, code: 500 });
  }
};

//[POST] /api/v1/cart/checkout
module.exports.checkout = async (req, res) => {
  try {
    const id_and_method = req.body.methodandid;
    const cartId = req.cookies.cardId;
    let cartCheckOut = [];
    // TH1: Khách hàng ấn đặt phòng ở giao diện chi tiết của phòng
    if (id_and_method[1] === "placenow") {
      id_and_method.splice(1, 1);
      const [id] = id_and_method;
      const room = await Room.findOne({ _id: id, deleted: false });

      if (!room) {
        return res.status(404).json({ message: "Room not found!", code: 404 });
      }
      const cart = res.locals.cart;
      const checkCart = cart.products.find((item) => item.product_id === id);
      if (checkCart) {
        await Cart.updateOne(
          { _id: cartId, "products.product_id": id },
          {
            $set: {
              "products.$.quantity": parseInt(req.body.quantity),
            },
          }
        );
      } else {
        const data = {
          product_id: id,
          quantity: parseInt(req.body.quantity),
        };

        await Cart.updateOne(
          { _id: cartId },
          {
            $push: { products: data },
          }
        );
      }
      // Chuẩn bị dữ liệu checkout cho sản phẩm "Đặt phòng ngay"
      const roomNew = priceHelper.priceItem(room);
      cartCheckOut.push({
        product_id: id,
        quantity: parseInt(req.body.quantity),
        newPrice: roomNew.newPrice,
        price: roomNew.price,
        discountPersent: roomNew.discountPersent,
        thumbnail: roomNew.thumbnail,
        title: roomNew.nameRoom,
        totalPrice: roomNew.newPrice * parseInt(req.body.quantity),
      });
    }

    // TH2: Khách hàng chọn các phòng muốn đặt ở giao diện giỏ hàng
    else {
      const cart = res.locals.cart;

      for (const idRoom of id_and_method) {
        const roomInfo = await Room.findOne({ _id: idRoom, deleted: false });
        // console.log(productInfo);
        if (!roomInfo) {
          return res
            .status(404)
            .json({ message: `Room with ID ${idRoom} not found!`, code: 404 });
        }
        const roomNew = priceHelper.priceItem(roomInfo);
        const productInCart = cart.products.find(
          (item) => item.product_id === idRoom
        );
        if (productInCart) {
          cartCheckOut.push({
            product_id: idRoom,
            quantity: productInCart.quantity,
            newPrice: roomNew.newPrice,
            price: roomNew.price,
            discountPersent: roomNew.discountPersent,
            thumbnail: roomNew.thumbnail,
            title: roomNew.nameRoom,
            totalPrice: roomNew.newPrice * productInCart.quantity,
          });
        }
      }
    }
    const allPricePay = cartCheckOut.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );
    const allPriceDiscount = cartCheckOut.reduce((sum, item) => {
      return sum + item.price * (item.discountPersent / 100) * item.quantity;
    }, 0);

    return res.status(200).json({
      message: "Checkout successfully!",
      code: 200,
      data: {
        cartCheckOut,
        allPricePay,
        allPriceDiscount,
      },
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: error.message,
    });
  }
};
//[POST] /api/v1/cart/checkout/order
module.exports.postOrder = async (req, res) => {
  try {
    const cart_id = req.cookies.cartId;
    // const productOrderSuccess = JSON.parse(req.body.idsOrder);
    const productOrderSuccess = req.body.idsOrder;

    let ids = [];
    for (const item of productOrderSuccess) {
      ids.push(item.product_id);
      const room = await Room.findOne({
        deleted: false,
        _id: item.product_id,
      }).select("-description -editBy");
      item.price = room.price;
      item.discountPersent = room.discountPersent;
      const orderSuccess = {
        user_id: req.user.id,
        cart_id: cart_id,
        userInfo: {
          fullname: req.body.fullname,
          phone: req.body.phone,
          address: req.body.address,
        },
        products: productOrderSuccess,
        payMent: req.body.payment,
        delivery: req.body.delivery,
      };

      const totalPrice = allPriceOreder(productOrderSuccess);

      let totalAmount = totalPrice;
      // Nếu người dùng gửi mã giảm giá và có đủ điều kiện
      // trường hợp này fe đã sử lý tốt và cho người dùng gửi mã giá giám hợp lệ với điều kiện
      const idVoucher = req.body.idVoucher;
      if (idVoucher) {
        const voucherApp = await Voucher.findOne({
          status: "active",
          _id: idVoucher,
          deleted: false,
        });
        const typeVoucher = voucherApp.discountType;
        const valueVoucher = voucherApp.discountValue;
        const minOrderValue = voucherApp.minOrderValue;
        const usedCount = voucherApp.usedCount;
        const maxDiscountValue = voucherApp.maxDiscountValue;
        if (!voucherApp) {
          return res.status(404).json({
            message: "Voucher không tồn tại hoặc không hợp lệ!",
            code: 404,
          });
        }
        // Kiểm tra điều kiện áp dụng voucher
        if (totalPrice < minOrderValue) {
          return res.status(400).json({
            message: `Đơn hàng không đủ điều kiện áp dụng voucher! Giá trị tối thiểu: ${voucherApp.minOrderValue}`,
            code: 400,
          });
        }

        switch (typeVoucher) {
          case "fixed":
            totalAmount = totalPrice - valueVoucher;
            break;

          case "percentage":
            const discount = (voucherApp.discountValue / 100) * totalPrice;
            totalAmount = totalPrice - Math.min(discount, maxDiscountValue);
            break;

          default:
            throw new Error("Loại voucher không hợp lệ!");
        }
        await Voucher.updateOne(
          {
            _id: idVoucher,
          },
          {
            $set: {
              usedCount: usedCount + 1,
            },
          }
        );
      }

      // kiểm tra phường thức thanh toán
      const payMent = req.body.payment;
      // sử lý nếu người dúng gửi mã voucher lên
      switch (payMent) {
        case "payMomo":
          const orderProduct = new Order(orderSuccess);
          await orderProduct.save();
          const momo = await momoHelper.momoPaymentApi(
            totalAmount + 25000,
            `${orderProduct.id}`,
            "https://cd84-183-80-130-7.ngrok-free.app/api/v1/client/momo-callback"
          );
          console.log(momo);
          // Trả về URL thanh toán cho frontend
          return res.status(200).json({
            message: "Tạo đơn hàng thành công! Vui lòng thanh toán qua Momo.",
            code: 200,
            data: {
              paymentUrl: momo.payUrl, // URL thanh toán của Momo
              orderId: orderProduct.id, // ID đơn hàng
            },
          });
        case "payZalo":
          // TODO: Thêm logic xử lý thanh toán qua ZaloPay
          return res.status(501).json({
            message: "Thanh toán qua ZaloPay chưa được hỗ trợ!",
            code: 501,
          });
        case "payCash":
          // Lưu đơn hàng và trả về thông báo thành công
          const cashOrder = new Order(orderSuccess);
          await cashOrder.save();
          await Order.updateOne(
            { _id: cashOrder.id },
            { $set: { status: "pending", paymentMethod: "cash" } }
          );
          // console.log("chay qua day");
          // Xóa sản phẩm order ra khỏi giỏ hàng
          console.log(totalAmount);
          await Cart.updateOne(
            { _id: cart_id },
            {
              $pull: { products: { product_id: { $in: ids } } },
            }
          );
          return res.status(200).json({
            message: "Đặt hàng thành công!",
            code: 200,
            data: {
              orderId: cashOrder.id,
              totalAmount: totalAmount,
            },
          });
        default:
          return res.status(400).json({
            message: "Phương thức thanh toán không hợp lệ!",
            code: 400,
          });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: error.message, code: 500 });
  }
};
//[POST] /api/v1/client/momo-callback
module.exports.momoCallBack = async (req, res) => {
  try {
    const { orderId, resultCode } = req.body;
    // const id = orderId.split("_")[1];
    // Kiểm tra trạng thái thanh toán
    if (resultCode === 0) {
      // Thanh toán thành công
      await Order.updateOne(
        { _id: orderId },
        { status: "pending", statusPayment: "paid" }
      );

      return res.status(200).json({
        message: "Thanh toán thành công!",
        code: 200,
      });
    } else {
      // Thanh toán thất bại
      await Order.updateOne({ _id: orderId }, { statusPayment: "FAILED" });

      return res.status(400).json({
        message: "Thanh toán thất bại!",
        code: 400,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi trong quá trình xử lý callback từ Momo!",
      code: 500,
      error: error.message,
    });
  }
};