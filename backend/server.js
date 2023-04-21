const express = require('express');
const http = require('http');
const coreRouter = require('./routes');
const config = require('./config');
const connectDB = require('./utils/db');
const { createIO } = require('./utils/io');

const app = express();
const server = http.createServer(app);

app.use('/', coreRouter);

async function init() {
    createIO();
    await connectDB();
    server.listen(config.PORT, () => {
        console.log('Server started!');
    });
}

init();
