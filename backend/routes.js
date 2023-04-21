const express = require('express');
const { generateRandomCode } = require('./utils/general');
const config = require('./config');
const Room = require('./room');

const router = express.Router();

/** @type{Map<string, Room>} */
const rooms = new Map();

router.get('/ping', async (req, res) => {
    res.json({ success: true, server_time: Date.now() });
});

router.post('/createRoom', async (req, res) => {
    let roomId;
    do {
        roomId = generateRandomCode(config.CODE_LENGTH);
    } while (rooms.has(roomId));

    const room = new Room(roomId);
    rooms.set(roomId, room);

    res.json({ roomId });
});

router.get('/checkRoom/:roomId', async (req, res) => {
    const roomId = req.params.roomId;

    if (rooms.has(roomId)) {
        res.json({ roomId });
    } else {
        res.json({});
    }
});

module.exports = router;
