const express = require("express");
const routerRoom = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const controller = require("../../controllers/admin/room.controller");
const cloudiary = require("../../middlewares/admin/cloudinay.middlewares");
// [GET] /api/v1/admin/rooms
routerRoom.get("/", controller.getRoom);
// [POST] /API/V1/ADMIT/rooms/create
routerRoom.post(
  "/room",

  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "imageArray", maxCount: 5 },
  ]),
  cloudiary.cloudFileds,
  controller.addRoom
);
// [GET] /api/v1/admin/rooms/detail/:idRoom
routerRoom.get("/detail/:idRoom", controller.detailRoom);
// [PATCH] /api/v1/admin/rooms/edit/:idRoom
routerRoom.patch(
  "/edit/:idRoom",

  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "imageArray", maxCount: 5 },
  ]),
  cloudiary.cloudFileds,

  controller.editRoom
);
// [PATCH] /api/v1/admin/rooms/delete/:idRoom
routerRoom.patch(
  "/delete/:idRoom",

  controller.deleteRoom
);
// [PATCH] /api/v1/admin/rooms/change-status/:idRoom
routerRoom.patch(
  "/change-status/:idRoom",

  controller.changeStatusRoom
);

// BIN
//[GET] /api/v1/admin/rooms-delete
routerRoom.get(
  "/rooms-delete",

  controller.roomDelete
);

// [PATCH] /api/v1/admin/rooms/undelete/:idRoom
routerRoom.patch("/undelete/:idRoom", controller.undelete);
// END BIN
module.exports = routerRoom;
