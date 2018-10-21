const express = require('express');
const glob = require('glob');
const path = require('path');
// const favicon = require('serve-favicon');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const passport = require('passport');
const flash = require('express-flash');
const dotenv = require('dotenv');
const session = require('express-session');
const logger = require('./winston');

dotenv.config();
module.exports = (app, config) => {
  const env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env === 'development';

  // app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
  );
  app.use(cookieParser());
  app.use(compress());
  app.use(express.static(`${config.root}/public`));
  app.use(methodOverride());
  app.use(cors());
  app.use(
    session({
      secret: process.env.SECRET,
      saveUninitialized: false,
      resave: true,
    }),
  );
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());

  const passports = glob.sync(`${__dirname}/passport/*.js`);
  passports.forEach((passport) => {
    require(passport);
  });
  /*
    app.get('*', (req, res) => {
      res.sendFile('login.html', {
        root: path.join(__dirname, '../public/admin/'),
      });
    });
    */
  const controllers = glob.sync(`${config.root}/app/controllers/*.js`);
  controllers.forEach((controller) => {
    require(controller)(app);
  });

  app.use((req, res, next) => {
    const err = new Error('Not Found');
    res.status(404).send(err);
  });

  app.use((err, req, res, next) => {
    logger.error(err.toString());
    res.status(err.status || 500);
    res.send('server currently unavailable');
  });

  return app;
};
