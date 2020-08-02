const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');

const app = express();

dotenv.config();

mongoose.connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true }
)
    .then(() => console.log('DB CONNECTED'));

mongoose.connection.on('error', err => {
  console.log(`DB connection error: ${err.message}`)
});

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use('/', postRoutes);
app.use('/', authRoutes);
// app.use(myOwnMiddleware);

app.use('/', postRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`A Node API is listening on port: ${port}`);
});
