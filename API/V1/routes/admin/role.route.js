const express = require("express");
const routerRoles = express.Router();

const controller = require("../../controllers/admin/role.controller");

// [GET] /api/v1/admin/roles
routerRoles.get("/", controller.index);
// [POST] /api/v1/admin/roles/create
routerRoles.post("/create", controller.createRole);
//[GET] /api/v1/admin/roles/edit/:roleId
routerRoles.get("/edit/:idRole", controller.getRole);
//[PATCH] /api/v1/admin/roles/edit/:roleId
routerRoles.patch("/edit/:idRole", controller.patchRole);
// [GET] /admin/roles/permissions
routerRoles.get("/permissions", controller.getPermission);
// [PATCH] /admin/roles/permissions
routerRoles.patch("/permissions", controller.patchPermission);
module.exports = routerRoles;
