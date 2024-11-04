import express from 'express';
import cors from 'cors';
import routes from './routes/routes.js';
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const app = express();
const port = process.env.PORT ?? 8080;
app.use(cors());
app.use(routes);
app.use(express.json());

app.listen(port, () => {
    console.log(`App is listening on port ${port}, http://localhost:${port}`);
});
