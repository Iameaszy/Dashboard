const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');

const UserModel = mongoose.model('Users');
const multer = require('multer');


const upload = multer({
  dest: '../../uploads/',
});

const router = express.Router();
module.exports = (app) => {
  app.use('/user', router);
};

router.get('/', passport.authenticate('jwt', {
  session: false,
}), async (req, res) => {
  const {
    user,
  } = req;
  res.json(user);
});

router.get('/users', async (req, res, next) => {
  let users;
  try {
    users = await UserModel.find({}, {});
  } catch (e) {
    return next(e);
  }

  res.json({
    users,
  });
});
router.post('/login', (req, res, next) => {
  passport.authenticate(
    'login', {
      session: false,
    },
    (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(400).send(info);
      }

      const token = user.generateJwt();
      if (!req.body.remember) {
        return res.status(200).json({
          token,
        });
      }
      return res.json({
        token,
      });
    },
  )(req, res, next);
});


router.post('/signup', upload.array('photos', 30), (req, res, next) => {
  passport.authenticate(
    'signin', {
      session: false,
    },
    (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(400).send(info);
      }

      const token = user.generateJwt();
      const data = {
        token,
      };
      if (!req.body.remember) {
        return res.status(200).json(data);
      }
      return res.json(data);
    },
  )(req, res, next);
});
