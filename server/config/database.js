const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const config = require('./index');

const dbDir = path.dirname(config.DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(config.DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    suburb TEXT NOT NULL,
    service TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    price_from REAL,
    features TEXT,
    featured INTEGER DEFAULT 0,
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT,
    text TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    avatar TEXT,
    display_order INTEGER DEFAULT 0,
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS faqs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT,
    display_order INTEGER DEFAULT 0,
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS areas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    state TEXT,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    before_image TEXT,
    after_image TEXT,
    service_id INTEGER,
    area_id INTEGER,
    display_order INTEGER DEFAULT 0,
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

const servicesExist = db.prepare('SELECT COUNT(*) as count FROM services').get();
if (servicesExist.count === 0) {
  const insertService = db.prepare(`
    INSERT INTO services (name, slug, description, icon, price_from, features, featured, display_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const services = [
    ['Residential Cleaning', 'residential', 'Regular home cleaning, deep cleans, and one-off sessions.', '🏠', 120, JSON.stringify(['Weekly & fortnightly options', 'Kitchen & bathroom sanitisation', 'Dusting, vacuuming & mopping', 'Eco-friendly products']), 0, 1],
    ['Commercial Cleaning', 'commercial', 'Professional office and commercial space cleaning.', '🏢', 200, JSON.stringify(['Daily, weekly, or monthly schedules', 'Office & retail spaces', 'Carpet & floor care', 'After-hours service available']), 1, 2],
    ['End of Lease Cleaning', 'end-of-lease', 'Get your full bond back with our thorough cleaning.', '🔑', 250, JSON.stringify(['100% bond-back guarantee', 'Real estate approved', 'Full kitchen & bathroom deep clean', 'Window cleaning included']), 0, 3],
    ['Window Cleaning', 'window', 'Crystal clear windows for homes and businesses.', '🪟', 80, JSON.stringify(['Interior & exterior', 'Multi-story buildings', 'Streak-free guarantee', 'Screen & track cleaning']), 0, 4],
    ['Carpet & Upholstery', 'carpet', 'Deep steam cleaning for carpets, rugs, and furniture.', '🛋️', 150, JSON.stringify(['Hot water extraction', 'Stain & odour removal', 'Pet-friendly solutions', 'Fast drying time']), 0, 5],
    ['Builders Clean', 'builders', 'Post-construction and renovation cleaning.', '🏗️', 400, JSON.stringify(['Dust & debris removal', 'Paint & plaster cleanup', 'Window & frame cleaning', 'Final inspection ready']), 0, 6]
  ];
  
  services.forEach(s => insertService.run(...s));
}

const testimonialsExist = db.prepare('SELECT COUNT(*) as count FROM testimonials').get();
if (testimonialsExist.count === 0) {
  const insertTestimonial = db.prepare(`
    INSERT INTO testimonials (name, location, text, rating, display_order)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  const testimonials = [
    ['Sarah M.', 'Melbourne, VIC', 'Absolutely brilliant service! The team was thorough, punctual, and friendly. My apartment in Melbourne CBD has never looked better. Highly recommend!', 5, 1],
    ['James T.', 'Sydney, NSW', "Used their end-of-lease cleaning and got my full bond back! The real estate agent was impressed. Great value for money. Will definitely use again.", 5, 2],
    ['Lisa P.', 'Brisbane, QLD', "We've been using SparkleClean for our Brisbane office for 6 months now. Reliable, professional, and always consistent quality. Best cleaning service we've had.", 5, 3],
    ['Michael R.', 'Perth, WA', 'The builders clean after our renovation was exceptional. They transformed our new home from a construction site to a pristine living space. Outstanding work!', 5, 4],
    ['Emma K.', 'Adelaide, SA', 'Very happy with the regular residential cleaning. The team is always on time and does a thorough job. Highly recommended for Adelaide residents.', 5, 5]
  ];
  
  testimonials.forEach(t => insertTestimonial.run(...t));
}

const faqsExist = db.prepare('SELECT COUNT(*) as count FROM faqs').get();
if (faqsExist.count === 0) {
  const insertFaq = db.prepare(`
    INSERT INTO faqs (question, answer, category, display_order)
    VALUES (?, ?, ?, ?)
  `);
  
  const faqs = [
    ['How do I get a quote?', 'Fill out the contact form on our website or call us directly on 1300 SPARKLE. We typically respond within 2 hours during business hours.', 'General', 1],
    ['What areas do you service?', 'We service all major Australian cities including Sydney, Melbourne, Brisbane, Perth, Adelaide, and Canberra, plus surrounding suburbs.', 'General', 2],
    ['Are your cleaners insured?', 'Yes! All our cleaners are fully insured with $20M public liability coverage and have undergone police background checks.', 'Safety', 3],
    ['Do you use eco-friendly products?', 'Absolutely! We use Australian-made, environmentally safe cleaning products that are tough on dirt but gentle on your home and the planet.', 'General', 4],
    ['What is your cancellation policy?', 'We require 24 hours notice for cancellation. Cancellations within 24 hours may incur a small fee. We understand emergencies happen - just call us!', 'General', 5],
    ['Do you offer a satisfaction guarantee?', 'Yes! If you\'re not happy with our service, we\'ll re-clean within 24 hours at no extra cost. Your satisfaction is our priority.', 'General', 6],
    ['How long does a typical residential clean take?', 'A standard residential clean takes 2-4 hours depending on the size of your home and specific requirements.', 'General', 7],
    ['Do I need to be home during the clean?', 'Not necessarily. Many clients provide us with a key or access code. We\'re fully insured and trusted in your home.', 'General', 8]
  ];
  
  faqs.forEach(f => insertFaq.run(...f));
}

const areasExist = db.prepare('SELECT COUNT(*) as count FROM areas').get();
if (areasExist.count === 0) {
  const insertArea = db.prepare(`
    INSERT INTO areas (name, slug, state, description, display_order)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  const areas = [
    ['Sydney', 'sydney', 'NSW', 'Comprehensive cleaning services across Sydney and all surrounding suburbs.', 1],
    ['Melbourne', 'melbourne', 'VIC', 'Melbourne\'s trusted cleaning professionals for homes and businesses.', 2],
    ['Brisbane', 'brisbane', 'QLD', 'Queensland\'s premium cleaning services for residential and commercial spaces.', 3],
    ['Perth', 'perth', 'WA', 'Western Australia\'s leading cleaning company serving Perth and surrounds.', 4],
    ['Adelaide', 'adelaide', 'SA', 'Reliable and professional cleaning services across Adelaide and suburbs.', 5],
    ['Canberra', 'canberra', 'ACT', 'Premium cleaning solutions for the ACT region and surrounding areas.', 6]
  ];
  
  areas.forEach(a => insertArea.run(...a));
}

module.exports = db;