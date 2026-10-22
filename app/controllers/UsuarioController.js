const UsuarioDao = require('../dao/UsuarioDao');
const logger = require('../utils/logger');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class UsuarioController {
  constructor(usuarioDao = new UsuarioDao()) {
    this.usuarioDao = usuarioDao;
    this.cadastrar = this.cadastrar.bind(this);
  }

  async cadastrar(req, res) {
    const { nome, email, senha, confirmarSenha } = req.body || {};

    if (
      typeof nome !== 'string' ||
      !nome.trim() ||
      typeof email !== 'string' ||
      !email.trim() ||
      typeof senha !== 'string' ||
      !senha.trim() ||
      typeof confirmarSenha !== 'string' ||
      !confirmarSenha.trim()
    ) {
      return res.status(400).json({
        mensagem: 'Informe nome, email, senha e confirmação da senha.'
      });
    }

    if (!EMAIL_PATTERN.test(email.trim())) {
      return res.status(400).json({
        mensagem: 'Informe um email válido.'
      });
    }

    if (senha.length < 6) {
      return res.status(400).json({
        mensagem: 'A senha deve ter pelo menos 6 caracteres.'
      });
    }

    if (senha !== confirmarSenha) {
      return res.status(400).json({
        mensagem: 'A senha e a confirmação não coincidem.'
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
      logger.registrarErro(err, 'Cadastrar usuário');

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

      return res.status(500).json({
        mensagem: 'Erro ao cadastrar usuário.'
      });
    }
  }
}

module.exports = UsuarioController;
