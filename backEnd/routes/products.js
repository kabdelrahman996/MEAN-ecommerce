const { Product } = require("../models/product");
const express = require("express");
const { Category } = require("../models/category");
const router = express.Router();
const mongoose = require("mongoose");
const verifyToken = require("../middlewares/verifyToken");
const allowedTo = require("../middlewares/allowedTo");
const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/appError");
const asyncWrapper = require("../middlewares/asyncWrapper");
const roles = require("../utils/roles");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    const baseName = path
      .basename(file.originalname, ext)
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9\-]/g, "")
      .toLowerCase();
    const uniqueSuffix = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;

    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const imageType = file.mimetype.split("/")[0];

  if (imageType == "image") {
    return cb(null, true);
  } else {
    return cb(
      appError.create("The file must be an image", 400, httpStatusText.Error),
      false
    );
  }
};
const upload = multer({ storage: diskStorage, fileFilter });

// Get all products
router.get(
  `/`,
  asyncWrapper(async (req, res, next) => {
    let filter = {};
    if (req.query.categories) {
      filter.category = { $in: req.query.categories.split(",") };
    }
    const products = await Product.find(filter).populate("category");
    if (!products || !products.length) {
      return next(
        appError.create("No products found", 404, httpStatusText.ERROR)
      );
    }
    res.status(200).json({
      status: httpStatusText.SUCCESS,
      message: "Products found",
      data: products,
    });
  })
);

// Get products in specific category
router.get(
  "/specific/:id",
  asyncWrapper(async (req, res, next) => {
    const category = req.params.id;
    const products = await Product.find({ category }).populate("category");
    if (!products || !products.length) {
      return next(
        appError.create(
          "No products found in this category",
          404,
          httpStatusText.ERROR
        )
      );
    }
    res.status(200).json({
      status: httpStatusText.SUCCESS,
      message: "Products found in this category",
      data: products,
    });
  })
);

// Get single product
router.get(
  "/:id",
  asyncWrapper(async (req, res, next) => {
    const selectedProduct = await Product.findById(req.params.id).populate(
      "category"
    );
    if (!selectedProduct) {
      return next(
        appError.create("Product not found", 404, httpStatusText.ERROR)
      );
    }
    res.json({
      status: httpStatusText.SUCCESS,
      message: "Product found",
      data: selectedProduct,
    });
  })
);

// Add new product
router.post(
  "/",
  verifyToken,
  allowedTo(roles.ADMIN),
  upload.array("images", 5),
  asyncWrapper(async (req, res, next) => {
    const category = await Category.findById(req.body.category);
    if (!category) {
      return next(
        appError.create("Category not found", 404, httpStatusText.ERROR)
      );
    }

    const imagePaths = req.files.map((file) => file.filename);

    const newProduct = new Product({
      name: req.body.name,
      description: req.body.description,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
      image: imagePaths[0],
      images: imagePaths,
    });

    const createdProduct = await newProduct.save();
    res.status(201).json({
      status: httpStatusText.SUCCESS,
      message: "Product created",
      data: createdProduct,
    });
  })
);

// Update existing product
router.put(
  "/:id",
  verifyToken,
  allowedTo(roles.ADMIN),
  asyncWrapper(async (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return next(
        appError.create("Invalid product id", 400, httpStatusText.ERROR)
      );
    }

    const category = await Category.findById(req.body.category);
    if (!category) {
      return next(
        appError.create("Category not found", 404, httpStatusText.ERROR)
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return next(
        appError.create("Product not found", 404, httpStatusText.ERROR)
      );
    }

    res.json({
      status: httpStatusText.SUCCESS,
      message: "Product updated",
      data: updatedProduct,
    });
  })
);

// Delete existing product
router.delete(
  "/:id",
  verifyToken,
  allowedTo(roles.ADMIN),
  asyncWrapper(async (req, res, next) => {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return next(
        appError.create("Product not found", 404, httpStatusText.ERROR)
      );
    }
    res.json({
      status: httpStatusText.SUCCESS,
      message: "Product deleted",
      data: deletedProduct,
    });
  })
);

// Get products count
router.get(
  `/get/count`,
  verifyToken,
  allowedTo(roles.ADMIN),
  asyncWrapper(async (req, res, next) => {
    const productsCount = await Product.countDocuments();
    res.json({ status: httpStatusText.SUCCESS, count: productsCount });
  })
);

// Get featured products
router.get(
  `/get/featured/:count`,
  verifyToken,
  asyncWrapper(async (req, res, next) => {
    const count = req.params.count ? parseInt(req.params.count) : 0;
    const featuredProducts = await Product.find({ isFeatured: true }).limit(
      count
    );

    res.json({
      status: httpStatusText.SUCCESS,
      count: featuredProducts.length,
      data: featuredProducts,
    });
  })
);

// Upload product images
router.put(
  "/gallary-images/:id",
  verifyToken,
  allowedTo(roles.ADMIN),
  upload.array("images", 5),
  asyncWrapper(async (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return next(
        appError.create("Invalid product id", 400, httpStatusText.ERROR)
      );
    }

    const files = req.files;
    let imagesPaths = [];
    if (files) {
      files.map((file) => {
        imagesPaths.push(file.filename);
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        images: imagesPaths,
      },
      { new: true }
    );
    if (!product) {
      return next(
        appError.create("Product not found"),
        404,
        httpStatusText.NOT_FOUND
      );
    }

    res.json({
      status: httpStatusText.SUCCESS,
      data: product,
      images: imagesPaths,
    });
  })
);

module.exports = router;
