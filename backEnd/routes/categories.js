const { Category } = require("../models/category");
const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const allowedTo = require("../middlewares/allowedTo");
const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/appError");
const asyncWrapper = require("../middlewares/asyncWrapper");
const roles = require("../utils/roles");

// Get all categories
router.get(
  "/",
  asyncWrapper(async (req, res, next) => {
    const categoriesList = await Category.find();
    if (!categoriesList || !categoriesList.length) {
      return next(
        appError.create("No categories found", 404, httpStatusText.ERROR)
      );
    }
    res.json({
      status: httpStatusText.SUCCESS,
      message: "Categories found",
      data: categoriesList,
    });
  })
);

// Get single category
router.get(
  "/:id",
  asyncWrapper(async (req, res, next) => {
    const selectedCategory = await Category.findById(req.params.id);
    if (!selectedCategory) {
      return next(
        appError.create("Category not found", 404, httpStatusText.ERROR)
      );
    }
    res.json({
      status: httpStatusText.SUCCESS,
      message: "Category found",
      data: selectedCategory,
    });
  })
);

// Add new category
router.post(
  "/",
  verifyToken,
  allowedTo(roles.ADMIN),
  asyncWrapper(async (req, res, next) => {
    const newCategory = new Category({
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    });

    const savedCategory = await newCategory.save();
    res.status(201).json({
      status: httpStatusText.SUCCESS,
      message: "Category created",
      data: savedCategory,
    });
  })
);

// Update existing category
router.put(
  "/:id",
  verifyToken,
  allowedTo(roles.ADMIN),
  asyncWrapper(async (req, res, next) => {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
      },
      { new: true }
    );

    if (!updatedCategory) {
      return next(
        appError.create("Category not found", 404, httpStatusText.ERROR)
      );
    }

    res.json({
      status: httpStatusText.SUCCESS,
      message: "Category updated",
      data: updatedCategory,
    });
  })
);

// Delete existing category
router.delete(
  "/:id",
  verifyToken,
  allowedTo(roles.ADMIN),
  asyncWrapper(async (req, res, next) => {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return next(
        appError.create("Category not found", 404, httpStatusText.ERROR)
      );
    }
    res.json({
      status: httpStatusText.SUCCESS,
      message: "Category deleted",
      data: deletedCategory,
    });
  })
);

module.exports = router;
