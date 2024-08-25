const Order = require('../Model/order');

exports.createOrder = async (req, res) => {
    try {
        const { userName, userEmail, address,mobileNumber, orderDetails, summaryTotal } = req.body;

        const newOrder = new Order({
            userName,
            userEmail,
            address,
            mobileNumber,
            orderDetails,
            summaryTotal,
        });

        await newOrder.save();

        res.status(200).json({ message: 'Order placed successfully' });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ error: 'Failed to place order' });
    }
};

exports.getOrders = async (req, res) => {
    try {
        console.log('User:', req.user); 
        if (!req.user || !req.user.email) {
            return res.status(400).json({ error: 'User email not found' });
        }

        const orders = await Order.find({ userEmail: req.user.email });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};


exports.cancelOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const deletedOrder = await Order.findByIdAndDelete(orderId);

        if (!deletedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json({ message: 'Order canceled successfully' });
    } catch (error) {
        console.error('Error canceling order:', error);
        res.status(500).json({ error: 'Failed to cancel order' });
    }
};
