const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const Razorpay = require("razorpay");

const sequelize = require("../dbconnection");
const initModels = require("../models/init-models");
const models = initModels(sequelize);
const Sequilize = require("sequelize");

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

//initialiaze payment
router.post("/orders", async (req, res) => {
  console.log(req.body);
  try {
    const options = {
      amount: req.body.amount_local * 100,
      currency: "INR",
    };
    const order = await instance.orders.create(options);
    if (!order) return res.status(500).send("Some error Occureed");
    return res.status(200).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

//verify payment
router.post("/success", async (req, res) => {
  try {
    const {
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      amount,
      currency,
    } = req.body;

    const signature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
    signature.update(`${orderCreationId}|${razorpayPaymentId}`);
    const digest = signature.digest("hex");

    if (digest !== razorpaySignature)
      return res.status(400).json({ error: "transaction not valid" });

    const captureResponse = await instance.payments.capture(
      razorpayPaymentId,
      amount,
      currency
    );

    console.log(captureResponse);
    return res.status(200).json({
      status: "success",
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      captureResponse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
});

module.exports = router;
