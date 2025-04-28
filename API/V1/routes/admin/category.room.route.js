const express = require("express");
const routerCategoryRoom = express.Router();

const controller = require("../../controllers/admin/category.room.controller.js");

// [GET] /ap1/v1/admin/category-rooms
routerCategoryRoom.get("/", controller.getCategory);

// [POST] /ap1/v1/admin/category-rooms/create
routerCategoryRoom.post("/create", controller.createCategory);
// [GET] /ap1/v1/admin/category-rooms/edit/:idCategory
routerCategoryRoom.get("/edit/:idCategory", controller.editGetCategory);
// [PATCH] /ap1/v1/admin/category-rooms/edit/:idCategory
routerCategoryRoom.patch("/edit/:idCategory", controller.editPostCategory);
module.exports = routerCategoryRoom;
