const Comentario = require('../models/Comentario');

class ComentarioDao {
  constructor(parameter) {
  }
  async insere(dados) {
    return Comentario.create(dados);
  }

  async consulta(filtro = {}) {
    return Comentario.find(filtro);
  }

  async atualiza(filtro, dados) {
    return Comentario.findOneAndUpdate(filtro, dados, {
      new: true,
      runValidators: true
    });
  }

  async deleta(filtro) {
    return Comentario.findOneAndDelete(filtro);
  }
}

module.exports = ComentarioDao;
