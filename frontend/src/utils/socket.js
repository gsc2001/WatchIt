import { io } from 'socket.io-client';
import config from '../config';

export const getSocket = path => {
    var sock = io(config.serverBaseURL + path, {
        transports: ['websocket'],
        autoConnect: false,
    });
    return sock;
};
