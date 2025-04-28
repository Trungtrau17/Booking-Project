const User = require("../../models/user.model");
const Cart = require("../../models/cart.model");
module.exports.middleware = async (req, res, next) => {
  try {
    const tokenBeare = req.headers.token || req.cookies.token; 
    const userDataBase = await User.findOne({
      token: tokenBeare,
      deleted: false,
    });
    // khi người dùng đăng nhập vào sẽ tạo cart cho người ta và lưu cartId CÓ ID CỦA NGƯỜI DÙNG
    if (!userDataBase) {
      res.status(400).json({
        message: "Token incorrect!",
        code: 400,
      });
      return;
    }
    req.user = userDataBase;
    let cart;
    // NGƯỜI DÙNG VỪA MỚI LẬP TÀI KHOẢN
    cart = await Cart.findOne({ userId: userDataBase.id });
    console.log(cart);
    // trường hợp người dùng mới lập tài khoản và chưa có cartID
    if (!req.cookies.cartId && !cart) {
      console.log("Tài khoản mới");
      cart = await createNewCart(userDataBase.id, res);
    }
    // trường hợp người dùng đã lập tài khoản nhưng đăng xuất ra lúc này sẽ lấy cartId lưu ra thêm vào cookies
    else if (!req.cookies.cartId && cart) {
      console.log("Tài khoản cũ");
      cart = await Cart.findOne({
        userId: userDataBase.id,
      });

      if (!cart) {
        console.log("Giỏ hàng không tồn tại, tạo giỏ hàng mới");
        cart = await createNewCart(userDataBase.id, res);
      }
      const dateCart = 1000 * 60 * 60 * 24 * 180 * 100;
      res.cookie("cartId", cart.id, {
        expires: new Date(Date.now() + dateCart),
        httpOnly: false,
        secure: false, // Chỉ gửi cookie qua kết nối HTTPS
        sameSite: "lax", // Ngăn chặn gửi cookie qua trang khác,
        path: "/",
      });
      if (cart.products.length > 0) {
        cart.totalProduct = cart.products.reduce((sum, item) => {
          return sum + item.quantity;
        }, 0);
      } else {
        cart.totalProduct = 0;
      }
    }
    // console.log(cart.products.length);
    res.locals.cart = cart;
    next();
  } catch (error) {
    res.json({
      message: "Server error!",
      code: 500,
    });
    return;
  }
};

const createNewCart = async (userId, res) => {
  data = {
    userId: userId,
    products: [],
  };
  const cart = new Cart(data);
  await cart.save();
  const dateCart = 1000 * 60 * 60 * 24 * 180 * 100;
  res.cookie("cartId", cart.id, {
    expires: new Date(Date.now() + dateCart),
    httpOnly: false,
    secure: false, // Chỉ gửi cookie qua kết nối HTTPS
    sameSite: "lax", // Ngăn chặn gửi cookie qua trang khác,
    path: "/",
  });
  return cart;
};