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
