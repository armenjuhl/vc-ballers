const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const fs = require('fs');
var cors = require('cors');

const app = express();


dotenv.config();

mongoose.connect(
    process.env.MONGO_URI,
    {useNewUrlParser: true}
)
    .then(() => console.log('DB CONNECTED'));

mongoose.connection.on('error', err => {
  console.log(`DB connection error: ${err.message}`)
});

const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

const whitelist = ['http://localhost:3000'];

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
  maxAge: 3600,
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
};

var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
};

app.use('/', cors(corsOptions), (req, res, next) => {
  console.log('hit this section');
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept," +
      " content_type, Authorization");
  if (req.method === "OPTIONS") {
    res.header('Access-Control-Allow-Methods', 'GET, PUT, PATCH, POST, DELETE');
    return res.status(200).json({});
  }
  console.log('finished section');
  next();
});
console.log('next');
app.use('/', authRoutes);
app.use('/', postRoutes);
app.use('/', userRoutes);
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({error: "Unauthorized!"});
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`VC Ballers API is listening on port: ${port}`);
});

app.all('/*', cors(corsOptions), function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, content_type");
  next();
});

// app.get('/', cors(corsOptions), function (req, res) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.writeHead(200, {'Content-Type': 'text/plain'});
// contents = fs.readFileSync("sliderImages.json", "utf8");
// console.log(path.join(__dirname, '/sliderImages.json'));
//   res.end(contents);
// });

// apiDocs
app.get('/api', (req, res) => {
  fs.readFile('src/docs/apiDocs.json', (err, data) => {
    if (err) {
      res.status(400).json({
        error: err
      });
    }
    const docs = JSON.parse(data);
    res.json(docs);
  });
});

app.post('/signup', cors(corsOptionsDelegate), function (req, res, next) {
  res.json({msg: "This is CORS-enabled"})
});
