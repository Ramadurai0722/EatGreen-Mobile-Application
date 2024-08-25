const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    email: { type: String, required: true },
    image: { type: String },
    name: { type: String },
    price: { type: String },
    gram: { type: String },
    quantity: { type: Number, default: 1 }, 
});

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;
