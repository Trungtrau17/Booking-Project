const express = require("express");
const routeOrder = express.Router();
const controller = require("../../controllers/client/order.controller");
// [GET] /api/v1/client/order/success
routeOrder.get("/success", controller.index);
// [GET] /api/v1/client/order/success
routeOrder.patch("/cancel/:idOrder", controller.cancel);
module.exports = routeOrder;