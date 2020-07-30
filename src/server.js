const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// const {MONGO_URI} = require('./.env');
dotenv.config();

mongoose.connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true }
)
    .then(() => console.log('DB CONNECTED'));

mongoose.connection.on('error', err => {
  console.log(`DB connection error: ${err.message}`)
});

const postRoutes = require('./routes/post');

app.use(morgan('dev'));
// app.use(myOwnMiddleware);

app.use('/', postRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`A Node API is listening on port: ${port}`);
});
