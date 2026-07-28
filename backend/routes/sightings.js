/* sightings.js
Alfie Staunton
27.07.26
*/

const express = require("express");
const router = express.Router();
const db = require("../config/db");
const jwt = require("jsonwebtoken");

//verify token middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(
    token,
    process.env.JWT_SECRET || "your_jwt_secret",
    (err, decoded) => {
      if (err)
        return res.status(403).json({ error: "Failed to authenticate token" });
      req.userId = decoded.id;
      next();
    },
  );
};

router.get("/recent", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;

    const query = `
            SELECT
                sessions.id as session_id,
                sessions.session_date,
                sites.site_name,
                COALESCE(SUM(sightings.count_quantity), 0) as total_butterflies
            FROM sessions
            LEFT JOIN sites ON sessions.site_id = sites.id
            LEFT JOIN sightings ON sessions.id = sightings.session_id
            WHERE sessions.user_id = ?
            GROUP BY sessions.id
            ORDER BY sessions.session_date DESC, sessions.start_time DESC
            LIMIT 5;
        `;

    const [recentSurveys] = await db.query(query, [userId]);

    res.status(200).json(recentSurveys);
  } catch (error) {
    console.error("Database error while fetching sightings;", error);
    res.status(500).json({ error: "failed to load recent activity" });
  }
});

module.exports = router;
