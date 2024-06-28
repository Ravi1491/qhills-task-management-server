const express = require("express");
const router = express.Router();
const users = require("../../database/models").user;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const jwtSecretKey = process.env.JWT_SECRET_KEY;

function validatePhoneNumber(phonenumber) {
    const regex = /^\d{10}$/;
    return regex.test(phonenumber);
}

function validatePassword(password) {
    const regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;
    return regex.test(password);
}

router.post('/login', async (req, res) => {
    try {
        const { phonenumber, password, name } = req.body;

        if (!validatePhoneNumber(phonenumber)) {
            return res.status(400).json({
                message: 'Phone number must be exactly 10 digits long.',
            });
        }

        if (!validatePassword(password)) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters long, contain at least one special character, and one digit.',
            });
        }

        const existingUser = await users.findOne({
            where: { phonenumber }
        });

        if (!existingUser) {
            return res.status(401).json({ message: 'User does not exist' });
        }

        const passwordMatch = await bcrypt.compare(password, existingUser.hashedPassword);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        const payload = { userId: existingUser.id };
        const token = jwt.sign(payload, jwtSecretKey, { expiresIn: '8h' });

        return res.status(200).json({ token, message: 'Logged in successfully' });

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;