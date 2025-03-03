const { Order } = require("../models/order");
const { OrderItem } = require("../models/oreder-item");
const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const allowedTo = require("../middlewares/allowedTo");
const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/appError");
const asyncWrapper = require("../middlewares/asyncWrapper");
const roles = require("../utils/roles");
const { route } = require("./users");

// Get all orders
router.get(
  "/",
  verifyToken,
  allowedTo(roles.ADMIN),
  asyncWrapper(async (req, res, next) => {
    const ordersList = await Order.find()
      .populate("user", "name")
      .sort({ dateOrdered: -1 });

    if (!ordersList || !ordersList.length) {
      return next(
        appError.create("No orders found", 404, httpStatusText.NOT_FOUND)
      );
    }

    res.send({
      status: httpStatusText.SUCCESS,
      message: "Orders retrieved successfully",
      data: ordersList,
    });
  })
);

// Get single order
router.get(
  "/:id",
  verifyToken,
  allowedTo(roles.ADMIN),
  asyncWrapper(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
      .populate("user", "name")
      .populate({
        path: "orderItems",
        populate: { path: "product", populate: "category" },
      });

    if (!order) {
      return next(
        appError.create("Order not found", 404, httpStatusText.NOT_FOUND)
      );
    }

    res.send({
      status: httpStatusText.SUCCESS,
      message: "Order retrieved successfully",
      data: order,
    });
  })
);

// Add new Order
router.post(
  "/",
  verifyToken,
  allowedTo(roles.USER),
  asyncWrapper(async (req, res, next) => {
    const orderItemsIds = await Promise.all(
      req.body.orderItems.map(async (orderItem) => {
        const newOrderItem = new OrderItem({
          quantity: orderItem.quantity,
          product: orderItem.product,
        });

        const savedOrderItem = await newOrderItem.save();
        return savedOrderItem._id;
      })
    );

    const totalPrices = await Promise.all(
      orderItemsIds.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate(
          "product",
          "price"
        );
        return orderItem.product.price * orderItem.quantity;
      })
    );

    const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

    const newOrder = new Order({
      orderItems: orderItemsIds,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      status: req.body.status,
      totalPrice,
      user: req.currentUser.id,
    });

    const savedOrder = await newOrder.save();

    if (!savedOrder) {
      return next(
        appError.create("Order cannot be created", 404, httpStatusText.ERROR)
      );
    }
    res.status(201).json({
      status: httpStatusText.SUCCESS,
      message: "Order created",
      data: savedOrder,
    });
  })
);

// Update order status
router.put(
  "/:id",
  verifyToken,
  allowedTo(roles.ADMIN),
  asyncWrapper(async (req, res, next) => {
    const updatedOder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      { new: true }
    );

    if (!updatedOder) {
      return next(
        appError.create("Order not found", 404, httpStatusText.NOT_FOUND)
      );
    }

    res.json({
      status: httpStatusText.SUCCESS,
      message: "Order updated",
      data: updatedOder,
    });
  })
);

// Delete existing category
router.delete(
  "/:id",
  verifyToken,
  allowedTo(roles.ADMIN),
  asyncWrapper(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(
        appError.create("Order not found", 404, httpStatusText.NOT_FOUND)
      );
    }

    order.orderItems.map(async (orderItem) => {
      await OrderItem.findByIdAndDelete(orderItem);
    });

    await Order.findByIdAndDelete(req.params.id);

    res.json({
      status: httpStatusText.SUCCESS,
      message: "Order deleted",
    });
  })
);

// Get total sales
router.get(
  "/get/totalsales",
  verifyToken,
  allowedTo(roles.ADMIN),
  asyncWrapper(async (req, res, next) => {
    const totalSales = await Order.aggregate([
      { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } },
    ]);
    if (!totalSales) {
      return next(
        appError.create(
          "The order sales cannot be generated",
          400,
          httpStatusText.ERROR
        )
      );
    }
    res.json({
      status: httpStatusText.SUCCESS,
      message: "Total sales",
      totalSales: totalSales.pop().totalSales,
    });
  })
);

// Get orders count
router.get(
  "/get/count",
  verifyToken,
  allowedTo(roles.ADMIN),
  asyncWrapper(async (req, res, next) => {
    const ordersCount = await Order.countDocuments();

    if (!ordersCount) {
      return next(
        appError.create("connot get order count", 400, httpStatusText.Error)
      );
    }

    res.json({
      status: httpStatusText.SUCCESS,
      message: "Orders count",
      ordersCount,
    });
  })
);

// Get orders bu user
router.get(
  "/get/userorders/:id",
  verifyToken,
  allowedTo(roles.ADMIN),
  asyncWrapper(async (req, res, next) => {
    const userOrderList = await Order.find({ user: req.params.id })
      .populate({
        path: "orderItems",
        populate: { path: "product", populate: "category" },
      })
      .sort({ dataOrdered: -1 });

    if (!userOrderList || !userOrderList.length) {
      return next(
        appError.create("No orders found", 400, httpStatusText.NOT_FOUND)
      );
    }
    res.json({
      status: httpStatusText.SUCCESS,
      message: "User orders",
      userOrderList,
    });
  })
);

// Get logged user orders
router.get(
  "/get/me/orders",
  verifyToken,
  allowedTo(roles.USER),
  asyncWrapper(async (req, res, next) => {
    const userOrderList = await Order.find({ user: req.currentUser.id })
      .populate({
        path: "orderItems",
        populate: { path: "product", populate: "category" },
      })
      .sort({ dataOrdered: -1 });

    if (!userOrderList || !userOrderList.length) {
      return next(
        appError.create("No orders found", 400, httpStatusText.NOT_FOUND)
      );
    }
    res.json({
      status: httpStatusText.SUCCESS,
      message: "User orders",
      userOrderList,
    });
  })
);

module.exports = router;
