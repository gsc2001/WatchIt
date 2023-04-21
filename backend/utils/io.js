const { Server } = require('socket.io');

/** @type {Server} */
let io;

function createIO(server) {
    io = new Server(server, { cors: {}, transports: ['websocket'] });
}

module.exports = {
    createIO,
    io,
};
