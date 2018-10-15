// Example model

const mongoose = require('mongoose');

const {
  Schema,
} = mongoose;
const {
  ObjectId,
} = Schema.Types;
const MessageSchema = new Schema({
  message: {
    type: String,
    required: true,
  },
  userid: ObjectId,
}, {
  strictQuery: true,
  timestamps: true,
});

MessageSchema.set('toObject', {
  virtuals: true,
});
MessageSchema.set('toJSON', {
  virtuals: true,
});


module.exports = mongoose.model('Messages', MessageSchema);
