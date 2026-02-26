const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
app.use(express.json());

// simple JSON file database
const dbFile = path.join(__dirname, 'db.json');

async function readDb() {
  try {
    const data = await fs.readFile(dbFile, 'utf8');
    return JSON.parse(data);
  } catch {
    return { items: [] };
  }
}

async function writeDb(data) {
  await fs.writeFile(dbFile, JSON.stringify(data, null, 2));
}

// CORS helper for development
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// CRUD endpoints
app.get('/api/items', async (req, res) => {
  const db = await readDb();
  res.json(db.items);
});

app.post('/api/items', async (req, res) => {
  const item = req.body;
  const db = await readDb();
  item.id = Date.now().toString();
  db.items.push(item);
  await writeDb(db);
  res.status(201).json(item);
});

app.put('/api/items/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const db = await readDb();
  const item = db.items.find(i => i.id === id);
  if (!item) return res.status(404).send('Not found');
  Object.assign(item, updates);
  await writeDb(db);
  res.json(item);
});

app.delete('/api/items/:id', async (req, res) => {
  const { id } = req.params;
  const db = await readDb();
  db.items = db.items.filter(i => i.id !== id);
  await writeDb(db);
  res.status(204).send();
});

// serve static client from server/public and mount inventory at /inventory
app.use('/inventory', express.static(path.join(__dirname, 'public', 'inventory')));
app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Inventory API listening on http://localhost:${port}`);
});