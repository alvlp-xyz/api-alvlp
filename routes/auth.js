import { Router } from 'express';
import express from 'express';
import session from 'express-session';
import admin from 'firebase-admin';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();


const Auth = Router();
Auth.use(express.json());
Auth.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
}));

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const isAuth = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    res.status(401).json({ message: "Unauthorized. Please log in." });
};

const isToken = async (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    try {
        const userDoc = await db.collection('users').doc(req.session.userId).get();
        if (!userDoc.exists) return res.status(404).json({ message: "User not found" });

        const user = userDoc.data();
        req.accessToken = user.accessToken;
        req.isVerified = user.isVerified;
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

function generateRandomToken(length) {
    return crypto.randomBytes(length).toString('hex').substring(0, length);
}

const validateApiKey = async (req, res, next) => {
    const apiKey = req.query.apikey;

    if (!apiKey) {
        return res.status(400).json({ message: 'API key is required' });
    }

    try {
        const userQuery = await db.collection('users').where('accessToken', '==', apiKey).get();

        if (userQuery.empty) {
            return res.status(401).json({ message: 'Invalid API key' });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

Auth.get('/profile', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    try {
        const userDoc = await db.collection('users').doc(req.session.userId).get();
        if (!userDoc.exists) return res.status(404).json({ message: "User not found" });

        const user = userDoc.data();
        res.json({
            username: user.username,
            email: user.email,
            accessToken: user.accessToken,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

Auth.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const userQuery = await db.collection('users').where('email', '==', email).get();
        if (!userQuery.empty) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');

        const newUser = {
            username,
            email,
            password: hashedPassword,
            isVerified: false,
            verificationToken,
        };

        const userRef = db.collection('users').doc();
        await userRef.set(newUser);

        const verificationLink = `http://localhost:5000/verify.html?token=${verificationToken}`;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Email Verification',
            text: `Please verify your email by clicking on the following link: ${verificationLink}`,
        });

        res.status(201).json({ message: "User registered successfully. Please check your email to verify your account." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

Auth.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userQuery = await db.collection('users').where('username', '==', username).get();
        if (userQuery.empty) return res.status(400).json({ message: "User not found" });

        const user = userQuery.docs[0].data();
        if (!user.isVerified) return res.status(403).json({ message: "Please verify your email first" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        req.session.userId = userQuery.docs[0].id;

        res.json({ message: "Logged in successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

Auth.get('/verify/:token', async (req, res) => {
    const { token } = req.params;
    try {
        const userQuery = await db.collection('users').where('verificationToken', '==', token).get();
        if (userQuery.empty) return res.status(400).json({ message: "Invalid or expired verification token" });

        const userDoc = userQuery.docs[0];
        const user = userDoc.data();

        await userDoc.ref.update({
            isVerified: true,
            verificationToken: admin.firestore.FieldValue.delete(),
            accessToken: `alvlp-${generateRandomToken(8)}`,
        });

        res.status(200).json({ message: "Email verified successfully!", accessToken: user.accessToken });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

Auth.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: "Could not log out. Please try again." });
        res.clearCookie('connect.sid');
        res.json({ message: "Logged out successfully" });
    });
});

Auth.get('/verify.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'verify.html'));
});

export default {
    validateApiKey,
    Auth,
    isAuth,
    transporter,
    isToken
};
