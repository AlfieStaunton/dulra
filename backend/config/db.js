/* db.js
Alfie Staunton
02.07.26
*/

const mysql= require('mysql2/promise');
require('dotenv').config();

//mysql connection
const pool=mysql.createPool({
host: process.env.DB_HOST,
user: process.env.DB_USER,
password: 'dulra123',
database: process.env.DB_NAME,
waitForConnections: true,
connectionLimit: 10,
queueLimit:0
});

//export promise pool - support operation
//const promisePool=pool.promise();

//check connection works instantly
pool.getConnection()
    .then(connection => {
        console.log('Node.js successfully connected to Dúlra MySQL database');
        connection.release();
    })

    .catch(err => {
        console.error('MYSQL Connection Failed: ' + err.message);
    });

module.exports= pool;




