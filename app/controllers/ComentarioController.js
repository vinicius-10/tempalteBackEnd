const mongoose = require('mongoose');
const ComentarioDao = require('../dao/ComentarioDao');
const PostagemDao = require('../dao/PostagemDao');
const UsuarioDao = require('../dao/UsuarioDao');
const logger = require('../utils/logger');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class ComentarioController {
  constructor(
    comentarioDao = new ComentarioDao(),
    postagemDao = new PostagemDao(),
    usuarioDao = new UsuarioDao()
  ) {
    this.comentarioDao = comentarioDao;
    this.postagemDao = postagemDao;
    this.usuarioDao = usuarioDao;
    this.listarPorPostagem = this.listarPorPostagem.bind(this);
    this.criar = this.criar.bind(this);
    this.editar = this.editar.bind(this);
    this.excluir = this.excluir.bind(this);
  }

  async listarPorPostagem(req, res) {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        mensagem: 'Informe um ID de postagem válido.'
      });
    }

    try {
      const postagem = await this.postagemDao.consultaPorId(id);

      if (!postagem) {
        return res.status(404).json({
          mensagem: 'Postagem não encontrada.'
        });
      }

      const comentarios = await this.comentarioDao.consultaComAutor({
        postagem: postagem._id
      });

      return res.status(200).json({
        comentarios: comentarios.map((comentario) => ({
          id: comentario._id,
          conteudo: comentario.conteudo,
          usuario: comentario.usuario
            ? {
                nome: comentario.usuario.nome,
                email: comentario.usuario.email
              }
            : null,
          createdAt: comentario.createdAt
        }))
      });
    } catch (err) {
      logger.registrarErro(err, 'Consultar comentários da postagem');
      return res.status(500).json({
        mensagem: 'Erro ao consultar comentários.'
      });
    }
  }

  async criar(req, res) {
    const { id } = req.params;
    const { conteudo, email } = req.body || {};

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        mensagem: 'Informe um ID de postagem válido.'
      });
    }

    if (
      typeof conteudo !== 'string' ||
      !conteudo.trim() ||
      typeof email !== 'string' ||
      !email.trim()
    ) {
      return res.status(400).json({
        mensagem: 'Informe o comentário e o email do usuário.'
      });
    }

    const emailNormalizado = email.trim().toLowerCase();

    if (!EMAIL_PATTERN.test(emailNormalizado)) {
      return res.status(400).json({
        mensagem: 'Informe um email válido.'
      });
    }

    try {
      const postagem = await this.postagemDao.consultaPorId(id);

      if (!postagem) {
        return res.status(404).json({
          mensagem: 'Postagem não encontrada.'
        });
      }

      const usuarios = await this.usuarioDao.consulta({ email: emailNormalizado });

      if (usuarios.length === 0) {
        return res.status(404).json({
          mensagem: 'O usuário informado não foi encontrado.'
        });
      }

      const comentario = await this.comentarioDao.insere({
        conteudo: conteudo.trim(),
        postagem: postagem._id,
        usuario: usuarios[0]._id
      });

      return res.status(201).json({
        comentario: {
          id: comentario._id,
          conteudo: comentario.conteudo,
          email: emailNormalizado,
          postagem: postagem._id,
          createdAt: comentario.createdAt
        }
      });
    } catch (err) {
      logger.registrarErro(err, 'Criar comentário');

      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(400).json({
          mensagem: 'Os dados do comentário são inválidos.'
        });
      }

      return res.status(500).json({
        mensagem: 'Erro ao criar comentário.'
      });
    }
  }

  async editar(req, res) {
    const { id, comentarioId } = req.params;
    const { conteudo } = req.body || {};

    if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(comentarioId)) {
      return res.status(400).json({
        mensagem: 'Informe IDs válidos para a postagem e o comentário.'
      });
    }

    if (typeof conteudo !== 'string' || !conteudo.trim()) {
      return res.status(400).json({
        mensagem: 'Informe o comentário atualizado.'
      });
    }

    try {
      const comentario = await this.comentarioDao.atualiza(
        { _id: comentarioId, postagem: id },
        { conteudo: conteudo.trim() }
      );

      if (!comentario) {
        return res.status(404).json({
          mensagem: 'Comentário não encontrado nesta postagem.'
        });
      }

      return res.status(200).json({
        comentario: {
          id: comentario._id,
          conteudo: comentario.conteudo,
          createdAt: comentario.createdAt,
          updatedAt: comentario.updatedAt
        }
      });
    } catch (err) {
      logger.registrarErro(err, 'Editar comentário');

      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(400).json({
          mensagem: 'Os dados do comentário são inválidos.'
        });
      }

      return res.status(500).json({
        mensagem: 'Erro ao editar comentário.'
      });
    }
  }

  async excluir(req, res) {
    const { id, comentarioId } = req.params;

    if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(comentarioId)) {
      return res.status(400).json({
        mensagem: 'Informe IDs válidos para a postagem e o comentário.'
      });
    }

    try {
      const comentario = await this.comentarioDao.deleta({
        _id: comentarioId,
        postagem: id
      });

      if (!comentario) {
        return res.status(404).json({
          mensagem: 'Comentário não encontrado nesta postagem.'
        });
      }

      return res.status(200).json({
        mensagem: 'Comentário excluído com sucesso.'
      });
    } catch (err) {
      logger.registrarErro(err, 'Excluir comentário');

      if (err.name === 'CastError') {
        return res.status(400).json({
          mensagem: 'Os dados do comentário são inválidos.'
        });
      }

      return res.status(500).json({
        mensagem: 'Erro ao excluir comentário.'
      });
    }
  }
}

module.exports = ComentarioController;
