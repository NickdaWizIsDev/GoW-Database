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
    user: 'root',
    password: 'root',
    database: 'gow_weapons'
});
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'gow_weapons'
}).promise();

db.connect(err => {
    if (err) throw err;
    console.log('Connected to database.');
});

app.post('/create-player', async (req, res) => {
  const { user_name, points, id_weapon } = req.body;
  try {
    await db.promise().query('INSERT INTO Player (user_name, points, id_weapon) VALUES (?, ?, ?)', [user_name, points, id_weapon]);
    res.send("Player created successfully!");
  } catch (err) {
    console.error("Error creating player:", err);
    res.status(500).send("Error: " + err.message);
  }
});

app.post('/create-weapon', async (req, res) => {
  const weapon = req.body;
  const conn = db.promise();

  try {
    const [mat] = await conn.query('INSERT INTO Material (path_material) VALUES (?)', [weapon.material]);
    const id_material = mat.insertId;

    const [spr] = await conn.query('INSERT INTO Sprite (path_sprite) VALUES (?)', [weapon.sprite]);
    const id_sprite = spr.insertId;

    const [skl] = await conn.query('INSERT INTO Skill (skill_name, active) VALUES (?, ?)', [weapon.skill.skill_name, weapon.skill.active]);
    const id_skill = skl.insertId;

    const [typ] = await conn.query('INSERT INTO Type_Weapon (name_type_weapon) VALUES (?)', [weapon.type_weapon]);
    const id_type_weapon = typ.insertId;

    const [lvl] = await conn.query(
      'INSERT INTO Level (multiplier_damage, multiplier_range, multiplier_cooldown) VALUES (?, ?, ?)',
      [weapon.level.multiplier_damage, weapon.level.multiplier_range, weapon.level.multiplier_cooldown]
    );
    const id_level = lvl.insertId;

    const [wpn] = await conn.query(
      `INSERT INTO Weapon (name_weapon, damage, \`range\`, cooldown, id_sprite, id_material, id_skill, id_type_weapon, id_level)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [weapon.name_weapon, weapon.damage, weapon.range, weapon.cooldown, id_sprite, id_material, id_skill, id_type_weapon, id_level]
    );

    res.send("Weapon created successfully!");
  } catch (err) {
    console.error("Error creating weapon:", err);
    res.status(500).send("Error: " + err.message);
  }
});

app.get('/players', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        p.user_name, p.points, 
        w.name_weapon, w.damage, w.range, w.cooldown,
        s.skill_name, s.active,
        tw.name_type_weapon,
        l.multiplier_damage, l.multiplier_range, l.multiplier_cooldown
      FROM Player p
      JOIN Weapon w ON p.id_weapon = w.id_weapon
      JOIN Skill s ON w.id_skill = s.id_skill
      JOIN Type_Weapon tw ON w.id_type_weapon = tw.id_type_weapon
      JOIN Level l ON w.id_level = l.id_level
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving player data");
  }
});

app.get('/weapons', async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT id_weapon, name_weapon FROM Weapon');
    res.json(rows);
  } catch (err) {
    res.status(500).send("Error fetching weapons");
  }
});

app.delete('/player/:user_name', async (req, res) => {
  const { user_name } = req.params;
  try {
    await db.promise().query('DELETE FROM Player WHERE user_name = ?', [user_name]);
    res.send("Player deleted successfully!");
  } catch (err) {
    res.status(500).send("Error deleting player");
  }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});