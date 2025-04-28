const md5 = require("md5");
const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot.password.model");
const randomOtp = require("../../helper/create.otp");
const { v4: uuidv4 } = require("uuid");
const { sendMail } = require("../../helper/sendmail.helper");
const createToken = require("../../helper/create.token");
const path = require('path');
// [POST] /api/v1/client/login
module.exports.login = async (req, res) => {
  try {
    const email = req.body.email;
    let password = req.body.password;

    const existEmail = await User.findOne({ deleted: false, email: email });
    if (!existEmail) {
      res.status(400).json({
        message: "email not exist!",
        code: 400,
      });
      return;
    }
    if (md5(password) !== existEmail.password) {
      res.status(400).json({
        message: "Incorrect password!",
        code: 400,
      });
      return;
    }
    res.cookie("token", existEmail.token);
    res.redirect('/api/v1/client/menu')
    // res.status(200).json({
    //   message: "Login successful!",
    //   code: 200,
    //   token: existEmail.token,
    // });
  } catch (error) {
    res.status(500).json({
      message: "Server error!",
      code: 500,
    });
  }
};

// [POST] /api/v1/client/resigter
module.exports.addUser = async (req, res) => {
  try {
    console.log(req.body);
    const email = req.body.email;
    const name = req.body.name;
    const existEmail = await User.findOne({ deleted: false, email: email });
    if (existEmail) {
      res.status(400).json({
        message: "Email already exists!",
        code: 400,
      });
      return;
    }
    let password = req.body.password;
    // const passwordconfirm = req.body.passwordconfirm;
    // if (password !== passwordconfirm) {
    //   res.status(400).json({
    //     message: "Password and Confirm Password are not the same!",
    //     code: 400,
    //   });
    //   return;
    // }
    const token = createToken.createToken(30); // Generate a 30-character token 
    data = {
      name: name,
      email: email,
      password: md5(password),
      token: token,
    };

    const clientNew = new User(data);
    await clientNew.save()
    res.cookie("token", clientNew.token)
    res.redirect('/api/v1/client/login')
    // res.status(200).json({
    //   message: "Create Sucessful!",
    //   code: 200,
    // });
  } catch (error) {
    console.error("Error during registration:", error); // Log the error details
    res.status(500).json({
      message: "Server error!",
      code: 500,
    });
  }
};

// [POST] /api/v1/client/password/forgot
module.exports.forgotPassword = async (req, res) => {
  try {
    // Người dùng sẽ gửi lên tài khoản email của mình ta sẽ check xem email đó có tồn tại trong db không
    const email = req.body.email;
    const existEmail = await User.findOne({ deleted: false, email: email });
    if (!existEmail) {
      res.status(400).json({
        message: "Email not exist!",
        code: 400,
      });
      return;
    }
    // Nếu email tồn tại thì ta sẽ gửi email thông báo cho người dùng và gửi kèm theo mã otp
    // Gửi mã otp qua email
    const otp = randomOtp.ramdomOtp(6);
    const data = {
      email: email,
      otp: otp,
    };

    const otpAuthen = new ForgotPassword(data);
    sendMail(email, data.otp);
    await otpAuthen.save();
    // res.json({
    //   message: "Success!",
    //   code: 1,
    //   data: data,
    // });
    res.redirect('/api/v1/client/checkOTP')
  } catch (error) {
    console.error("Error during forgot password:", error); // Log the error details
    res.json({
      message: "Server error!",
      code: 500,
    });
  }
};
// [POST] /api/v1/client/password/otp
module.exports.checkOtp = async (req, res) => {
  try {
    const email = req.body.email;
    const otp = req.body.otp;
    const user = await User.findOne({ deleted: false, email: email });
    const existOtp = await ForgotPassword.findOne({ email: email, otp: otp });
    if (!existOtp) {
      res.status(400).json({
        message: "OTP incorrect!",
        code: 400,
      });
      return;
    }
    res.cookie("token", user.token);
    // res.json({
    //   message: "OTP correct!",
    //   code: 200,
    // });
    res.redirect('/api/v1/client/resetpassword');
  } catch (error) {
    res.status(500).json({
      message: "Server error!",
      code: 500,
    });
  }
};
// [PATCH] /api/v1/client/password/rest
module.exports.resetPassword = async (req, res) => {
  try {
    let password = req.body.password;
    const passwordconfirm = req.body.passwordconfirm;
    console.log(req.user.token);
    if (req.user.password === md5(password)) {
      res.status(400).json({
        message: "Password incorrect!",
        code: 400,
      });
      return;
    }
    if (password !== passwordconfirm) {
      res.status(400).json({
        message: "Password and Confirm Password are not the same!",
        code: 400,
      });
      return;
    }
    
    await User.updateOne(
      {
        token: req.user.token,
        deleted: false,
      },
      {
        password: md5(password),
      }
    );
    res.status(200).json({
      message: "Reset password successful!",
      code: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error!",
      code: 500,
    });
  }
};


// [GET] /api/v1/client/logout
module.exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.clearCookie("cartId", {
      httpOnly: false,
      secure: false, // Chỉ gửi cookie qua kết nối HTTPS
      sameSite: "lax", // Ngăn chặn gửi cookie qua trang khác
      path: "/",
    });
    res.status(200).json({
      message: "Logout successful!",
      code: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error!",
      code: 500,
    });
  }
};


module.exports.viewLogin = (req, res) => {
  //GET /views/login
  res.sendFile(path.join(__dirname, '../../../../TravelBooking/views/User/Login.html'));
}
module.exports.viewHome = (req, res) => {
  //GET /views/menu
  res.sendFile(path.join(__dirname, '../../../../TravelBooking/views/User/Menu.html'));
}
module.exports.viewIntroduction = (req, res) => {
  //GET /views/introduction
  res.render('GioiThieu');
}
module.exports.viewRegister = (req, res) => {
  //GET /views/register
  res.sendFile(path.join(__dirname, '../../../../TravelBooking/views/User/Register.html'));
}
module.exports.viewForgotPassword = (req, res) => {
  //GET /views/register
  res.sendFile(path.join(__dirname, '../../../../TravelBooking/views/User/Forgot.html'));
}
module.exports.viewCheckOTP = (req, res) => {
  //GET /views/register
  res.sendFile(path.join(__dirname, '../../../../TravelBooking/views/User/OTP.html'));
}
module.exports.viewLocation = (req, res) => {
  //GET /views/register
  res.sendFile(path.join(__dirname, '../../../../TravelBooking/views/User/luutru.html'));
}
module.exports.viewDetail = (req, res) => {
  //GET /views/register
  res.sendFile(path.join(__dirname, '../../../../TravelBooking/views/User/chitiet.html'));
}
module.exports.viewResetPassword = (req, res) => {
  //GET /views/register
  res.sendFile(path.join(__dirname, '../../../../TravelBooking/views/User/Resetpassword.html'));
}
module.exports.viewAfterMenu = (req, res) => {
  //GET /views/register
  res.sendFile(path.join(__dirname, '../../../../TravelBooking/views/User/afterMenu.html'));
}
