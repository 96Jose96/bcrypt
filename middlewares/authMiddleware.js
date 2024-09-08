const jwt = require('jsonwebtoken')
const { secret } = require('../crypto/config')


function verifyToken(req, res, next) {
    const token = req.session.token
    if(!token) {
        return res.status(401),json({ mensaje: 'Token no generado' })
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ mensaje: 'Token inválido' })
        }
        req.user = decoded.user
        next()
    })
}

module.exports = verifyToken