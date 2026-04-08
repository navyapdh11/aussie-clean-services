const path = require('path');
const fs = require('fs');
const config = require('./index');

class JsonStore {
  constructor(filePath) {
    this.filePath = filePath;
    this.data = this.load();
  }

  load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const content = fs.readFileSync(this.filePath, 'utf-8');
        return JSON.parse(content);
      }
    } catch (e) {
      console.error('Load error:', e.message);
    }
    return {};
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

  getOne(key, id) {
    const items = this.data[key] || [];
    return items.find(item => item.id === id);
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

  count(key, condition = null) {
    const items = this.data[key] || [];
    if (!condition) return { count: items.length };
    return { count: items.filter(condition).length };
  }

  seed(key, seedData, options = {}) {
    if ((this.data[key] || []).length === 0) {
      this.data[key] = seedData.map((item, i) => ({
        ...item,
        id: i + 1,
        display_order: item.display_order || i + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
      this.save();
    }
  }
}

const store = new JsonStore(path.join('/tmp', 'sparkleclean-data.json'));

const services = [
  { name: 'Residential Cleaning', slug: 'residential', description: 'Regular home cleaning, deep cleans, and one-off sessions.', icon: '🏠', price_from: 120, features: JSON.stringify(['Weekly & fortnightly options', 'Kitchen & bathroom sanitisation', 'Dusting, vacuuming & mopping', 'Eco-friendly products']), featured: 0 },
  { name: 'Commercial Cleaning', slug: 'commercial', description: 'Professional office and commercial space cleaning.', icon: '🏢', price_from: 200, features: JSON.stringify(['Daily, weekly, or monthly schedules', 'Office & retail spaces', 'Carpet & floor care', 'After-hours service available']), featured: 1 },
  { name: 'End of Lease Cleaning', slug: 'end-of-lease', description: 'Get your full bond back with our thorough cleaning.', icon: '🔑', price_from: 250, features: JSON.stringify(['100% bond-back guarantee', 'Real estate approved', 'Full kitchen & bathroom deep clean', 'Window cleaning included']), featured: 0 },
  { name: 'Window Cleaning', slug: 'window', description: 'Crystal clear windows for homes and businesses.', icon: '🪟', price_from: 80, features: JSON.stringify(['Interior & exterior', 'Multi-story buildings', 'Streak-free guarantee', 'Screen & track cleaning']), featured: 0 },
  { name: 'Carpet & Upholstery', slug: 'carpet', description: 'Deep steam cleaning for carpets, rugs, and furniture.', icon: '🛋️', price_from: 150, features: JSON.stringify(['Hot water extraction', 'Stain & odour removal', 'Pet-friendly solutions', 'Fast drying time']), featured: 0 },
  { name: 'Builders Clean', slug: 'builders', description: 'Post-construction and renovation cleaning.', icon: '🏗️', price_from: 400, features: JSON.stringify(['Dust & debris removal', 'Paint & plaster cleanup', 'Window & frame cleaning', 'Final inspection ready']), featured: 0 }
];

const testimonials = [
  { name: 'Sarah M.', location: 'Melbourne, VIC', text: 'Absolutely brilliant service! The team was thorough, punctual, and friendly. My apartment in Melbourne CBD has never looked better. Highly recommend!', rating: 5 },
  { name: 'James T.', location: 'Sydney, NSW', text: "Used their end-of-lease cleaning and got my full bond back! The real estate agent was impressed. Great value for money. Will definitely use again.", rating: 5 },
  { name: 'Lisa P.', location: 'Brisbane, QLD', text: "We've been using SparkleClean for our Brisbane office for 6 months now. Reliable, professional, and always consistent quality. Best cleaning service we've had.", rating: 5 },
  { name: 'Michael R.', location: 'Perth, WA', text: 'The builders clean after our renovation was exceptional. They transformed our new home from a construction site to a pristine living space. Outstanding work!', rating: 5 },
  { name: 'Emma K.', location: 'Adelaide, SA', text: 'Very happy with the regular residential cleaning. The team is always on time and does a thorough job. Highly recommended for Adelaide residents.', rating: 5 }
];

const faqs = [
  { question: 'How do I get a quote?', answer: 'Fill out the contact form on our website or call us directly on 1300 SPARKLE. We typically respond within 2 hours during business hours.', category: 'General' },
  { question: 'What areas do you service?', answer: 'We service all major Australian cities including Sydney, Melbourne, Brisbane, Perth, Adelaide, and Canberra, plus surrounding suburbs.', category: 'General' },
  { question: 'Are your cleaners insured?', answer: 'Yes! All our cleaners are fully insured with $20M public liability coverage and have undergone police background checks.', category: 'Safety' },
  { question: 'Do you use eco-friendly products?', answer: 'Absolutely! We use Australian-made, environmentally safe cleaning products that are tough on dirt but gentle on your home and the planet.', category: 'General' },
  { question: 'What is your cancellation policy?', answer: 'We require 24 hours notice for cancellation. Cancellations within 24 hours may incur a small fee. We understand emergencies happen - just call us!', category: 'General' },
  { question: 'Do you offer a satisfaction guarantee?', answer: "Yes! If you're not happy with our service, we'll re-clean within 24 hours at no extra cost. Your satisfaction is our priority.", category: 'General' },
  { question: 'How long does a typical residential clean take?', answer: 'A standard residential clean takes 2-4 hours depending on the size of your home and specific requirements.', category: 'General' },
  { question: 'Do I need to be home during the clean?', answer: 'Not necessarily. Many clients provide us with a key or access code. We\'re fully insured and trusted in your home.', category: 'General' }
];

const areas = [
  { name: 'Sydney', slug: 'sydney', state: 'NSW', description: 'Comprehensive cleaning services across Sydney and all surrounding suburbs.' },
  { name: 'Melbourne', slug: 'melbourne', state: 'VIC', description: "Melbourne's trusted cleaning professionals for homes and businesses." },
  { name: 'Brisbane', slug: 'brisbane', state: 'QLD', description: "Queensland's premium cleaning services for residential and commercial spaces." },
  { name: 'Perth', slug: 'perth', state: 'WA', description: "Western Australia's leading cleaning company serving Perth and surrounds." },
  { name: 'Adelaide', slug: 'adelaide', state: 'SA', description: 'Reliable and professional cleaning services across Adelaide and suburbs.' },
  { name: 'Canberra', slug: 'canberra', state: 'ACT', description: 'Premium cleaning solutions for the ACT region and surrounding areas.' }
];

store.seed('services', services);
store.seed('testimonials', testimonials);
store.seed('faqs', faqs);
store.seed('areas', areas);

module.exports = {
  prepare: (sql) => ({
    all: () => {
      const match = sql.match(/FROM\s+(\w+)/i);
      return match ? store.get(match[1]) : [];
    },
    get: (...params) => {
      const match = sql.match(/FROM\s+(\w+)/i);
      if (!match) return { count: 0 };
      const table = match[1];
      if (sql.includes('COUNT(*)')) {
        if (sql.includes('WHERE')) {
          const cond = sql.match(/status\s*=\s*'([^']+)'/);
          return { count: store.get(table).filter(i => i.status === cond?.[1]).length };
        }
        return { count: store.get(table).length };
      }
      if (sql.includes('GROUP BY')) {
        return store.get(table).reduce((acc, i) => {
          const key = i.service || i.category || 'unknown';
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, []).map(k => ({ service: k, count: store.get(table).filter(i => i.service === k).length }));
      }
      return store.get(table)[0] || null;
    },
    run: (...params) => {
      const match = sql.match(/INTO\s+(\w+)|FROM\s+(\w+)/i);
      const table = match?.[1] || match?.[2];
      if (!table) return { lastInsertRowid: 0, changes: 0 };
      
      if (sql.includes('INSERT')) {
        const obj = {};
        const keys = ['name', 'phone', 'email', 'suburb', 'service', 'message', 'status'];
        keys.forEach((k, i) => { if (params[i] !== undefined) obj[k] = params[i]; });
        if (!obj.status) obj.status = 'pending';
        return store.insert(table, obj);
      }
      if (sql.includes('UPDATE') || sql.includes('DELETE')) {
        const id = params[params.length - 1];
        if (sql.includes('UPDATE')) {
          const status = params[0];
          return store.update(table, id, { status });
        }
        return store.delete(table, id);
      }
      return { changes: 0 };
    }
  })
};