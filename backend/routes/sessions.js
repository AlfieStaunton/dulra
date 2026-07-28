/* sessions.js
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

const mapWind = (val) => {
  const winds = {
    0: "Smoke rises vertically",
    1: "Slight smoke drift",
    2: "Wind felt on face, leaves rustle",
    3: "Leaves and twigs in slight motion",
    4: "Dust raised and small branches move",
    5: "Small trees in leaf sway",
    6: "Large branches move and trees sway",
  };
  return winds[val];
};

router.post("/", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const sessionData = req.body;
    const conditions = sessionData.conditions;

    const mappedWind = mapWind(conditions.windSpeed);

    const siteId = conditions.siteId ? conditions.siteId : null;

    const sessionQuery = `
        INSERT INTO sessions
        (user_id, site_id, session_date, start_time, end_time, temperature, sunshine_level, wind_level)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

    const [sessionResult] = await db.query(sessionQuery, [
        userId,
        siteId,
        conditions.date,
        conditions.startTime,
        conditions.endTime,
        conditions.temperature,
        conditions.sunshine,
        mappedWind,
      ]);

    const newSessionId = sessionResult.insertId;

    //butterfly count
    if (sessionData.counts && sessionData.counts.length > 0) {
      const sightingsQuery = `
            INSERT INTO sightings(session_id, species_id, count_quantity, photo_url)
            VALUES ?
            `;

      const sightingsValue = sessionData.counts.map((butterfly) => {
        const matchedPhoto = sessionData.photos?.find(
          (p) => p.identifiedAs === butterfly.common,
        );
        const photoUrl = matchedPhoto ? matchedPhoto.url : null;

        return [newSessionId, butterfly.id, butterfly.count, photoUrl];
      });

      await db.query(sightingsQuery, [sightingsValue]);
    }

    res.status(201).json({
      message: "Survey session saved successfully!",
      sessionId: newSessionId,
    });
  } catch (error) {
    console.error("Database error while saving session;", error);
    res.status(500).json({ error: "failed to save survey session" });
  }
});

module.exports = router;
