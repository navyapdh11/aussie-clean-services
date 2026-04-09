const path = require('path');
const fs = require('fs');

class JsonStore {
  constructor(filePath) {
    this.filePath = filePath;
    this.data = {};
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const content = fs.readFileSync(this.filePath, 'utf-8');
        this.data = JSON.parse(content);
      } else {
        this.seed();
      }
    } catch (e) {
      console.error('Load error:', e.message);
      this.seed();
    }
  }

  seed() {
    this.data = {
      services: [
        { id: 1, name: 'Residential Cleaning', slug: 'residential', description: 'Regular home cleaning, deep cleans, and one-off sessions.', icon: '🏠', price_from: 120, features: ['Weekly & fortnightly options', 'Kitchen & bathroom sanitisation', 'Dusting, vacuuming & mopping', 'Eco-friendly products'], featured: 0, display_order: 1, active: 1 },
        { id: 2, name: 'Commercial Cleaning', slug: 'commercial', description: 'Professional office and commercial space cleaning.', icon: '🏢', price_from: 200, features: ['Daily, weekly, or monthly schedules', 'Office & retail spaces', 'Carpet & floor care', 'After-hours service available'], featured: 1, display_order: 2, active: 1 },
        { id: 3, name: 'End of Lease Cleaning', slug: 'end-of-lease', description: 'Get your full bond back with our thorough cleaning.', icon: '🔑', price_from: 250, features: ['100% bond-back guarantee', 'Real estate approved', 'Full kitchen & bathroom deep clean', 'Window cleaning included'], featured: 0, display_order: 3, active: 1 },
        { id: 4, name: 'Window Cleaning', slug: 'window', description: 'Crystal clear windows for homes and businesses.', icon: '🪟', price_from: 80, features: ['Interior & exterior', 'Multi-story buildings', 'Streak-free guarantee', 'Screen & track cleaning'], featured: 0, display_order: 4, active: 1 },
        { id: 5, name: 'Carpet & Upholstery', slug: 'carpet', description: 'Deep steam cleaning for carpets, rugs, and furniture.', icon: '🛋️', price_from: 150, features: ['Hot water extraction', 'Stain & odour removal', 'Pet-friendly solutions', 'Fast drying time'], featured: 0, display_order: 5, active: 1 },
        { id: 6, name: 'Builders Clean', slug: 'builders', description: 'Post-construction and renovation cleaning.', icon: '🏗️', price_from: 400, features: ['Dust & debris removal', 'Paint & plaster cleanup', 'Window & frame cleaning', 'Final inspection ready'], featured: 0, display_order: 6, active: 1 }
      ],
      testimonials: [
        { id: 1, name: 'Sarah M.', location: 'Melbourne, VIC', text: 'Absolutely brilliant service! The team was thorough, punctual, and friendly. My apartment in Melbourne CBD has never looked better. Highly recommend!', rating: 5, active: 1, display_order: 1 },
        { id: 2, name: 'James T.', location: 'Sydney, NSW', text: 'Used their end-of-lease cleaning and got my full bond back! The real estate agent was impressed. Great value for money. Will definitely use again.', rating: 5, active: 1, display_order: 2 },
        { id: 3, name: 'Lisa P.', location: 'Brisbane, QLD', text: "We've been using OzCleaners for our Brisbane office for 6 months now. Reliable, professional, and always consistent quality. Best cleaning service we've had.", rating: 5, active: 1, display_order: 3 }
      ],
      faqs: [
        { id: 1, question: 'How do I get a quote?', answer: 'Fill out the contact form on our website or call us directly on 1300 SPARKLE. We typically respond within 2 hours during business hours.', category: 'General', active: 1, display_order: 1 },
        { id: 2, question: 'What areas do you service?', answer: 'We service all major Australian cities including Sydney, Melbourne, Brisbane, Perth, Adelaide, and Canberra, plus surrounding suburbs.', category: 'General', active: 1, display_order: 2 },
        { id: 3, question: 'Are your cleaners insured?', answer: 'Yes! All our cleaners are fully insured with $20M public liability coverage and have undergone police background checks.', category: 'Safety', active: 1, display_order: 3 },
        { id: 4, question: 'Do you use eco-friendly products?', answer: 'Absolutely! We use Australian-made, environmentally safe cleaning products.', category: 'General', active: 1, display_order: 4 },
        { id: 5, question: 'What is your cancellation policy?', answer: 'We require 24 hours notice for cancellation. Cancellations within 24 hours may incur a small fee.', category: 'General', active: 1, display_order: 5 }
      ],
      areas: [
        { id: 1, name: 'Sydney', slug: 'sydney', state: 'NSW', description: 'All suburbs & CBD', active: 1, display_order: 1 },
        { id: 2, name: 'Melbourne', slug: 'melbourne', state: 'VIC', description: 'All suburbs & CBD', active: 1, display_order: 2 },
        { id: 3, name: 'Brisbane', slug: 'brisbane', state: 'QLD', description: 'All suburbs & CBD', active: 1, display_order: 3 },
        { id: 4, name: 'Perth', slug: 'perth', state: 'WA', description: 'All suburbs & CBD', active: 1, display_order: 4 },
        { id: 5, name: 'Adelaide', slug: 'adelaide', state: 'SA', description: 'All suburbs & CBD', active: 1, display_order: 5 },
        { id: 6, name: 'Canberra', slug: 'canberra', state: 'ACT', description: 'All suburbs & CBD', active: 1, display_order: 6 }
      ],
      quotes: []
    };
    this.save();
  }

  save() {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2));
    } catch (e) {
      console.error('Save error:', e.message);
    }
  }

  get(key) {
    return this.data[key] || [];
  }

  insert(key, item) {
    const items = this.data[key] || [];
    item.id = Date.now();
    item.created_at = new Date().toISOString();
    item.updated_at = item.created_at;
    items.push(item);
    this.data[key] = items;
    this.save();
    return { lastInsertRowid: item.id };
  }

  update(key, id, updates) {
    const items = this.data[key] || [];
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates, updated_at: new Date().toISOString() };
      this.data[key] = items;
      this.save();
      return { changes: 1 };
    }
    return { changes: 0 };
  }

  delete(key, id) {
    const items = this.data[key] || [];
    const filtered = items.filter(item => item.id !== id);
    if (filtered.length !== items.length) {
      this.data[key] = filtered;
      this.save();
      return { changes: 1 };
    }
    return { changes: 0 };
  }
}

