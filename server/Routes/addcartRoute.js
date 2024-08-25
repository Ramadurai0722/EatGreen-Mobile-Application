const express = require('express');
const router = express.Router();
const cartController = require('../Controller/addcartController'); 
const authMiddleware = require('../middleware/authMiddleware');

router.post('/add', cartController.addToCart);
router.get('/', authMiddleware, cartController.getAllCartItems);
router.put('/update', authMiddleware,cartController.updateQuantity);
router.delete('/delete', authMiddleware, cartController.deleteCartItems);
router.delete('/deleteid',authMiddleware,cartController.deleteCartItemId),

module.exports = router;
