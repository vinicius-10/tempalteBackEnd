const Postagem = require('../models/Postagem');

class PostagemDao {
  constructor(parameter) {
  }
  async insere(dados) {
    return Postagem.create(dados);
  }

  async consulta(filtro = {}) {
    return Postagem.find(filtro);
  }

  async consultaComAutor(filtro = {}) {
    return Postagem.find(filtro)
      .populate('usuario', 'nome email')
      .sort({ createdAt: -1 });
  }

  async consultaPorId(id) {
    return Postagem.findById(id).populate('usuario', 'nome email');
  }

  async atualiza(filtro, dados) {
    return Postagem.findOneAndUpdate(filtro, dados, {
      new: true,
      runValidators: true
    });
  }

  async deleta(filtro) {
    return Postagem.findOneAndDelete(filtro);
  }
}

module.exports = PostagemDao;
