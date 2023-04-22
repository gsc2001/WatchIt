// Notes
/*
    Synchronization
    - every 1 sec each client sends its 
    - Every 1 sec server sends the ts map to all the clients
 */
const { Server } = require('socket.io');
class Room {
    constructor(io, roomId, passcode = '') {
        /** @type{Server}*/
        this.io = io;
        this.roomId = roomId;
        this.namespace = '/' + roomId;
        this.video = '';
        this.videoTS = 0;
        this.lastSync = Date.now();
        this.paused = false;
        this.preventTSUpdate = false;
        this.passcode = passcode;

        this.chatMsgs = [];

        // list of users
        /**@type{{ clientId:string, socketId:string, id: }[]} */
        this.roster = [];

        this.avatarIdMap = {};
        this.nameMap = {};
        this.tsMap = {};
        this.syncInterval = setInterval(() => {
            const memberIds = this.roster.map(p => p.socketId);
            Object.keys(this.tsMap).forEach(key => {
                if (!memberIds.includes(key)) {
                    delete this.tsMap[key];
                    delete this.nameMap[key];
                    delete this.avatarIdMap[key];
                }
            });
            if (this.video && Object.values(this.tsMap).length > 0) {
                console.log(this.tsMap);
                this.videoTS = Math.max(...Object.values(this.tsMap));
                console.log('syncing', this.videoTS);
                this.lastSync = Date.now();
                io.of(roomId).emit('REC:leaderTime', this.videoTS);
            }
        }, 1000);

        this.io.of(this.namespace).use(async (socket, next) => {
            const passcode = socket.handshake.query?.passcode;
            console.log('checking passcode', passcode, this.passcode);
            if (this.passcode !== '' && passcode !== this.passcode) {
                next(new Error('not authorized'));
                return;
            }
            next();
        });

        this.io.of(this.namespace).on('connection', socket => {
            const clientId = socket.handshake.query?.clientId;
            console.log('client joined room: ', this.roomId, socket.id);
            this.avatarIdMap[socket.id] = Math.floor(Math.random() * 20);
            for (var i = 0; i < 20; i++) {
                if (!(i in Object.values(this.avatarIdMap))) {
                    this.avatarIdMap[socket.id] = i;
                    break;
                }
            }
            this.roster.push({ clientId, socketId: socket.id });
            this.tsMap[socket.id] = this.videoTS;
            socket.emit('REC:host', this.getState());
            socket.emit('REC:leaderTime', this.videoTS);
            socket.emit('REC:chatinit', this.chatMsgs);
            this.io.of(this.namespace).emit('REC:roster', this.roster);

            socket.on('CMD:host', data => this.host(socket, data));
            socket.on('CMD:ts', data => this.setTimestamp(socket, data));
            socket.on('CMD:play', () => this.playVideo(socket));
            socket.on('CMD:pause', () => this.pauseVideo(socket));
            socket.on('CMD:seek', data => this.seekVideo(socket, data));
            socket.on('CMD:chat', data => this.sendChatMessage(socket, data));
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
        this.io.of(this.namespace).emit('REC:leaderTime', this.videoTS);
    }
    addChatMessage(chatMsg) {
        this.chatMsgs.push(chatMsg);
        this.io.of(this.namespace).emit('REC:chatMsg', chatMsg);
    }

    sendChatMessage(socket, message) {
        console.log('got chat message', message);
        const chatMsg = {
            senderName: this.nameMap[socket.id],
            avatarId: this.avatarIdMap[socket.id],
            cmd: '',
            msg: message,
            timestamp: new Date().toISOString(),
        };
        this.addChatMessage(chatMsg);
    }
    playVideo(socket) {
        socket.broadcast.emit('REC:play');
        this.paused = false;
        const chatMsg = {
            senderName: this.nameMap[socket.id],
            avatarId: this.avatarIdMap[socket.id],
            cmd: 'play',
            msg: this.tsMap[socket.id].toString(),
            timestamp: new Date().toISOString(),
        };
        this.addChatMessage(chatMsg);
    }
    pauseVideo(socket) {
        socket.broadcast.emit('REC:pause');
        this.paused = true;
        const chatMsg = {
            senderName: this.nameMap[socket.id],
            avatarId: this.avatarIdMap[socket.id],
            cmd: 'pause',
            msg: this.tsMap[socket.id].toString(),
            timestamp: new Date().toISOString(),
        };
        this.addChatMessage(chatMsg);
    }
    seekVideo(socket, data) {
        this.videoTS = data;
        socket.broadcast.emit('REC:seek', data);
        const chatMsg = {
            senderName: this.nameMap[socket.id],
            avatarId: this.avatarIdMap[socket.id],
            cmd: 'seek',
            msg: data.toString(),
            timestamp: new Date().toISOString(),
        };
        this.addChatMessage(chatMsg);
    }

    changeUserName(socket, data) {
        if (!data) {
            return;
        }
        if (data && data.length > 50) {
            return;
        }
        let sendJoinedMessage = false;
        if (!(socket.id in this.nameMap)) {
            sendJoinedMessage = true;
        }

        this.nameMap[socket.id] = data;

        if (sendJoinedMessage) {
            const chatMsg = {
                senderName: this.nameMap[socket.id],
                avatarId: this.avatarIdMap[socket.id],
                msg: this.nameMap[socket.id],
                cmd: 'join',
                timestamp: new Date().toISOString(),
            };
            this.addChatMessage(chatMsg);
        }
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
        if (socket.id in this.nameMap) {
            const chatMsg = {
                senderName: this.nameMap[socket.id],
                avatarId: this.avatarIdMap[socket.id],
                msg: this.nameMap[socket.id],
                cmd: 'left',
                timestamp: new Date().toISOString(),
            };
            this.addChatMessage(chatMsg);
        }
        let index = this.roster.findIndex(user => user.socketId === socket.id);
        this.roster.splice(index, 1)[0];
        console.log('disconnected', socket.id);
        this.io.of(this.roomId).emit('roster', this.roster);
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
