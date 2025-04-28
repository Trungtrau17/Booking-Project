const routerAdmin = require("./admin.route");
const routerRoom = require("./room.route");
const middleware = require("../../middlewares/admin/admin.middleware");
const routerCategoryRoom = require("./category.room.route");
const routerRole = require("./role.route");
const routerInfoHotel = require("./info.hotel.route");
const routerVoucher = require("./voucher.route");
module.exports = (app) => {
  const admin = "/api/v1/admin";
  app.use(admin, routerAdmin);  
  app.use(admin, middleware.adminAuthencation, routerRoom);
  app.use(
    `${admin}/category-rooms`,
    middleware.adminAuthencation,
    routerCategoryRoom
  );
  app.use(`${admin}/roles`, middleware.adminAuthencation, routerRole);
  app.use(`${admin}/info-hotel`, middleware.adminAuthencation, routerInfoHotel);
  app.use(`${admin}/vouchers`, middleware.adminAuthencation, routerVoucher);
  
};
