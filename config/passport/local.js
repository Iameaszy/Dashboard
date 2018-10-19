const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const validator = require('validator');

const UserModel = mongoose.model('Users');
const {
  ExtractJwt,
  Strategy: JwtStrategy,
} = require('passport-jwt');

const {
  SECRET,
} = process.env;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET,
};
passport.use(
  new JwtStrategy(opts, async (payload, done) => {
    let user;
    const email = payload.email || '';
    try {
      user = await UserModel.findOne({
        email,
      });
    } catch (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, {
        message: 'Unauthorized Acesss',
      });
    }
    return done(null, user);
  }),
);

passport.use(
  'login',
  new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email, password, done) => {
    const mail = email.trim().toLowerCase();
    if (!validator.isEmail(mail)) {
      return done(null, false, {
        message: 'Invalid email',
      });
    }
    if (password && passport.length < 8) {
      return done(null, false, {
        message: 'Password length must be eight(8) or greater',
      });
    }
    let user;
    try {
      user = await UserModel.findOne({
        email: mail,
      });
    } catch (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, {
        message: 'Incorrect email/password',
      });
    }
    let stat;
    try {
      stat = await user.comparePassword(password);
    } catch (err) {
      return done(err);
    }

    if (!stat) {
      return done(null, false, {
        message: 'Incorrect email/password',
      });
    }
    return done(null, user, {
      message: 'Successful login',
    });
  }),
);

passport.use(
  'signin',
  new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  async (req, email, password, done) => {
    const mail = email.trim().toLowerCase();
    if (!validator.isEmail(mail)) {
      return done(null, false, {
        message: 'Invalid email',
      });
    }
    if (password && passport.length < 8) {
      return done(null, false, {
        message: 'Password length must be eight(8) or greater',
      });
    }
    let user;
    try {
      user = await UserModel.findOne({
        email: mail,
      });
    } catch (err) {
      return done(err);
    }

    if (user) {
      return done(null, false, {
        message: 'User with this email already exists',
      });
    }
    const {
      name,
    } = req.body;
    if (!name) {
      return done(null, false, {
        message: "name field can't be empty",
      });
    }

    let newUser;
    try {
      newUser = await UserModel.create({
        email: mail,
        password,
        name,
      });
    } catch (e) {
      return done(e);
    }

    done(null, newUser);
  }),
);
