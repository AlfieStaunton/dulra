/* species.js
Alfie Staunton
17.07.26
*/

const express = require("express");
const router = express.Router();
const db = require("../config/db");

//get all butterfly species from db
router.get("/", async (req, res) => {
  try {
    const query = `
       SELECT id, common_name, scientific_name, image_url
       FROM butterfly_species
       ORDER BY common_name ASC
        `;

    //excecute query
    const [species] = await db.promise().query(query);

    //results to frontend
    res.status(200).json(species);
  } catch (error) {
    console.error("Database error while fetching species:", error);
    res.status(500).json({ error: "Failed to retrieve butterfly species" });
  }
});

module.exports = router;
