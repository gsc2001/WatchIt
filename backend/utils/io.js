const { Server } = require('socket.io');

/** @type {Server} */
var io;

function createIO(server) {
    io = new Server(server, {
        cors: {},
        transports: ['websocket'],
    });
}
function getIO() {
    return io;
}

module.exports = {
    createIO,
    getIO,
};
