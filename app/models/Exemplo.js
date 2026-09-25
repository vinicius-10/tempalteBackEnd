const mongoose = require('mongoose');

const exemplo = mongoose.Schema({
  str: { type: String, required: true },
  int: { type: Number }
});

module.exports = mongoose.model("Exemplo", exemplo);