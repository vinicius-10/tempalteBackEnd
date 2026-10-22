const mongoose = require('mongoose');

const comentarioSchema = new mongoose.Schema({
  conteudo: {
    type: String,
    required: true
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  postagem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Postagem',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Comentario', comentarioSchema);
