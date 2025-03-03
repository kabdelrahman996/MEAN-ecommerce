const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("node:path");
const httpStatusText = require("./utils/httpStatusText");
require("dotenv/config");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cors());
app.options("*", cors());

//middleware
app.use(express.json());
app.use(morgan("tiny"));

const api = process.env.API_URL;

//Routes
const categoriesRoutes = require("./routes/categories");
const productsRoutes = require("./routes/products");
const usersRoutes = require("./routes/users");
const ordersRoutes = require("./routes/orders");

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

// Database
mongoose
  .connect(process.env.CONNECTION_URL)
  .then(() => {
    console.log("Successfully Connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

// middleware for not found routes
app.use("*", (req, res, next) => {
  res
    .status(404)
    .json({ status: httpStatusText.Error, message: "Route not found" });
});

app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || httpStatusText.Error,
    message: error.message,
    code: error.statusCode || 500,
    data: null,
  });
});

app.listen(process.env.PORT, () => {
  console.log("Server Is Running On Port: ", process.env.PORT);
});
