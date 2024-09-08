const express = require('express')

const app = express()
const session = require('express-session')

const PORT = 3000

app.use(express.urlencoded({ extended: true }));
app.use(express.json());



const router = require('./routes/users');
const verifyToken = require('./middlewares/authMiddleware');
const { secret } = require('./crypto/config')

app.use(
    session({
        secret: secret,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
    })
)

app.use('/', router)
app.use('/login', router)
app.use('/dashboard', verifyToken, router)
app.use('/logout', router)


app.listen(PORT, (req, res) => {
    console.log(`Servidor en: http://localhost:${PORT}`)
})