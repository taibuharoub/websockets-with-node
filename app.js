const path = require("path");

const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const connectDB = require("./util/db");
const multerUploads = require("./util/multer");
require("dotenv").config();

connectDB();

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));
app.use(multerUploads);
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/api/v1/feed", feedRoutes);
app.use("/api/v1/auth", authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`.yellow.bold);
});
