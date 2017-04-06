const dotenv = require('dotenv');

const ENV = process.env.NODE_ENV || 'development';

if (ENV === 'development') dotenv.load();

const config = {
  ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  DASHBOT_KEY: process.env.DASHBOT_KEY,
  LOCALTUNNEL_SUBDOMAIN: process.env.LOCALTUNNEL_SUBDOMAIN,
  MONGODB_URI: process.env.MONGODB_URI,
};

module.exports = key => (!key ? config : config[key]);
