const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    id:{type:Number,require:true},
    email: { type: String, required: true },
    image: { type: String},
    name: { type: String, required: true },
    price: { type: String, required: true },
    quantity: { type: Number, required: true },
    gram: { type: String, required: true },
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
