const express = require('express');
const jwt = require('jsonwebtoken');
const { secret } = require('../crypto/config');
const users = require('../data/users');
const verifyToken = require('../middlewares/authMiddleware');

const router = express.Router();


router.get('/', (req, res) => {
  const token = req.session.token;

  // Si ya hay un token
  if (token) {
    const decoded = jwt.verify(token, secret);

    return res.send(`
        <h1>Bienvenido, ${decoded.name}</h1>
        <a href="/dashboard">Ir al Dashboard</a><br><br>
        <form action="/logout" method="post">
            <button type="submit">Cerrar Sesión</button>
        </form>
    `)
  }

  //Si no hay token    
  const loginForm = `
    <h1>Iniciar Sesión</h1>
    <form action="/login" method="post">
        <label for="username">Usuario</label>
        <input type="text" id="username" name="username" required><br><br>
        <label for="password">Contraseña</label>
        <input type="password" id="password" name="password" required><br><br>
        <button type="submit">Iniciar sesión</button>
    </form>
  `;
  res.send(loginForm);
});


router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username && user.password === password);

  if (!user) {
    return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
  }

  
  const token = jwt.sign({ id: user.id }, secret, { expiresIn: '1h' });
  req.session.token = token;

  res.redirect('/dashboard');
});


router.get('/dashboard', verifyToken, (req, res) => {
  const userId = req.user.id;
  const user = users.find(user => user.id === userId);

  if (user) {
    res.send(`
      <h1>Bienvenido, ${user.name}</h1>
      <p>ID: ${user.id}</p>
      <p>Username: ${user.username}</p>
      <a href="/">HOME</a><br><br>
      <form action="/logout" method="post">
          <button type="submit">Cerrar Sesión</button>
      </form>
    `);
  } else {
    res.status(401).json({ mensaje: 'Usuario no encontrado' });
  }
});


router.post('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
});

module.exports = router;
