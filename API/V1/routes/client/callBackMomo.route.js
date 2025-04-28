const express = require("express");
const routerCallBack = express.Router();
const controller = require("../../controllers/client/cart.controller");

//[POST] /api/v1/client/momo-callback
routerCallBack.post("/momo-callback", controller.momoCallBack);
module.exports = routerCallBack;