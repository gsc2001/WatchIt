import axios from 'axios';
import { serverPath } from './index';

export const generateName = async (len: number = 6): Promise<string> => {
    const chars = '0123456789';
    let randomCode = '';
    for (let i = 0; i < len; i++)
        randomCode += chars[Math.floor(Math.random() * chars.length)];
    return randomCode;
};
