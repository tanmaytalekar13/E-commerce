const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",

    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    payment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Payment",
        required: true,
    }

});

module.exports = mongoose.model("Order", orderSchema);