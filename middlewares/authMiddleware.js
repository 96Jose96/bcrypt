const jwt = require('jsonwebtoken');
const secret = require('../crypto/config');

function verifyToken(req, res, next) {
  const token = req.session.token;

  if (!token) {
    return res.status(403).json({ message: 'Token no proporcionado' });
  }

  const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
}

module.exports = verifyToken;
