const crypto = require('crypto');
const jwt = require('jsonwebtoken');


const secret = crypto.randomBytes(64).toString('hex');


function generateToken(user) {
    return jwt.sign({ userId: user.id }, secret, { expiresIn: '1h' });
}

module.exports = {
    secret,
    generateToken
};