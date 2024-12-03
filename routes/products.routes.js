const express = require('express');
const productController = require('../controllers/product.controller'); // Import productController
const upload = require('../config/multer.config');
const authMiddleware = require('../middlewares/auth.middleware'); // Import authentication middleware

const router = express.Router();

router.use(authMiddleware.isAuthenticated).use(authMiddleware.isSeller);
// POST route to create a product with appropriate middlewares
router.post(
    '/create-product',               // Protect route with authentication
    upload.any(),                  // Handle file uploads
    productController.createProduct // Controller to handle business logic
);

module.exports = router;
