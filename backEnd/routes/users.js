const mongoose = require("mongoose");
const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const generateJWT = require("../utils/generate-jwt");
const verifyToken = require("../middlewares/verifyToken");
const allowedTo = require("../middlewares/allowedTo");
const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/appError");
const asyncWrapper = require("../middlewares/asyncWrapper");
const roles = require("../utils/roles");
const multer = require("multer");

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    const fileName = `user-${Date.now()}.${ext}`;
    cb(null, fileName);
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

// Get all users
router.get(
  "/",
  verifyToken,
  allowedTo(roles.ADMIN),
  asyncWrapper(async (req, res, next) => {
    const usersList = await User.find().select("name email phone");
    if (!usersList.length) {
      return next(
        appError.create("Users not found", 404, httpStatusText.ERROR)
      );
    }
    res.json({
      status: httpStatusText.SUCCESS,
      message: "Users Found",
      data: usersList,
    });
  })
);

// Get single user
router.get(
  "/:id",
  verifyToken,
  allowedTo(roles.ADMIN),
  asyncWrapper(async (req, res, next) => {
    const user = await User.findById(req.params.id).select("-passwordHash");
    if (!user) {
      return next(appError.create("No users found", 404, httpStatusText.ERROR));
    }
    res.json({
      status: httpStatusText.SUCCESS,
      message: "User Found",
      data: user,
    });
  })
);

// Add new user
router.post(
  "/register",
  upload.single("avatar"),
  asyncWrapper(async (req, res, next) => {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return next(
        appError.create(
          "This email is already in use",
          400,
          httpStatusText.ERROR
        )
      );
    }

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      color: req.body.color || "",
      passwordHash: await bcrypt.hash(req.body.password, 10),
      phone: req.body.phone,
      isAdmin: req.body.isAdmin || false,
      street: req.body.street || "",
      apartment: req.body.apartment || "",
      zip: req.body.zip || "",
      city: req.body.city || "",
      country: req.body.country || "",
      avatar: req.file ? req.file.filename : "uploads/userAvatar.png",
    });

    const savedUser = await newUser.save();

    const token = generateJWT({
      name: savedUser.name,
      email: savedUser.email,
      id: savedUser._id,
      isAdmin: savedUser.isAdmin,
    });
    res.status(201).json({
      status: httpStatusText.SUCCESS,
      message: "User created",
      data: savedUser,
      token,
    });
  })
);

// Update user profile
router.put(
  "/update/profile",
  verifyToken,
  upload.single("avatar"),
  asyncWrapper(async (req, res, next) => {
    const updates = {
      name: req.body.name,
      email: req.body.email,
      color: req.body.color,
      phone: req.body.phone,
      isAdmin: req.currentUser.isAdmin ? true : false,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    };

    if (req.body.password) {
      updates.passwordHash = await bcrypt.hash(req.body.password, 10);
    }

    if (req.file) {
      updates.avatar = req.file.filename;
    }

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser && existingUser._id.toString() !== req.currentUser.id) {
      return next(
        appError.create(
          "This email is already in use",
          400,
          httpStatusText.ERROR
        )
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.currentUser.id,
      updates,
      { new: true }
    );
    if (!updatedUser) {
      return next(appError.create("User not found", 404, httpStatusText.ERROR));
    }

    res.json({
      status: httpStatusText.SUCCESS,
      message: "User profile updated",
      data: updatedUser,
    });
  })
);

// Login user
router.post(
  "/login",
  asyncWrapper(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(appError.create("User not found", 404, httpStatusText.ERROR));
    }

    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
      const token = generateJWT({
        name: user.name,
        email: user.email,
        id: user._id,
        isAdmin: user.isAdmin,
      });
      res.status(200).json({
        status: httpStatusText.SUCCESS,
        message: "User Authenticated",
        token,
      });
    } else {
      return next(
        appError.create("Invalid password", 401, httpStatusText.ERROR)
      );
    }
  })
);

// Get user profile
router.get(
  "/get/profile",
  verifyToken,
  asyncWrapper(async (req, res, next) => {
    const userProfile = await User.findById(req.currentUser.id).select(
      "-passwordHash"
    );
    if (!userProfile) {
      return next(appError.create("User not found", 404, httpStatusText.ERROR));
    }
    res.json({
      status: httpStatusText.SUCCESS,
      message: "User profile found",
      data: userProfile,
    });
  })
);

// Update user profile
router.put(
  "/update/profile",
  verifyToken,
  asyncWrapper(async (req, res, next) => {
    const updates = {
      name: req.body.name,
      email: req.body.email,
      color: req.body.color,
      phone: req.body.phone,
      isAdmin: req.currentUser.isAdmin ? true : false,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    };

    if (req.body.password) {
      updates.passwordHash = await bcrypt.hash(req.body.password, 10);
    }

    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return next(
        appError.create(
          "This email is already in use",
          400,
          httpStatusText.ERROR
        )
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.currentUser.id,
      updates,
      { new: true }
    );
    if (!updatedUser) {
      return next(appError.create("User not found", 404, httpStatusText.ERROR));
    }

    res.json({
      status: httpStatusText.SUCCESS,
      message: "User profile updated",
      data: updatedUser,
    });
  })
);

// Delete user account
router.delete(
  "/delete/me",
  verifyToken,
  asyncWrapper(async (req, res, next) => {
    const deletedUser = await User.findByIdAndDelete(req.currentUser.id);
    if (!deletedUser) {
      return next(appError.create("User not found", 404, httpStatusText.ERROR));
    }
    res.json({
      status: httpStatusText.SUCCESS,
      message: "User account deleted",
      data: deletedUser,
    });
  })
);

// Get users count
router.get(
  `/get/count`,
  verifyToken,
  allowedTo(roles.ADMIN),
  asyncWrapper(async (req, res, next) => {
    const usersCount = await User.countDocuments();
    res.json({ status: httpStatusText.SUCCESS, count: usersCount });
  })
);

module.exports = router;
