const path = require('path');

module.exports = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database
  DB_PATH: process.env.DB_PATH || path.join(__dirname, 'data', 'sparkleclean.db'),
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'sparkleclean-australia-super-secret-key-2026',
  JWT_EXPIRES_IN: '7d',
  
  // Admin credentials (change in production!)
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@sparkleclean.com.au',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'sparkle2026',
  
  // Email (configure for production)
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: process.env.SMTP_PORT || 587,
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  
  // Site info
  SITE_NAME: 'SparkleClean Australia',
  SITE_URL: process.env.SITE_URL || 'http://localhost:3000',
};