const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors(
  allowlist = ['http://localhost:3000', 'http://localhost:3001']
));
app.use(express.json());
app.use(morgan('dev'));

// Basic health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend is running' });
});

const serviceRoutes = require('./routes/serviceRoutes');
const dependencyRoutes = require('./routes/dependencyRoutes');
const simulationRoutes = require('./routes/simulationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Main routes will be mounted here
app.use('/api/services', serviceRoutes);
app.use('/api/dependencies', dependencyRoutes);
app.use('/api/simulations', simulationRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
