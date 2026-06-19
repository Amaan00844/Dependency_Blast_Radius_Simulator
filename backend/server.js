require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const connectDB = require('./src/config/db');
// const initSockets = require('./src/sockets');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Initialize SSE or WebSockets later if needed on server level
// initSockets(server);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}).catch(err => {
  console.error('Database connection failed', err);
});
