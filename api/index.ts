// This file must be in the /api folder for Vercel to detect it as a serverless function

import http from 'http';

import express from 'express';

import { userRouter } from '../server/users/router.js';

const app = express();

// Set the port
app.set('port', process.env.PORT || 8080);

// Parse incoming requests with JSON payloads ('content-type: application/json' in header)
app.use(express.json());

// Parse incoming requests with urlencoded payloads ('content-type: application/x-www-form-urlencoded' in header
app.use(express.urlencoded({ extended: false }));

app.use(express.static(process.cwd() + '/dist')); // node will serve our application's built static files

// Add routers from routes folder
app.use('/api/users', userRouter);

app.use('/api*', (_req, res) => {
  res.status(404).json({
    error: 'page not found',
  });
});

// Catch all the other routes and send them to client side
app.all('*', (_req, res) => {
  res.sendFile(process.cwd() + '/dist/index.html');
});

// Create server to listen to request at specified port
const server = http.createServer(app);
server.listen(app.get('port'), () => {
  console.log(`Express server running at http://localhost:${app.get('port')}`);
});
