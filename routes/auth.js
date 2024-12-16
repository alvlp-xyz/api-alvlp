// auth.js

import { Router } from 'express';
import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const Auth = Router();
Auth.use(express.json());
Auth.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
}));

// Configure nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Authentication middleware
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
        const user = await User.findById(req.session.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

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


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));

    const userSchema = new mongoose.Schema({
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isVerified: { type: Boolean, default: false },
        verificationToken: { type: String },
        accessToken: { type: String }
    });
    

const User = mongoose.model('User', userSchema);

const validateApiKey = async (req, res, next) => {
    const apiKey = req.query.apikey; // Extract the API key from the query string
    
    if (!apiKey) {
        return res.status(400).json({ message: 'API key is required' });
    }

    try {
        // Search for any user with the matching API key in the `accessToken` field
        const user = await User.findOne({ accessToken: apiKey });
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid API key' });
        }
        
        // Proceed to the next middleware/route handler
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
        const user = await User.findById(req.session.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

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
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            verificationToken,
        });
        await newUser.save();

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
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "User not found" });
        if (!user.isVerified) return res.status(403).json({ message: "Please verify your email first" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        req.session.userId = user._id;

        res.json({ message: "Logged in successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



Auth.get('/verify/:token', async (req, res) => {
    const { token } = req.params;
    try {
        const user = await User.findOne({ verificationToken: token });
        if (!user) return res.status(400).json({ message: "Invalid or expired verification token" });

        user.isVerified = true;
        user.verificationToken = undefined;

        const accessToken = `alvlp-${generateRandomToken(8)}`;
        user.accessToken = accessToken;

        await user.save();

        res.status(200).json({ message: "Email verified successfully!", accessToken });
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
