const express = require('express');
const db = require('../config/database');

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const services = db.prepare(`
      SELECT * FROM services ORDER BY display_order ASC
    `).all();
    
    const parsed = services.map(s => ({
      ...s,
      features: s.features ? JSON.parse(s.features) : []
    }));
    
    res.json({ data: parsed });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

router.get('/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    
    const service = db.prepare('SELECT * FROM services WHERE slug = ?').get(slug);
    
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    service.features = service.features ? JSON.parse(service.features) : [];
    
    res.json({ data: service });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

module.exports = router;