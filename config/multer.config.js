const multer = require('multer');

// Configure multer for file storage
const storage = multer.memoryStorage(); // Store files in memory for quick access
const upload = multer({ storage: storage });

module.exports = upload;
