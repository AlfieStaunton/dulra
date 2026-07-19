/* sites.js
Alfie Staunton
10.07.26
*/

const express = require("express");
const router = express.Router();
const db = require("../config/db");
const jwt = require("jsonwebtoken");

//verify token middleware
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error:'No token provided' });

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Failed to authenticate token' });
        req.userId = decoded.id;
        next();
    });
};
    //load existing sites when Onboarding page is loaded
    router.get('/', verifyToken, async (req, res) => {
        const userId = req.userId;

        try {
            //make sure database works with React
            const query = `
            SELECT
            id,
            site_name as name,
            latitude,
            longitude,
            CONCAT(latitude, ',', longitude) as location
            FROM sites
            WHERE user_id = ?
            `;
            const [sites] = await db.promise().query(query, [userId]);

            res.status(200).json(sites );
        } catch (error) {
            console.error('Database error:', error);
            res.status(500).json({ error: 'Failed to load survey sites' });
        }
    });

    //add new site
    router.post('/', verifyToken, async (req, res) => {
        const {site_name, latitude, longitude} = req.body;
        const userId = req.userId;

        if (!site_name || latitude=== undefined || longitude=== undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        try {
            const query = `
            INSERT INTO sites (user_id, site_name, latitude, longitude)
            VALUES (?, ?, ?, ?)
            `;
            const [result] = await db.promise().query(query, [userId, site_name, latitude, longitude]);

            res.status(201).json({ message: 'Site added successfully',
                siteId: result.insertId
             });

        } catch (error) {
            console.error('Database error:', error);
            res.status(500).json({ error: 'Failed to add survey site' });
        }
    });

    //remove a site
    router.delete('/:id', verifyToken, async (req, res) => {
        const siteId = req.params.id;
        const userId = req.userId;

        try {
            const query = `
            DELETE FROM sites
            WHERE id = ? AND user_id = ?
            `;
            await db.promise().query(query, [siteId, userId]);

            res.status(200).json({ message: 'Site deleted successfully' });
        } catch (error) {
            console.error('Database error:', error);
            res.status(500).json({ error: 'Failed to delete survey site' });
        }
    });

module.exports = router;
