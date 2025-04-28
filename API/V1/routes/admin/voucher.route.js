const express = require("express");
const routerVoucher = express.Router();
const controller = require("../../controllers/admin/voucher.controller");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const cloudiary = require("../../middlewares/admin/cloudinay.middlewares");
//[GET] /api/v1/admin/vouchers
routerVoucher.get("/", controller.index);

//[POST] /api/v1/admin/vouchers/add
routerVoucher.post(
  "/add",
  upload.single("thumbnail"),
  cloudiary.cloudImage,
  controller.addVoucher
);
//[GET] /api/v1/admin/vouchers/detail/:idVoucher
routerVoucher.get("/detail/:idVoucher", controller.getEditVoucer);
//[PATCH] /api/v1/admin/vouchers/edit/:idVoucher
routerVoucher.patch(
  "/edit/:idVoucher",
  upload.single("thumbnail"),
  cloudiary.cloudImage,
  controller.patchEditVoucher
);
//[PATCH] /api/v1/admin/vouchers/delete/:idVoucher
routerVoucher.patch("/delete/:idVocher", controller.deleteVoucher);
module.exports = routerVoucher;