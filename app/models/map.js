const mongoose = require('mongoose');

const {
  Schema,
} = mongoose;

const MapSchema = new Schema({
  name: {
    type: String,
    required: true,
    alias: 'originalname',
  },
  mimetype: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
}, {
  strictQuery: true,
  timestamps: true,
});

module.exports = mongoose.model('Maps', MapSchema);
