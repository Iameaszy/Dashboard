const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const MapModel = mongoose.model('Maps');
const multer = require('multer');
const fs = require('fs');
const winston = require('../../config/winston');

const storage = multer.memoryStorage();

const upload = multer({
  storage,
});
const router = express.Router();
module.exports = (app) => {
  app.use('/map', router);
};

router.post('/', upload.single('file'), async (req, res, next) => {
  const {
    file,
  } = req;
  let status;

  try {
    status = await MapModel.findOne({
      name: file.originalname,
    });
  } catch (err) {
    return next(err);
  }
  const rootPath = path.resolve(`${__dirname}../../../uploads/jsons`);
  const jsonPath = `${rootPath}/${file.originalname}.json`;
  if (!status) {
    fs.writeFile(jsonPath, file.buffer, 'binary', async (err) => {
      if (err) {
        return next(err);
      }
      const {
        originalname,
        size,
        mimetype,
      } = file;
      try {
        await MapModel.create({
          originalname,
          size,
          mimetype,
        });
      } catch (err) {
        return next(err);
      }
      const jsonFile = JSON.stringify(file.buffer.toString('utf8'));
      res.json(jsonFile);
    });
  } else {
    fs.writeFile(jsonPath, file.buffer, 'binary', async (err) => {
      if (err) {
        return next(err);
      }
      const {
        originalname,
        size,
        mimetype,
      } = file;
      try {
        await MapModel.updateOne({
          originalname,
        }, {
          originalname,
          size,
          mimetype,
        });
      } catch (err) {
        return next(err);
      }
      const jsonFile = file.buffer.toString('utf8');
      res.status(200).send(jsonFile);
    });
  }
});
