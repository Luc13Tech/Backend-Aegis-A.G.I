require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const validateEnv = require('./src/config/env');
const connectDB = require('./src/config/db');
require('./src/config/cloudinary'); // initialise la config au démarrage

const errorHandler = require('./src/middleware/errorHandler');
const { sanitizeLogs } = require('./src/middleware/sanitizeLogs');
const routes = require('./src/routes');

validateEnv();

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(sanitizeLogs);
app.use(morgan('combined')); // à terme: rediriger vers un logger custom filtrant req.sanitizedBody

app.use('/api', routes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`[server] Aegis A.G.I. backend lancé sur le port ${PORT}`));
});

module.exports = app;
