const jwt = require('jsonwebtoken');
const users = require("../../database/models").user;

const jwtSecretKey = process.env.JWT_SECRET_KEY;

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecretKey);
        console.log('Decoded Token:', decoded);

        const user = await users.findByPk(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: 'User not found, authorization denied' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(403).json({ message: 'Token is not valid' });
    }
};

module.exports = authenticateToken;