const { db, query } = require("../../config/db");
const { validationResult } = require("express-validator");
const { handleValidationErrors, handleServerError } = require("../../utils/errorHandlers");

module.exports = {
  getStoreOrders: async (req, res, next) => {
    try {
      let storeId = req.query.storeId;

      const orderQuery = await query(`
          SELECT * FROM orders
          WHERE store_id = ${db.escape(storeId)}`);

      orderQuery.sort((a, b) => b.order_id - a.order_id); // sort order in descending order

      res.status(200).send(orderQuery);
    } catch (error) {
      next(error);
    }
  },
  getAllOrders: async (req, res, next) => {
    try {
      const allOrderQuery = await query(`
          SELECT * FROM orders`);

      allOrderQuery.sort((a, b) => b.order_id - a.order_id); // sort alll orders in descending order

      res.status(200).send(allOrderQuery);
    } catch (error) {
      next(error);
    }
  },
  confirmOrder: async (req, res, next) => {
    try {
      let orderId = req.query.orderId;

      const confirmOrderQuery = await query(`
        UPDATE orders
        SET
            order_status = "Processed"
        WHERE
            order_id = ${db.escape(orderId)}
        `);

      res.status(200).send({
        message: "Order confirmed",
        data: confirmOrderQuery,
      });
    } catch (error) {
      next(error);
    }
  },
  rejectOrder: async (req, res, next) => {
    try {
      let orderId = req.query.orderId;

      const rejectOrderQuery = await query(`
        UPDATE orders
        SET
            payment_proof = "REJECTED",
            order_status = "Waiting for payment"
        WHERE
            order_id = ${db.escape(orderId)}
        `);

      res.status(200).send({
        message: "Order rejected",
        data: rejectOrderQuery,
      });
    } catch (error) {
      next(error);
    }
  },
  sendOrder: async (req, res, next) => {
    try {
      let orderId = req.query.orderId;

      const sendOrderQuery = await query(`
        UPDATE orders
        SET
            order_status = "Out for delivery"
        WHERE
            order_id = ${db.escape(orderId)}
        `);

      res.status(200).send({
        message: "Order is out for delivery",
        data: sendOrderQuery,
      });
    } catch (error) {
      next(error);
    }
  },
};
