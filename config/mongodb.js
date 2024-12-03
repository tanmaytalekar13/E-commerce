const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        console.error(error); // Log the full error object for more details
        process.exit(1); // Exit the process with a failure code
    }
};


module.exports = connectDB;
