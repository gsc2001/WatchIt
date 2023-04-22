const express = require('express');
const http = require('http');
const config = require('./config');
const connectDB = require('./utils/db');
const Room = require('./room');
const { Server } = require('socket.io');
const { generateRandomCode } = require('./utils/general');

const app = express();
const server = http.createServer(app);

const io = new Server(server, { transports: ['websocket'] });
io.on('connection', socket => {
    console.log('connected', socket.id);
});
io.on('disconnect', socket => {
    console.log('disconnected', socket.id);
});

const rooms = new Map();
rooms.set('010230', new Room(io, '010230'));

app.get('/ping', async (req, res) => {
    res.json({ success: true, server_time: Date.now() });
});

app.post('/createRoom', async (req, res) => {
    let roomId;

    do {
        roomId = generateRandomCode(config.CODE_LENGTH);
    } while (rooms.has(roomId));

    const room = new Room(io, roomId);
    rooms.set(roomId, room);
    console.log('Created room: ', roomId);

    res.json({ name: roomId });
});

app.get('/checkRoom/:roomId', async (req, res) => {
    const roomId = req.params.roomId;

    if (rooms.has(roomId)) {
        res.json({ roomId });
    } else {
        res.json({});
    }
});

async function init() {
    // await connectDB();
    server.listen(config.PORT, () => {
        console.log('Server started!');
    });
}

init();
