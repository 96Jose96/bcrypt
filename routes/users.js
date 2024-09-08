const express = require('express');
const router = express.Router();
const users = require('../data/users');
const { generateToken } = require('../crypto/config');


router.get('/', (req, res) => {
    if (req.session.token) {
        return res.redirect('/dashboard');
    }
    const loginForm = `
        <form action="/login" method="post">
            <label for="username">Usuario</label>
            <input type="text" id="username" name="username" required><br>
            <label for="password">Contraseña</label>
            <input type="password" id="password" name="password" required><br>
            <button type="submit">Iniciar sesión</button>
        </form>
    `;
    res.send(loginForm);
});


router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        const token = generateToken(user);
        req.session.token = token;
        res.redirect('/dashboard');
    } else {
        res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }
});


router.get('/dashboard', (req, res) => {
    const user = users.find(user => user.id === req.userId);

    if (user) {
        res.send(`
            <h1>Bienvenido, ${user.name}</h1>
            <p>ID: ${user.id}</p>
            <p>Username: ${user.username}</p>
            <a href="/">HOME</a>
            <form action="/logout" method="post">
                <button type="submit">Cerrar Sesión</button>
            </form>
        `);
    } else {
        res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
});


router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ mensaje: 'No se pudo cerrar sesión' });
        }
        res.redirect('/');
    });
});

module.exports = router;