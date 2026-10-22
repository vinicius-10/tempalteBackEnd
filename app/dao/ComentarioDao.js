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

  async consultaComAutor(filtro = {}) {
    return Comentario.find(filtro)
      .populate('usuario', 'nome email')
      .sort({ createdAt: 1 });
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

  async deletaPorPostagem(postagemId) {
    return Comentario.deleteMany({ postagem: postagemId });
  }
}

module.exports = ComentarioDao;
