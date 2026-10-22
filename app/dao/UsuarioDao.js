const Usuario = require('../models/Usuario');

class UsuarioDao {
  constructor(parameter) {
  }
  async insere(dados) {
    return Usuario.create(dados);
  }

  async consulta(filtro = {}) {
    return Usuario.find(filtro);
  }

  async atualiza(filtro, dados) {
    return Usuario.findOneAndUpdate(filtro, dados, {
      new: true,
      runValidators: true
    });
  }

  async deleta(filtro) {
    return Usuario.findOneAndDelete(filtro);
  }
}

module.exports = UsuarioDao;
