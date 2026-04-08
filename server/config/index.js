require('dotenv').config();
const path = require('path');

const isVercel = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

module.exports = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  DB_PATH: isVercel 
    ? process.env.DB_PATH || '/tmp/sparkleclean.db'
    : process.env.DB_PATH || path.join(__dirname, '..', 'data', 'sparkleclean.db'),
  
  JWT_SECRET: process.env.JWT_SECRET || 'sparkleclean-australia-super-secret-key-2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@sparkleclean.com.au',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'sparkle2026',
  
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: process.env.SMTP_PORT || 587,
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  
  SITE_NAME: 'SparkleClean Australia',
  SITE_URL: process.env.SITE_URL || 'https://aussie-clean-services.vercel.app',
  
  IS_VERCEL: isVercel
};