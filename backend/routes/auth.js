/* Auth.js
Alfie Staunton
03.07.26
*/

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

//route - user registration
router.post('/register', async (req, res) => {
    const { username, email, password} =req.body;

    try {
        //check if user email or username already in system
        const[existingUser] = await db.query('SELECT * FROM users WHERE email = ? OR username = ?', [email, username]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Username or Email already registered.' });
        }

        //securely hash password before saving to database
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        //add new user to database
        await db.query(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            [username, email, passwordHash]
        );

        res.status(201).json({ message: 'User registered successfully!'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Registration failed due to server error.'});
    }
});

//route - user login
router.post('/login', async (req, res) => {
    const { email, password} = req.body;

    try {
        //verify user exists by checking email
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ error: 'Invalid Email or Password.' });
        }

        const user = users[0];

        console.log("X-RAY VISION - Database returned:", user);

        //compare password input to password in database
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if(!isMatch) {
            return res.status(400).json({ error: 'Invalid Email or Password.' });
        }

        // generate secure jwt token containing user ID
        const token = jwt.sign({ id: user.id},  process.env.JWT_SECRET, {expiresIn: '24h'});

        //send token and user info bck to client app
        res.json({
            token,
            user: {id: user.id, username: user.username, email: user.email }
        });

    } catch (error) {
        console.error(error);
         res.status(500).json({ error: 'Login failed due to server error.'});

    }
});
 module.exports = router;