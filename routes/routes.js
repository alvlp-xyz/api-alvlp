import express from 'express';
import { Router } from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import api from './api.js';
import authModule from './auth.js';

const { Auth, isAuth, validateApiKey } = authModule;

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routes = Router();

routes.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
}));  

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
routes.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});


routes.use('/api/*', validateApiKey);
routes.use('/run/*', isAuth);
routes.use('/auth', Auth);
routes.use('/api/otakudesu/', api);

export default routes;
