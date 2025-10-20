const express = require('express');
const stringRoute = require('./route/stringRoute');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const dotenv = require('dotenv');
dotenv.config({ path: './conf.env' });

const cors = require('cors');
const morgan = require('morgan');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const app = express();

app.use(helmet());
app.use(cors());
app.use(limiter);
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'))
app.use(express.json());

app.use('/strings', stringRoute);
app.use('/', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
