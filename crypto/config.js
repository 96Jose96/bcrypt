const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


const secret = crypto.randomBytes(64).toString('hex');
const hashedSecret = bcrypt.hashSync(secret, 10);

function generateToken(user) {
    return jwt.sign({ user: user.id }, secret, { expiresIn: '1h' })
}

module.exports = {
    secret,
    hashedSecret,
    generateToken
}