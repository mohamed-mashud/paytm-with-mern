const express = require("express");
const userRouter = require("./user");
const bankRouter = require("./bank");

const router = express.Router();

router.use("/user", userRouter);
router.use("/bank", bankRouter);

module.exports = router;