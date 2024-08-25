const Favorite = require('../Model/favorite');

const addToFavorites = async (req, res) => {
    try {
        const { id, image, name, price, gram, quantity } = req.body;
        const email = req.user.email;

        const existingFavorite = await Favorite.findOne({ id, email });
        if (existingFavorite) {
            return res.status(400).json({ message: 'Item is already in favorites' });
        }

        const newFavorite = new Favorite({
            id,
            email,
            image,
            name,
            price,
            gram,
            quantity, 
        });

        await newFavorite.save();
        res.status(201).json({ message: 'Item added to favorites' });
    } catch (error) {
        console.error('Error adding item to favorites:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllFavorites = async (req, res) => {
    try {
        const userEmail = req.user.email; 
        const favoriteItems = await Favorite.find({ email: userEmail });

        res.status(200).json(favoriteItems);
    } catch (error) {
        console.error('Error fetching favorite items:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const removeFromFavorites = async (req, res) => {
    try {
        const { id, email } = req.body; 

        const result = await Favorite.findOneAndDelete({ id, email });

        if (!result) {
            return res.status(404).json({ message: 'Favorite item not found' });
        }

        res.status(200).json({ message: 'Item removed from favorites' });
    } catch (error) {
        console.error('Error removing item from favorites:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    addToFavorites,
    getAllFavorites,
    removeFromFavorites,
};
