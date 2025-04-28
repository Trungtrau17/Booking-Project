const express = require("express");
const routerUser = express.Router();
const controller = require("../../controllers/client/user.controller");
const middleware = require("../../middlewares/client/index.middlewars");
//[]
routerUser.post("/login", controller.login);
// [POST] /api/v1/client/add
routerUser.post("/register", controller.addUser);
// [POST] /api/v1/client/password/forgot
routerUser.post("/forgotpassword", controller.forgotPassword);
// [POST] /api/v1/client/password/otp
routerUser.post("/checkOTP", controller.checkOtp);
// [POST] /api/v1/client/password/rest
routerUser.patch(
  "/resetpassword",
  middleware.middleware,
  controller.resetPassword
);
// [GET] /api/v1/client/logout
routerUser.get("/logout", controller.logout);
routerUser.get("/login", controller.viewLogin);
routerUser.get("/register", controller.viewRegister);
routerUser.get("/forgotpassword", controller.viewForgotPassword);
routerUser.get("/checkOTP", controller.viewCheckOTP);
routerUser.get("/resetpassword", controller.viewResetPassword);
routerUser.get("/introduction", controller.viewIntroduction);
routerUser.get("/location", controller.viewLocation);
routerUser.get("/detail", controller.viewDetail);
routerUser.get("/menu", controller.viewAfterMenu);
routerUser.get("/", controller.viewHome);


module.exports = routerUser;
