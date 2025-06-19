const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, 'public/assets/sprites') });
const fs = require('fs');
const schemaPath = path.join(__dirname, 'gow_schema.sql');

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

const getPool = () => mysql.createPool(dbConfig).promise();

app.post('/connect-db', (req, res) => {
  const { user, password } = req.body;

  const rawConn = mysql.createConnection({
    host: 'localhost',
    user,
    password,
    multipleStatements: true // Important for running many SQL statements
  });

  rawConn.connect(err => {
    if (err) return res.status(401).send("Connection failed: " + err.message);

    rawConn.query(`SHOW DATABASES LIKE 'gow_weapons'`, (err, results) => {
      if (err) return res.status(500).send("Error checking database: " + err.message);

      const dbExists = results.length > 0;

      const proceed = () => {
        dbConfig.user = user;
        dbConfig.password = password;

        res.send(dbExists ? "Connected to existing database." : "Connected and database initialized!");
      };

      if (dbExists) {
        proceed();
      } else {
        // Create DB first
        rawConn.query('CREATE DATABASE gow_weapons', err => {
          if (err) return res.status(500).send("Error creating database: " + err.message);

          // Use DB and run schema
          const initConn = mysql.createConnection({
            host: 'localhost',
            user,
            password,
            database: 'gow_weapons',
            multipleStatements: true
          });

          dbConfig.user = user;
          dbConfig.password = password;
          console.log("Database credentials set:", dbConfig);

          fs.readFile(schemaPath, 'utf8', (err, sql) => {
            if (err) return res.status(500).send("Error loading schema file.");

            initConn.query(sql, err => {
              if (err) return res.status(500).send("Error initializing schema: " + err.message);
              proceed();
            });
          });
        });
      }
    });
  });
});

const isDbConnected = () => dbConfig.user && dbConfig.password;

app.use((req, res, next) => {
  if (
    req.path !== '/connect-db' &&
    !isDbConnected()
  ) {
    return res.status(401).send("Database not connected. Please log in.");
  }
  next();
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

async function getOrCreate(pool, table, column, value) {
  // Check if exists
  const [rows] = await pool.query(`SELECT id_${table.toLowerCase()} FROM ${table} WHERE ${column} = ?`, [value]);
  if (rows.length > 0) return rows[0][`id_${table.toLowerCase()}`];

  // Insert if not found
  const [result] = await pool.query(`INSERT INTO ${table} (${column}) VALUES (?)`, [value]);
  return result.insertId;
}

// Create weapon (with dependencies)
app.post('/create-weapon', upload.single('spriteFile'), async (req, res) => {
  try {
    const weapon = JSON.parse(req.body.weapon);
    const spriteFile = req.file;

    if (!spriteFile) {
      return res.status(400).send("Sprite image is required.");
    }

    const conn = getPool();

    const [spriteResult] = await conn.query(
      'INSERT INTO Sprite (path_sprite) VALUES (?)',
      [spriteFile.filename]
    );
    const id_sprite = spriteResult.insertId;

    // Then use dropdown IDs directly
    const id_material = weapon.material;
    const id_skill = weapon.skill_name;
    const id_type_weapon = weapon.type_weapon;

    const levelMap = {
      1: [1, 1, 1],
      2: [1.2, 1.1, 0.95],
      3: [1.5, 1.2, 0.9],
      4: [1.8, 1.3, 0.85],
      5: [2.0, 1.5, 0.8],
    };
    const lvl = weapon.level;
    const [md, mr, mc] = levelMap[lvl];

    const [levelResult] = await conn.query(
      'INSERT INTO Level (multiplier_damage, multiplier_range, multiplier_cooldown) VALUES (?, ?, ?)',
      [md, mr, mc]
    );
    const id_level = levelResult.insertId;

    await conn.query(
      `INSERT INTO Weapon (name_weapon, damage, \`range\`, cooldown, id_sprite, id_material, id_skill, id_type_weapon, id_level)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        weapon.name_weapon,
        weapon.damage,
        weapon.range,
        weapon.cooldown,
        id_sprite,
        id_material,
        id_skill,
        id_type_weapon,
        id_level
      ]
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
