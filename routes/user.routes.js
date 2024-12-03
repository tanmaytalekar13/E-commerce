const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authmiddleware=require("../middlewares/auth.middleware");

router.post("/signup", userController.signup);
router.post("/signin", userController.signin);
router.post("/signout", userController.signout);
router.get("/profile", authmiddleware.isAuthenticated,userController.getProfile);
router.get("/product", authmiddleware.isAuthenticated,userController.getproducts);
router.get("/product/:id", authmiddleware.isAuthenticated,userController.getproduct);
router.get("/order/:id", authmiddleware.isAuthenticated,userController.createorder);
router.get("/verify/:id", authmiddleware.isAuthenticated,userController.verifyPayment);

module.exports = router;