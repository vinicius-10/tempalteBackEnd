const UsuarioDao = require('../dao/UsuarioDao');

class UsuarioController {
  constructor(usuarioDao = new UsuarioDao()) {
    this.usuarioDao = usuarioDao;
    this.cadastrar = this.cadastrar.bind(this);
  }

  async cadastrar(req, res) {
    const { nome, email, senha } = req.body || {};

    if (
      typeof nome !== 'string' ||
      !nome.trim() ||
      typeof email !== 'string' ||
      !email.trim() ||
      typeof senha !== 'string' ||
      !senha.trim()
    ) {
      return res.status(400).json({
        mensagem: 'Informe nome, email e senha.'
      });
    }

    try {
      const usuario = await this.usuarioDao.insere({ nome, email, senha });

      return res.status(201).json({
        usuario: {
          id: usuario._id,
          nome: usuario.nome,
          email: usuario.email,
          createdAt: usuario.createdAt
        }
      });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(409).json({
          mensagem: 'Já existe um usuário cadastrado com este email.'
        });
      }

      if (err.name === 'ValidationError') {
        return res.status(400).json({
          mensagem: 'Os dados do usuário são inválidos.'
        });
      }

      console.error('Erro ao cadastrar usuário:', err);
      return res.status(500).json({
        mensagem: 'Erro ao cadastrar usuário.'
      });
    }
  }
}

module.exports = UsuarioController;
