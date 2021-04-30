require("dotenv").config();
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");


router.get("/", (req, res) => {
  const mongoStatus =
    mongoose.connection.readyState === 1 ? "Connected" : "Unavailable";
  const responseObject = {
    "Application PORT:": process.env.PORT,
    "Mongo DB Status:": mongoStatus,
  };
  res.status(200).json(responseObject).end();
  return;
});

module.exports = router;
