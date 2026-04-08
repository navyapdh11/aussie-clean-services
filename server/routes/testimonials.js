const express = require('express');
const db = require('../config/database');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const testimonials = db.prepare(`
      SELECT * FROM testimonials WHERE active = 1 ORDER BY display_order ASC
    `).all();
    res.json({ data: testimonials });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

router.post('/', authenticate, requireAdmin, (req, res) => {
  try {
    const { name, location, text, rating, avatar } = req.body;
    
    if (!name || !text) {
      return res.status(400).json({ error: 'Name and text are required' });
    }
    
    const maxOrder = db.prepare('SELECT MAX(display_order) as max FROM testimonials').get();
    const newOrder = (maxOrder.max || 0) + 1;
    
    const result = db.prepare(`
      INSERT INTO testimonials (name, location, text, rating, avatar, display_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(name, location || '', text, rating || 5, avatar || '', newOrder);
    
    res.status(201).json({ 
      message: 'Testimonial added',
      data: { id: result.lastInsertRowid }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add testimonial' });
  }
});

router.put('/:id', authenticate, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, text, rating, active } = req.body;
    
    const result = db.prepare(`
      UPDATE testimonials 
      SET name = COALESCE(?, name), location = COALESCE(?, location), 
          text = COALESCE(?, text), rating = COALESCE(?, rating), 
          active = COALESCE(?, active)
      WHERE id = ?
    `).run(name, location, text, rating, active, id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    
    res.json({ message: 'Testimonial updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
});

router.delete('/:id', authenticate, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    
    const result = db.prepare('DELETE FROM testimonials WHERE id = ?').run(id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    
    res.json({ message: 'Testimonial deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});

module.exports = router;