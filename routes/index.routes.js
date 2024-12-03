const express = require('express');
const router = express.Router();

// Define your routes here
router.get('/', (req, res) => {
    res.status(200).json({ message: "Welcome to the API" });
});

module.exports = router;  // Export the router
