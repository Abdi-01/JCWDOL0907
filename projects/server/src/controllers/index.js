const adminAuthController = require("./admin/adminAuthController");
const adminCategoryController = require("./admin/adminCategoryController");
const authController = require("./authController");
const storeController = require("./storeController");
const addressController = require("./addressController");
const cityController = require("./cityController");
const provinceController = require("./provinceController");
const adminProductController = require("./admin/adminProductController");
const adminProductImageController = require("./admin/adminProductImageController");
const productController = require("./productController");
const profileController = require("./profileController");
const cartController = require("./cartController");
const shippingController = require("./shippingController");
const orderController = require("./orderController");

module.exports = {
  authController,
  adminAuthController,
  adminCategoryController,
  adminProductController,
  adminProductImageController,
  storeController,
  addressController,
  cityController,
  provinceController,
  productController,
  profileController,
  cartController,
  shippingController,
  orderController,
};
