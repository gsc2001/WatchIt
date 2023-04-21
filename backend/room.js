// Notes
/*
    Synchronization
    - every 1 sec each client sends its 
    - Every 1 sec server sends the ts map to all the clients
 */

const { io } = require('./utils/io');

class Room {
    constructor(roomId) {
        this.roomId = roomId;
        this.namespace = '/' + roomId;
        this.video = '';

        // list of users
        /**@type{{ clientId:string, socketId:string, name?:string }[]} */
        this.roster = [];

        this.clientIdMap = {};

        io.of(this.namespace).on('connection', socket => {
            const clientId = socket.handshake.query?.clientId;
            this.roster.push({ clientId, socketId: socket.id });

            socket.emit('RCV:state', this.getState());
            socket.emit('RCV:roster', this.roster);
        });
    }

    getState() {
        return {
            video: this.video,
        };
    }
}

module.exports = Room;
