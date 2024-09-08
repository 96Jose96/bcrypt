const express = require('express');
const session = require('express-session');
const { secret } = require('./crypto/config');
const verifyToken = require('./middlewares/authMiddleware');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(
    session({
        secret: secret,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
    })
);

const router = require('./routes/users');

app.use('/', router);
app.use('/login', router);
app.use('/dashboard', verifyToken, router);
app.use('/logout', router);

app.listen(PORT, () => {
    console.log(`Servidor en: http://localhost:${PORT}`);
});