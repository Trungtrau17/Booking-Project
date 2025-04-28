const express = require("express");
const routerInfoHotel = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const controller = require("../../controllers/admin/info.hotel.controller");
const upImage = require("../../middlewares/admin/cloudinay.middlewares");
// [GET] /api/v1/admin/info-hotel
routerInfoHotel.get("/", controller.index);

// [PATCH] /api/v1/admin/info-hotel/edit
routerInfoHotel.patch(
  "/edit",
  upload.single("thumbnail"),
  upImage.cloudImage,
  controller.Edit
);
module.exports = routerInfoHotel;
