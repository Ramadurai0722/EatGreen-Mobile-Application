const express = require('express');
const router = express.Router();
const favoriteController = require('../Controller/favoriteController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply middleware to all routes
router.use(authMiddleware);

router.post('/add', favoriteController.addToFavorites);
router.get('/', favoriteController.getAllFavorites);
router.delete('/remove', favoriteController.removeFromFavorites);

module.exports = router;
