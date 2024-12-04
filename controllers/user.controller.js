const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const BlacklistModel = require("../models/blacklist.model");
const productModel = require("../models/product.model");
const Razorpay = require("razorpay");
const paymentModel = require("../models/payment.model");
const orderModel = require("../models/order.model");

var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
module.exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the user already exists
    const isUserExist = await UserModel.findOne({ email });
    if (isUserExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const user = new UserModel({ name, email, password: hashedPassword, role });
    await user.save(); // Ensure the user is saved to the database before generating the token

    // Generate JWT token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send success response with user data and token
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error(error); // More detailed error logging
    next(error); // Pass the error to the error-handling middleware
  }
};
module.exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res
      .status(200)
      .json({
        message: "User logged in successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
  } catch (error) {}
};
module.exports.signout = async (req, res, next) => {
  try {
    // पहले चेक करें कि authorization हेडर मौजूद है
    if (!req.headers.authorization) {
      return res
        .status(401)
        .json({ message: "Authorization header is missing" });
    }

    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const isTokenBlacklisted = await BlacklistModel.findOne({ token });
    if (isTokenBlacklisted) {
      return res.status(400).json({ message: "Token is blacklisted" });
    }

    await BlacklistModel.create({ token });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports.getProfile = async (req, res) => {
  try {
    const user = await UserModel.findOne(req.user._id);
    res.status(200).json({ user });
  } catch (error) {}
};
module.exports.getproducts = async (req, res, next) => {
  try {
    const product = await productModel.find({});
    res.status(200).json({ product });
  } catch (error) {
    console.log(error);
  }
};
module.exports.getproduct = async (req, res, next) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ product });
  } catch (error) {
    res.send(error);
  }
};
module.exports.createorder = async (req, res, next) => {
  try {
    const product = await productModel.findById(req.params.id);

    const option = {
      amount: product.price * 100,
      currency: "INR",
      receipt: req.user._id,
      payment_capture: 1,
    };
    const order = await instant.orders.create(option);
    res.status(200).json({ order });
    const payment = await paymentModel.create({
      order_id: order.id,
      amount: product.price,
      currency: "INR",
      status: "pending",
    });
  } catch (error) {
    next(error);
  }
};
module.exports.verifyPayment = async (req, res, next) => {
  try {
    const { paymentId, orderId, signature } = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const {
      validatePaymentVerification,
    } = require("../node_modules/razorpay/dist/utils/razorpay-utils");

    const isValid = validatePaymentVerification(
      { order_id: razorpayOrderId, payment_id: razorpayPaymentId },
      signature,
      secret
    );
    if (isValid) {
        const payment=await paymentModel.findOne({
            order_id: orderId
        })
        payment.payemntId=paymentId,
        payment.signature=signature,
        payment.status="success",
        payment.save()
        res.status(200).json({ message: "Payment successful" });
    }
    else{
        const payment=await paymentModel.findOne({
            order_id: orderId
        })
        payment.status="failed",
        res.status(400).json({
            message: "Payment failed"
        })
    }
  } catch (error) {
    next(error);
  }
};
