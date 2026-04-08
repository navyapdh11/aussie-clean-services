const express = require('express');
const db = require('../config/database');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

function sanitizeString(str, maxLength = 255) {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLength);
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhone(phone) {
  const re = /^[0-9\s\-\+\(\)]{8,20}$/;
  return re.test(phone);
}

router.get('/', (req, res) => {
  try {
    const quotes = db.prepare(`
      SELECT id, name, phone, email, suburb, service, message, status, created_at, updated_at 
      FROM quotes ORDER BY created_at DESC
    `).all();
    res.json({ data: quotes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

router.get('/stats', (req, res) => {
  try {
    const total = db.prepare('SELECT COUNT(*) as count FROM quotes').get();
    const pending = db.prepare("SELECT COUNT(*) as count FROM quotes WHERE status = 'pending'").get();
    const contacted = db.prepare("SELECT COUNT(*) as count FROM quotes WHERE status = 'contacted'").get();
    const completed = db.prepare("SELECT COUNT(*) as count FROM quotes WHERE status = 'completed'").get();
    
    const byService = db.prepare(`
      SELECT service, COUNT(*) as count FROM quotes GROUP BY service
    `).all();
    
    res.json({
      data: {
        total: total.count,
        pending: pending.count,
        contacted: contacted.count,
        completed: completed.count,
        byService
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

router.post('/', (req, res) => {
  try {
    const { name, phone, email, suburb, service, message } = req.body;
    
    const sanitizedName = sanitizeString(name, 100);
    const sanitizedPhone = sanitizeString(phone, 20);
    const sanitizedEmail = sanitizeString(email, 255).toLowerCase();
    const sanitizedSuburb = sanitizeString(suburb, 100);
    const sanitizedService = sanitizeString(service, 50);
    const sanitizedMessage = sanitizeString(message, 1000);
    
    if (!sanitizedName || !sanitizedPhone || !sanitizedEmail || !sanitizedSuburb || !sanitizedService) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }
    
    if (!validateEmail(sanitizedEmail)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }
    
    if (!validatePhone(sanitizedPhone)) {
      return res.status(400).json({ error: 'Invalid phone number' });
    }
    
    const validServices = ['residential', 'commercial', 'end-of-lease', 'window', 'carpet', 'builders'];
    if (!validServices.includes(sanitizedService)) {
      return res.status(400).json({ error: 'Invalid service type' });
    }
    
    const result = db.prepare(`
      INSERT INTO quotes (name, phone, email, suburb, service, message)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(sanitizedName, sanitizedPhone, sanitizedEmail, sanitizedSuburb, sanitizedService, sanitizedMessage);
    
    res.status(201).json({
      message: 'Quote request submitted successfully',
      data: { id: result.lastInsertRowid }
    });
  } catch (error) {
    console.error('Quote submission error:', error);
    res.status(500).json({ error: 'Failed to submit quote' });
  }
});

router.put('/:id', authenticate, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      return res.status(400).json({ error: 'Invalid quote ID' });
    }
    
    if (!['pending', 'contacted', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const result = db.prepare(`
      UPDATE quotes SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).run(status, parsedId);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Quote not found' });
    }
    
    res.json({ message: 'Quote status updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update quote' });
  }
});

router.delete('/:id', authenticate, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      return res.status(400).json({ error: 'Invalid quote ID' });
    }
    
    const result = db.prepare('DELETE FROM quotes WHERE id = ?').run(parsedId);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Quote not found' });
    }
    
    res.json({ message: 'Quote deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete quote' });
  }
});

module.exports = router;