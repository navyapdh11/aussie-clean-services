const express = require('express');
const db = require('../config/database');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM faqs WHERE active = 1';
    let params = [];
    
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    
    query += ' ORDER BY display_order ASC';
    
    const faqs = db.prepare(query).all(...params);
    res.json({ data: faqs });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

router.post('/', authenticate, requireAdmin, (req, res) => {
  try {
    const { question, answer, category } = req.body;
    
    if (!question || !answer) {
      return res.status(400).json({ error: 'Question and answer are required' });
    }
    
    const maxOrder = db.prepare('SELECT MAX(display_order) as max FROM faqs').get();
    const newOrder = (maxOrder.max || 0) + 1;
    
    const result = db.prepare(`
      INSERT INTO faqs (question, answer, category, display_order)
      VALUES (?, ?, ?, ?)
    `).run(question, answer, category || 'General', newOrder);
    
    res.status(201).json({ 
      message: 'FAQ added',
      data: { id: result.lastInsertRowid }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add FAQ' });
  }
});

router.put('/:id', authenticate, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, category, active } = req.body;
    
    const result = db.prepare(`
      UPDATE faqs 
      SET question = COALESCE(?, question), answer = COALESCE(?, answer), 
          category = COALESCE(?, category), active = COALESCE(?, active)
      WHERE id = ?
    `).run(question, answer, category, active, id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'FAQ not found' });
    }
    
    res.json({ message: 'FAQ updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update FAQ' });
  }
});

router.delete('/:id', authenticate, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    
    const result = db.prepare('DELETE FROM faqs WHERE id = ?').run(id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'FAQ not found' });
    }
    
    res.json({ message: 'FAQ deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete FAQ' });
  }
});

module.exports = router;