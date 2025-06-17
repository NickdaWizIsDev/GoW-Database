const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'gow_user',
    password: '',
    database: 'gow_weapons'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to database.');
});

app.post('/add-player', (req, res) => {
    const { user_name, points, id_weapon } = req.body;
    const sql = 'INSERT INTO Player (user_name, points, id_weapon) VALUES (?, ?, ?)';
    db.query(sql, [user_name, points, id_weapon], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }
        res.send('Player added successfully!');
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});