const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const userRouter = require('./Routes/userRoute');
app.use('/user', userRouter);

const addcartRoute = require('./Routes/addcartRoute');
app.use('/cart',addcartRoute);

const addToFav = require('./Routes/favoriteRoute');
app.use('/fav',addToFav);

const orderPayload = require('./Routes/orderRoute');
app.use('/orders',orderPayload);

app.listen(5000, () => {
  console.log('Server running on port 5000');
});

const dbPassword = 'ra11092002hul';
const dbURI = 'mongodb+srv://Admin:' + dbPassword + '@cluster0.zr2isau.mongodb.net/eatgreen';

mongoose.connect(dbURI)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error', err);
  });
