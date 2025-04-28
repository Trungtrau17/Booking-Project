const express = require("express")
const routerVoucher = express.Router()
const controller = require("../../controllers/client/voucher.controller")
// [GET] api/v1/client/vouchers
routerVoucher.get("/", controller.index)

module.exports = routerVoucher;