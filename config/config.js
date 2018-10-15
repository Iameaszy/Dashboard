const path = require('path');

const rootPath = path.normalize(`${__dirname}/..`);
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    root: rootPath,
    app: {
      name: 'vote-app',
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/dashboard-development',
  },

  test: {
    root: rootPath,
    app: {
      name: 'vote-app',
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/dashboard-test',
  },

  production: {
    root: rootPath,
    app: {
      name: 'vote-app',
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/dashboard-production',
  },
};

module.exports = config[env];
