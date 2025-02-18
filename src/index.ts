// filepath: /typescript-node-project/typescript-node-project/src/index.ts

import express from 'express';
import { config } from './config';
// import { someMiddleware } from './utils';

const app = express();

// Middleware setup
// app.use(someMiddleware);

// Application routes and configurations
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start the server
const PORT = config.port || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});