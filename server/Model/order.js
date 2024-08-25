const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userName: String,
    userEmail: String,
    address: String,
    mobileNumber: Number,  
    orderDetails: [
        {
            name: String,
            gram: String,
            quantity: Number,
            itemTotal: String,
        },
    ],
    summaryTotal: String,
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
