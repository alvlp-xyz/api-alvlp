
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
}); 
+
const isAuth = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    res.status(401).json({ message: "Unauthorized. Please log in." });
};

function generateRandomToken(length) {
    return crypto.randomBytes(length).toString('hex').substring(0, length);
}