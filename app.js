const express = require('express');

const glob = require('glob');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const config = require('./config/config');
const logger = require('./config/winston');

mongoose.connect(
  config.db,
  {
    useMongoClient: true,
  },
);
const db = mongoose.connection;
db.on('error', () => {
  throw new Error(`unable to connect to database at ${config.db}`);
});
db.on('open', () => {
  logger.info('database connected');
});

const models = glob.sync(`${config.root}/app/models/*.js`);
models.forEach((model) => {
  require(model);
});
const app = express();
require('./config/express')(app, config);

module.exports = app.listen(config.port, () => {
  logger.info(`Express server listening on port ${config.port}`);
});
