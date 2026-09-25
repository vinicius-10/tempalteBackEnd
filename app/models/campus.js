const mongoose = require('mongoose');

const campus = mongoose.Schema({
  nome: { type: String, required: true },
  universidade: { type: String, required: true },
  endereco: { type: String, required: true },
  qtdAlunos: { type: Number }
});

module.exports = mongoose.model("Campus", campus);