import express from 'express';
import { Router } from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import api from './api.js';
// routes.js
import authModule from './auth.js';
const { Auth, isAuth, transporter } = authModule;

dotenv.config();
// Get the directory path for the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routes = Router();

// Session setup
routes.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
  }),
  cookie: { secure: false }, // Set to true if using HTTPS
}));

/*
routes.get('/', (_, res) => 
  res.status(200).json({ status: 'Ok', otakudesu: '/otakudesu', samehadaku: '/samehadaku' })
);
*/

routes.use('/api/*', isAuth);
routes.use('/auth', Auth);
routes.use('/api/otakudesu', api);






routes.use(express.static(path.join(__dirname, '../public')));

routes.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

routes.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});
routes.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/profile.html'));
});
routes.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/register.html'));
});

export default routes;

