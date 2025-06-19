const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, 'public/assets/sprites') });

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Serve frontend files from public/
app.use(express.static('public'));

// Serve assets like sprites from public/assets via /assets/ path
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));


let dbConfig = {
  host: 'localhost',
  user: '',
  password: '',
  database: 'gow_weapons'
};

const getDb = () => mysql.createConnection(dbConfig);
const getPool = () => mysql.createPool(dbConfig).promise();

app.post('/connect-db', (req, res) => {
  const { user, password } = req.body;
  const testConnection = mysql.createConnection({
    host: 'localhost',
    user,
    password,
    database: 'gow_weapons'
  });

  testConnection.connect(err => {
    if (err) {
      return res.status(401).send("Connection failed: " + err.message);
    }

    // Save credentials for global reuse
    dbConfig.user = user;
    dbConfig.password = password;

    res.send("Connected and ready!");
  });
});

// Create player
app.post('/create-player', async (req, res) => {
  const { user_name, points, id_weapon } = req.body;
  try {
    await getPool().query(
      'INSERT INTO Player (user_name, points, id_weapon) VALUES (?, ?, ?)',
      [user_name, points, id_weapon]
    );
    res.send("Player created successfully!");
  } catch (err) {
    console.error("Error creating player:", err);
    res.status(500).send("Error: " + err.message);
  }
});

// Create weapon (with dependencies)
app.post('/create-weapon', upload.single('spriteFile'), async (req, res) => {
  const weapon = JSON.parse(req.body.weapon);
  const spriteFile = req.file;

  if (!spriteFile) return res.status(400).send("No sprite uploaded.");

  const conn = getPool();

  try {
    const [materialResult] = await conn.query('INSERT INTO Material (path_material) VALUES (?)', [weapon.material]);
    const id_material = materialResult.insertId;

    const [spriteResult] = await conn.query('INSERT INTO Sprite (path_sprite) VALUES (?)', [weapon.sprite]);
    const id_sprite = spriteResult.insertId;

    const [skillResult] = await conn.query('INSERT INTO Skill (skill_name, active) VALUES (?, ?)', [weapon.skill.skill_name, weapon.skill.active]);
    const id_skill = skillResult.insertId;

    const [typeResult] = await conn.query('INSERT INTO Type_Weapon (name_type_weapon) VALUES (?)', [weapon.type_weapon]);
    const id_type_weapon = typeResult.insertId;

    // Choose multiplier based on level 1–5
    const levelMap = {
      1: [1, 1, 1],
      2: [1.2, 1.1, 0.95],
      3: [1.5, 1.2, 0.9],
      4: [1.8, 1.3, 0.85],
      5: [2.0, 1.5, 0.8],
    };
    const [md, mr, mc] = levelMap[weapon.level];

    const [[{ insertId: id_level }]] = await conn.query(
      'INSERT INTO Level (multiplier_damage, multiplier_range, multiplier_cooldown) VALUES (?, ?, ?)',
      [md, mr, mc]
    );

    await conn.query(
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

// Get all players
app.get('/players', async (req, res) => {
  try {
    const [rows] = await getPool().query(`
      SELECT 
        p.id_player, p.user_name, p.points, 
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

// Get available weapons
app.get('/weapons', async (req, res) => {
  try {
    const [rows] = await getPool().query(`
      SELECT 
        w.id_weapon, w.name_weapon, s.path_sprite,
        w.damage, w.range, w.cooldown
      FROM Weapon w
      JOIN Sprite s ON w.id_sprite = s.id_sprite
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).send("Error fetching weapons");
  }
});
app.get('/materials', async (req, res) => {
  const [rows] = await getPool().query('SELECT * FROM Material');
  res.json(rows);
});
app.get('/skills', async (req, res) => {
  const [rows] = await getPool().query('SELECT * FROM Skill');
  res.json(rows);
});
app.get('/types', async (req, res) => {
  const [rows] = await getPool().query('SELECT * FROM Type_Weapon');
  res.json(rows);
});


// Delete player by username
app.delete('/player/:user_name', async (req, res) => {
  const { user_name } = req.params;
  try {
    await getPool().query('DELETE FROM Player WHERE user_name = ?', [user_name]);
    res.send("Player deleted successfully!");
  } catch (err) {
    res.status(500).send("Error deleting player");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
