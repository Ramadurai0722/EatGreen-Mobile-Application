const jwt = require('jsonwebtoken');
const User = require('../Model/user'); 

const authMiddleware = async (req, res, next) => {
    const token = req.headers['auth'] || req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), 'ragasiyam'); 
        req.user = await User.findOne({ email: decoded.email });
        if (!req.user) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};
module.exports = authMiddleware;
