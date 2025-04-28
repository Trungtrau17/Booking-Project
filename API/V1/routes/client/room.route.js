const  express = require("express")
const routerRoom = express.Router();
const controller = require("../../controllers/client/room.controller")
// [GET] /api/v1/client/rooms
routerRoom.get("/", controller.index)

module.exports = routerRoom