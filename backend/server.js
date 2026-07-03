/* server.js
Alfie Staunton
03.07.26
*/

const express= require('express');
const cors= require('cors');
const db = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

//gobal middleware config
app.use(cors());
app.use(express.json());

//test backend working
app.get('/', async (req, res) => {
    res.send('Dúlra API backend is running successfully.');
});


//fetches all butterfly species
app.get('/api/species', async (req, res) => {
    try{
        //query - look up table to populate UI dropdowns
        const [rows] = await db.query('SELECT * FROM butterfly_species');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve butterfly species from database.'});
    }
});

//app engine initialise
app.listen(PORT, () => {
console.log('Server is running on port http://localhost:' + PORT)
});

