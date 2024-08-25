const express = require('express');
const router = express.Router();
const orderController = require('../Controller/orderControlller');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/add', orderController.createOrder);
router.get('/',authMiddleware, orderController.getOrders);
router.delete('/remove/:id', orderController.cancelOrder);

module.exports = router;
