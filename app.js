require('dotenv').config();
require('express-async-errors');
const express = require('express');
const session = require('express-session');
const app = express();

// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

// swagger
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./');

global.__basedir = __dirname;

var corsOptions = {
  // your server ip address here
  origin: `http://localhost:${process.env.PORT}` || 'http://localhost:3000',
};

// image upload and cloudinary storage hosting
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// connect to database
const { db } = require('./db/furebase');
const authenticatedUser = 1;

// import routers to variables
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const citiesRouter = require('./routes/cities');
const destinationsRouter = require('./routes/destinations');

// error handler
const isAuthenticated = require('./middleware/isAuthenticated');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// extra packages
app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);


// 
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.use(express.json());
app.use(helmet());
app.use(cors(corsOptions));
app.use(xss());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  // cookie: { secure: 'auto' },
}));


// use routers
app.get('/', (req, res) => {
  res.send('<h1>API Services is running.</h1><a href="/api-docs">API Documentation</a>');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/posts', postsRouter);
app.use('/api/v1/cities', citiesRouter);
app.use('/api/v1/destinations', destinationsRouter);

// middleware action
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// listen to port
const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await db;
    app.listen(port, () =>
    console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();