const express = require('express');
const db = require('../config/database');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const areas = db.prepare(`
      SELECT * FROM areas WHERE active = 1 ORDER BY display_order ASC
    `).all();
    res.json({ data: areas });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch areas' });
  }
});

router.get('/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    
    const area = db.prepare('SELECT * FROM areas WHERE slug = ?').get(slug);
    
    if (!area) {
      return res.status(404).json({ error: 'Area not found' });
    }
    
    res.json({ data: area });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch area' });
  }
});

module.exports = router;