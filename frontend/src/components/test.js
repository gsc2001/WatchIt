import { useEffect, useRef } from 'react';
import { getSocket } from '../utils/socket';

const Test = () => {
    const socketRef = useRef(getSocket('/'));

    useEffect(() => {
        const socket = socketRef.current;
        if (!socket.connected) {
            socket.connect();

            socket.on('connect', () => console.log('hi'));
            socket.on('connect-error', err => {
                console.log(err);
            });




        }
    }, []);
    return <> Hi</>;
};

export default Test;
