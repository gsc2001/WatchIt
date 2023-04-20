const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const coreRouter = require('./routes');
const config = require('./config');
const connectDB = require('./utils/db');

const app = express();
const server = http.createServer(app);

const io = new Server(server, { cors: {}, transports: ['websocket'] });

app.use('/', coreRouter);

async function init() {
    await connectDB();
    server.listen(config.PORT, () => {
        console.log('Server started!');
    });
}

init();