const store = new JsonStore('/tmp/sparkleclean-data.json');

module.exports = {
  prepare: (sql) => ({
    all: () => {
      const match = sql.match(/FROM\s+(\w+)/i);
      const table = match ? match[1] : null;
      if (!table) return [];
      
      if (sql.includes('WHERE active = 1')) {
        return store.get(table).filter(i => i.active === 1).sort((a, b) => a.display_order - b.display_order);
      }
      return store.get(table).sort((a, b) => a.display_order - b.display_order);
    },
    get: (...params) => {
      const match = sql.match(/FROM\s+(\w+)/i);
      const table = match ? match[1] : null;
      if (!table) return { count: 0 };
      
      if (sql.includes('COUNT(*)')) {
        if (sql.includes('WHERE status')) {
          const cond = sql.match(/status\s*=\s*'([^']+)'/);
          return { count: store.get(table).filter(i => i.status === cond?.[1]).length };
        }
        return { count: store.get(table).length };
      }
      if (sql.includes('WHERE slug')) {
        const slug = params[0];
        return store.get(table).find(i => i.slug === slug) || null;
      }
      return store.get(table)[0] || null;
    },
    run: (...params) => {
      const match = sql.match(/INTO\s+(\w+)/i);
      const table = match ? match[1] : null;
      if (!table) return { lastInsertRowid: 0, changes: 0 };
      
      if (sql.includes('INSERT')) {
        const obj = {};
        const keys = ['name', 'phone', 'email', 'suburb', 'service', 'message', 'status'];
        keys.forEach((k, i) => { if (params[i] !== undefined) obj[k] = params[i]; });
        if (!obj.status) obj.status = 'pending';
        return store.insert(table, obj);
      }
      if (sql.includes('UPDATE')) {
        const id = params[params.length - 1];
        const status = params[0];
        return store.update(table, id, { status });
      }
      if (sql.includes('DELETE')) {
        const id = params[0];
        return store.delete(table, id);
      }
      return { changes: 0 };
    }
  })
};