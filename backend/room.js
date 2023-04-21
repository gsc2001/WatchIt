// Notes
/*
    Synchronization
    - every 1 sec each client sends its 
    - Every 1 sec server sends the ts map to all the clients
 */
const { Server } = require('socket.io');
class Room {
    constructor(io, roomId) {
        /** @type{Server}*/
        this.io = io;
        this.roomId = roomId;
        this.namespace = '/' + roomId;
        this.video = '';
        this.videoTS = 0;
        this.lastSync = Date.now();
        this.paused = false;
        this.preventTSUpdate = false;

        // list of users
        /**@type{{ clientId:string, socketId:string, name?:string }[]} */
        this.roster = [];

        this.clientIdMap = {};
        this.nameMap = {};
        this.tsMap = {};
        this.tsInterval = setInterval(() => {
            const memberIds = this.roster.map(p => p.id);
            Object.keys(this.tsMap).forEach(key => {
                if (!memberIds.includes(key)) {
                    delete this.tsMap[key];
                    delete this.nameMap[key];
                    delete this.clientIdMap[key];
                }
            });
            if (this.video) {
                this.lastSync = Date.now();
                io.of(roomId).emit('REC:tsMap', this.tsMap);
            }
        }, 1000);

        this.io.of(this.namespace).on('connection', socket => {
            const clientId = socket.handshake.query?.clientId;
            console.log('client joined room: ', this.roomId);
            this.roster.push({ clientId, socketId: socket.id });

            socket.emit('REC:host', this.getState());
            socket.emit('REC:nameMap', this.nameMap);
            socket.emit('REC:tsMap', this.tsMap);
            this.io.of(this.namespace).emit('REC:roster', this.roster);

            socket.on('CMD:host', data => this.host(socket, data));
            socket.on('CMD:ts', data => this.setTimestamp(socket, data));
            socket.on('CMD:play', () => this.playVideo(socket));
            socket.on('CMD:pause', () => this.pauseVideo(socket));
            socket.on('CMD:seek', data => this.seekVideo(socket, data));
            socket.on('CMD:askHost', () => {
                socket.emit('REC:host', this.getState());
            });
            socket.on('CMD:name', data => this.changeUserName(socket, data));
            socket.on('disconnect', () => this.disconnectUser(socket));
        });
    }
    host(socket, data) {
        console.log('Hosting: ', data);
        this.video = data;
        this.videoTS = 0;
        this.paused = false;
        this.tsMap = {};

        this.preventTSUpdate = true;
        setTimeout(() => (this.preventTSUpdate = false), 1000);

        this.io.of(this.namespace).emit('REC:host', this.getState());
        this.io.of(this.namespace).emit('REC:tsMap', this.tsMap);
    }
    playVideo(socket) {
        socket.broadcast.emit('REC:play');
        this.paused = false;
    }
    pauseVideo(socket) {
        socket.broadcast.emit('REC:pause');
        this.paused = true;
    }
    seekVideo(socket, data) {
        this.videoTS = data;
        socket.broadcast.emit('REC:seek', data);
    }

    changeUserName(socket, data) {
        if (!data) {
            return;
        }
        if (data && data.length > 50) {
            return;
        }
        this.nameMap[socket.id] = data;
        this.io.of(this.roomId).emit('REC:nameMap', this.nameMap);
    }
    setTimestamp(socket, data) {
        if (data > this.videoTS) {
            this.videoTS = data;
        }
        if (this.preventTSUpdate) return;

        const timeSinceLastSync = Date.now() - this.lastSync;
        this.tsMap[socket.id] = data - timeSinceLastSync / 1000 + 1;
        console.log('Socket, time', socket.id, ' ', this.tsMap[socket.id]);
    }

    disconnectUser = socket => {
        let index = this.roster.findIndex(user => user.id === socket.id);
        this.roster.splice(index, 1)[0];
        this.io.of(this.roomId).emit('roster', this.roster);
        delete this.tsMap[socket.id];
    };

    getState() {
        return {
            video: this.video,
            videoTS: this.videoTS,
            paused: this.paused,
        };
    }
}

module.exports = Room;
