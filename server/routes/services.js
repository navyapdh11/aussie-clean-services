const express = require('express');
const db = require('../config/database');

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const services = db.prepare('SELECT * FROM services ORDER BY display_order ASC').all();
    
    const parsed = services.map(s => ({
      ...s,
      features: s.features ? (typeof s.features === 'string' ? JSON.parse(s.features) : s.features) : []
    }));
    
    res.json({ data: parsed });
  } catch (error) {
    console.error('Services error:', error);
    res.status(500).json({ data: [
      { id: 1, name: 'Residential Cleaning', slug: 'residential', description: 'Regular home cleaning, deep cleans, and one-off sessions.', icon: '🏠', price_from: 120, features: ['Weekly & fortnightly options', 'Kitchen & bathroom sanitisation', 'Dusting, vacuuming & mopping', 'Eco-friendly products'], featured: 0 },
      { id: 2, name: 'Commercial Cleaning', slug: 'commercial', description: 'Professional office and commercial space cleaning.', icon: '🏢', price_from: 200, features: ['Daily, weekly, or monthly schedules', 'Office & retail spaces', 'Carpet & floor care', 'After-hours service available'], featured: 1 },
      { id: 3, name: 'End of Lease Cleaning', slug: 'end-of-lease', description: 'Get your full bond back with our thorough cleaning.', icon: '🔑', price_from: 250, features: ['100% bond-back guarantee', 'Real estate approved', 'Full kitchen & bathroom deep clean', 'Window cleaning included'], featured: 0 },
      { id: 4, name: 'Window Cleaning', slug: 'window', description: 'Crystal clear windows for homes and businesses.', icon: '🪟', price_from: 80, features: ['Interior & exterior', 'Multi-story buildings', 'Streak-free guarantee', 'Screen & track cleaning'], featured: 0 },
      { id: 5, name: 'Carpet & Upholstery', slug: 'carpet', description: 'Deep steam cleaning for carpets, rugs, and furniture.', icon: '🛋️', price_from: 150, features: ['Hot water extraction', 'Stain & odour removal', 'Pet-friendly solutions', 'Fast drying time'], featured: 0 },
      { id: 6, name: 'Builders Clean', slug: 'builders', description: 'Post-construction and renovation cleaning.', icon: '🏗️', price_from: 400, features: ['Dust & debris removal', 'Paint & plaster cleanup', 'Window & frame cleaning', 'Final inspection ready'], featured: 0 }
    ]});
  }
});

router.get('/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    const services = db.prepare('SELECT * FROM services ORDER BY display_order ASC').all();
    const service = services.find(s => s.slug === slug);
    
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    service.features = service.features ? (typeof service.features === 'string' ? JSON.parse(service.features) : service.features) : [];
    
    res.json({ data: service });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

module.exports = router;