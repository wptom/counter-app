const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: 'main'
  },
  value: {
    type: Number,
    default: 0,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

// Vždy používáme jeden counter s ID 'main'
counterSchema.statics.getCounter = async function() {
  let counter = await this.findOne({ _id: 'main' });
  if (!counter) {
    counter = await this.create({ _id: 'main', value: 0 });
  }
  return counter;
};

module.exports = mongoose.model('Counter', counterSchema);
