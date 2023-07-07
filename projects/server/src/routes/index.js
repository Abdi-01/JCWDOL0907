const adminAuthRoutes = require("./admin/adminAuthRoutes");
const adminCategoryRoutes = require("./admin/adminCategoryRoutes");
const adminProductRoutes = require("./admin/adminProductRoutes");
const adminDashboarRoutes = require("./admin/adminDashboardRoutes");
const authRoutes = require("./authRoutes");
const storeRoutes = require("./storeRoutes");
const addressRoutes = require("./addressRoutes");
const cityRoutes = require("./cityRoutes");
const provinceRoutes = require("./provinceRoutes");
const productRoutes = require("./productRoutes");
const profileRoutes = require("./profileRoutes");
const cartRoutes = require("./cartRoutes");
const orderRoutes = require("./orderRoutes");
const discountRoutes = require("./admin/discountRoutes");

module.exports = {
  authRoutes,
  adminAuthRoutes,
  adminCategoryRoutes,
  adminProductRoutes,
  adminDashboarRoutes,
  storeRoutes,
  addressRoutes,
  cityRoutes,
  provinceRoutes,
  productRoutes,
  profileRoutes,
  cartRoutes,
  orderRoutes,
  discountRoutes,
};
