const mongoose = require('mongoose');

const postagemSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  conteudo: {
    type: String,
    required: true
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Postagem', postagemSchema);
