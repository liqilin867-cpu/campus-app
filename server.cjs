const express = require('express');
const fs = require('fs');
const path = require('path');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(compression()); // gzip all responses
app.use(express.json());

// Static files with aggressive caching (hashed filenames = cache forever)
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '365d',
  immutable: true,
  setHeaders: (res, filePath) => {
    // Don't cache index.html (needs to be fresh for SPA)
    if (filePath.endsWith('index.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// GET /api/data
app.get('/api/data', (req, res) => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return res.json(JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')));
    }
  } catch (e) {
    console.error('Read error:', e.message);
  }
  res.json({});
});

// POST /api/data
app.post('/api/data', (req, res) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2));
    res.json({ ok: true });
  } catch (e) {
    console.error('Write error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
