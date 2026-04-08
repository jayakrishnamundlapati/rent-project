import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use /tmp/ on Vercel since other folders are read-only in Serverless Functions
const dbPath = process.env.VERCEL ? path.join(os.tmpdir(), 'database.sqlite') : path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const app = express();
app.use(cors());
app.use(express.json());

const filesToProcess = [
  'Bellandur.csv',
  'Electronic_City.csv',
  'K.R Puram.csv',
  'Varthur.csv',
  'Yelahanka.csv',
  'Kaggadasapura.csv',
  'Brookefield.csv',
  'Whitefield.csv'
];

let images = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
];

const resolveCSVPath = (filename) => {
  const possiblePaths = [
    path.join(process.cwd(), filename),
    path.join(__dirname, filename),
    path.join(__dirname, '..', filename),
    path.join('/var/task', filename)
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
};

// Reusable function to parse a single CSV
const parseCSV = (filename) => {
  return new Promise((resolve, reject) => {
    const filePath = resolveCSVPath(filename);
    if (!filePath) {
      console.warn(`File not found in any known locations: ${filename}`);
      return resolve([]);
    }
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
};

const initDb = new Promise((resolve) => {
  db.serialize(async () => {
  console.log("Setting up the database...");
  db.run(`DROP TABLE IF EXISTS properties`);
  db.run(`CREATE TABLE properties (
    id TEXT PRIMARY KEY,
    title TEXT,
    location TEXT,
    price TEXT,
    bedrooms INTEGER,
    bathrooms INTEGER,
    area TEXT,
    image TEXT,
    featured INTEGER,
    area_name TEXT,
    details TEXT
  )`);

  const stmt = db.prepare('INSERT INTO properties VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

  console.log("Processing CSV files...");
  let totalInserted = 0;
  
  for (const file of filesToProcess) {
    try {
      const rows = await parseCSV(file); // Grab all rows per file
      let areaName = path.basename(file, '.csv').replace('_', ' ');

      rows.forEach((row, i) => {
        let uniqueId = (row.property_id || '') + '_' + Date.now() + Math.random().toString().slice(2, 6);
        
        let typeStr = row.type || 'BHK2';
        let bedroomsMatch = typeStr.match(/\d+/);
        let bedrooms = bedroomsMatch ? parseInt(bedroomsMatch[0]) : 2;
        let bathrooms = parseInt(row.bathroom) || 2;
        
        let title = `${row.furnishing ? row.furnishing.replace('_', ' ') : 'Premium'} ${typeStr} PG`;
        let location = `${row.locality || 'Bangalore'}, Bangalore (${row.pin_code || ''})`;
        let price = `₹${row.rent || '20000'} / month`;
        let area = `${row.property_size || '1000'} sq.ft`;
        let featured = i < 2 ? 1 : 0; // Feature first 2 from each file
        
        // Pick an image reliably
        let img = images[(totalInserted + i) % images.length];
        let detailsJSON = JSON.stringify(row);

        stmt.run(uniqueId, title, location, price, bedrooms, bathrooms, area, img, featured, areaName, detailsJSON);
        totalInserted++;
      });
      console.log(`Processed ${rows.length} rows from ${file}`);
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }

  stmt.finalize();
    console.log(`Successfully completed! Inserted a total of ${totalInserted} property records into SQLite.`);
    resolve();
  });
});

// Search and Read properties
app.get('/api/properties', async (req, res) => {
  await initDb;
  const { search } = req.query;
  let sql = 'SELECT * FROM properties';
  let params = [];
  
  if (search) {
     sql += ' WHERE location LIKE ? OR title LIKE ? OR area_name LIKE ?';
     params = [`%${search}%`, `%${search}%`, `%${search}%`];
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const formatted = rows.map(r => ({
      ...r,
      featured: r.featured === 1
    }));
    res.json(formatted);
  });
});

app.get('/api/debug', (req, res) => {
  try {
    const cwd = process.cwd();
    const taskDir = '/var/task';
    res.json({
      cwd,
      __dirname,
      cwdFiles: fs.existsSync(cwd) ? fs.readdirSync(cwd) : 'not found',
      taskFiles: fs.existsSync(taskDir) ? fs.readdirSync(taskDir) : 'not found',
      dirFiles: fs.existsSync(__dirname) ? fs.readdirSync(__dirname) : 'not found',
      csvCheck: filesToProcess.map(f => ({ file: f, path: resolveCSVPath(f) }))
    });
  } catch(err) {
    res.json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'dist')));

app.get(/(.*)/, (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Only listen if not running on Vercel
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Full-stack server running on http://localhost:${PORT}`);
  });
}

export default app;
