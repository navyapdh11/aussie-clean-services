require('dotenv').config();
const path = require('path');

const isVercel = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

module.exports = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  DB_PATH: isVercel 
    ? process.env.DB_PATH || '/tmp/vercelclean.db'
    : process.env.DB_PATH || path.join(__dirname, '..', 'data', 'vercelclean.db'),
  
  JWT_SECRET: process.env.JWT_SECRET || 'vercelclean-services-enterprise-key-2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@vercelcleaningservices.com.au',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'vercel2026',
  
  SITE_NAME: 'Vercel Cleaning Services',
  SITE_URL: process.env.SITE_URL || 'https://aussie-clean-services.vercel.app',
  
  IS_VERCEL: isVercel
};