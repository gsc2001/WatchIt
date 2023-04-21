import axios from 'axios';
import { serverPath } from './index';

const generateRandomCode = (len: number) => {
    const chars = '0123456789';
    let randomCode = '';
    for (let i = 0; i < len; i++)
        randomCode += chars[Math.floor(Math.random() * chars.length)];
    return randomCode;
};

export async function generateName(): Promise<string> {
    return generateRandomCode(6);
}
