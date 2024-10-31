import { Router } from 'express';
import api from './api.js';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; 
const routes = Router();
const telegramToken = '7022249930:AAGP_YfSnRP2RU6VKi6Q5eH7QWY6gFgfTpE';
const chatId = '5552981426';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ipFilePath = path.join(__dirname, 'ip-logs.json');

const readIpAddresses = () => {
    if (!fs.existsSync(ipFilePath)) {
        fs.writeFileSync(ipFilePath, JSON.stringify([]));
    }
    const data = fs.readFileSync(ipFilePath);
    return JSON.parse(data);
};

const writeIpAddresses = (ipAddresses) => {
    fs.writeFileSync(ipFilePath, JSON.stringify(ipAddresses));
};

const sendTelegramNotification = async (ip) => {
    const message = `New IP Address logged: ${ip}`;

    try {
        await axios.post(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
            chat_id: chatId,
            text: message,
        });
    } catch (error) {
        console.error('Error sending Telegram notification:', error);
    }
};

const logIpMiddleware = async (req, res, next) => {
    const ipAddress = req.ip;
    const ipAddresses = readIpAddresses();
    if (!ipAddresses.includes(ipAddress)) {
        await sendTelegramNotification(ipAddress);
        ipAddresses.push(ipAddress);
        writeIpAddresses(ipAddresses);
    }

    next();
};

routes.use(logIpMiddleware);
routes.get('/', (_, res) => res.status(200).json({ status: 'Ok' }));
routes.use('/v2/otakudesu', api);
routes.use((_, res) => 
    res.status(404).json({ status: 'Error', message: 'There\'s nothing here, only cricket.' })
);

export default routes;
