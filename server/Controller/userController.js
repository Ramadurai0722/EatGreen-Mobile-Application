const User = require('../Model/user'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
      const { name, email, password, mobileNumber, location } = req.body;
      const emailExist = await User.findOne({ email });
      if (emailExist) return res.status(400).json("Email already exists");
  
      const hash = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hash, mobileNumber, location });
      const data = await user.save();
      res.json(data);
    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).json({ error: 'Failed to register. Check server logs.' });
    }
  };
  

  const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await User.findOne({ email });
        if (!userData) return res.status(400).json("Email does not exist");

        const validPsw = await bcrypt.compare(password, userData.password);
        if (!validPsw) return res.status(400).json("Invalid password");

        const userToken = jwt.sign({ email: userData.email }, 'ragasiyam'); 
        res.header('auth', userToken).send(userToken); 
    } catch (err) {
        res.status(400).json(err);
    }
};


const getAllUsers = async (req, res) => {
  jwt.verify(req.token, 'ragasiyam', async (err, decoded) => {
    if (err) return res.sendStatus(403);
    const data = await User.find().select(['-password']);
    res.json(data);
  });
};

const getProfile = async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(403).json({ error: 'Token missing or invalid' });

  try {
      const decoded = jwt.verify(token, 'ragasiyam');
      const user = await User.findOne({ email: decoded.email }).select('-password');
      if (user) {
          res.json(user);
      } else {
          res.status(404).json({ error: 'User not found' });
      }
  } catch (err) {
      res.status(500).json({ error: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(403).json({ error: 'Token missing or invalid' });

  try {
    const decoded = jwt.verify(token, 'ragasiyam');
    const { name, mobileNumber, location } = req.body;
    const user = await User.findOneAndUpdate(
      { email: decoded.email },
      { name, mobileNumber, location },
      { new: true, runValidators: true }
    ).select('-password');

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { register, login, getAllUsers, getProfile,updateProfile };