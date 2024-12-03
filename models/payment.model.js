const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    },
    payemntId:{
        type: String,
        required: true,
    },
    signature:{
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
    },
}, {timestamps: true});

module.exports = mongoose.model("Payment", paymentSchema);
