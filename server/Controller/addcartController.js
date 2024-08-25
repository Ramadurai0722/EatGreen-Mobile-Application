const mongoose = require('mongoose');
const Cart = require('../Model/addcart'); 

const addToCart = async (req, res) => {
    try {
        const { id, email, image, name, price, quantity, gram } = req.body;
        
        const newCartItem = new Cart({
            id,
            email,
            image,
            name,
            price,
            quantity,
            gram,
        });

        await newCartItem.save();
        res.status(201).send('Item added to cart');
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).send('Server error');
    }
};

const getAllCartItems = async (req, res) => {
    try {
        const userEmail = req.user.email; 
        const cartItems = await Cart.find({ email: userEmail });

        res.status(200).json(cartItems);
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateQuantity = async (req, res) => {
    try {
        const { id, email, quantity } = req.body;
        const updatedItem = await Cart.findOneAndUpdate(
            { id, email },
            { $set: { quantity } },
            { new: true }
        );

        if (!updatedItem) {
            return res.status(404).send('Item not found');
        }

        res.status(200).json(updatedItem);
    } catch (error) {
        console.error('Error updating item quantity:', error);
        res.status(500).send('Server error');
    }
};

const deleteCartItems = async (req, res) => {
    try {
        const { ids, email } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).send('No items selected for deletion');
        }

        const result = await Cart.deleteMany({ id: { $in: ids }, email });

        if (result.deletedCount === 0) {
            return res.status(404).send('No items found to delete');
        }

        res.status(200).send('Selected items deleted from cart');
    } catch (error) {
        console.error('Error deleting items from cart:', error);
        res.status(500).send('Server error');
    }
};

const deleteCartItemId = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).send('No items selected for deletion');
        }

        // Create ObjectId instances using the `new` keyword
        const objectIds = ids.map(id => new mongoose.Types.ObjectId(id));

        const result = await Cart.deleteMany({ _id: { $in: objectIds } });

        if (result.deletedCount === 0) {
            return res.status(404).send('No items found to delete');
        }

        res.status(200).send('Selected items deleted from cart');
    } catch (error) {
        console.error('Error deleting items from cart:', error);
        res.status(500).send('Server error');
    }
};


module.exports = {
    addToCart,
    getAllCartItems,
    updateQuantity,
    deleteCartItems, 
    deleteCartItemId,
};
