const PostagemDao = require('../dao/PostagemDao');
const ComentarioDao = require('../dao/ComentarioDao');
const UsuarioDao = require('../dao/UsuarioDao');
const mongoose = require('mongoose');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escaparRegex(texto) {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

class PostagemController {
  constructor(
    postagemDao = new PostagemDao(),
    usuarioDao = new UsuarioDao(),
    comentarioDao = new ComentarioDao()
  ) {
    this.postagemDao = postagemDao;
    this.usuarioDao = usuarioDao;
    this.comentarioDao = comentarioDao;
    this.criar = this.criar.bind(this);
    this.listar = this.listar.bind(this);
    this.detalhar = this.detalhar.bind(this);
  }

  async listar(req, res) {
    if (req.query.q !== undefined && typeof req.query.q !== 'string') {
      return res.status(400).json({
        mensagem: 'O termo de busca deve ser um texto.'
      });
    }

    const termo = req.query.q?.trim();
    const filtro = termo
      ? {
          $or: [
            { titulo: { $regex: escaparRegex(termo), $options: 'i' } },
            { conteudo: { $regex: escaparRegex(termo), $options: 'i' } }
          ]
        }
      : {};

    try {
      const postagens = await this.postagemDao.consultaComAutor(filtro);

      return res.status(200).json({
        postagens: postagens.map((postagem) => ({
          id: postagem._id,
          titulo: postagem.titulo,
          conteudo: postagem.conteudo,
          usuario: postagem.usuario
            ? {
                nome: postagem.usuario.nome,
                email: postagem.usuario.email
              }
            : null,
          createdAt: postagem.createdAt
        }))
      });
    } catch (err) {
      console.error('Erro ao consultar postagens:', err);
      return res.status(500).json({
        mensagem: 'Erro ao consultar postagens.'
      });
    }
  }

  async detalhar(req, res) {
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
        postagem: {
          id: postagem._id,
          titulo: postagem.titulo,
          conteudo: postagem.conteudo,
          usuario: postagem.usuario
            ? {
                nome: postagem.usuario.nome,
                email: postagem.usuario.email
              }
            : null,
          createdAt: postagem.createdAt,
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
        }
      });
    } catch (err) {
      console.error('Erro ao consultar postagem:', err);
      return res.status(500).json({
        mensagem: 'Erro ao consultar postagem.'
      });
    }
  }

  async criar(req, res) {
    const { titulo, conteudo, email } = req.body || {};

    if (
      typeof titulo !== 'string' ||
      !titulo.trim() ||
      typeof conteudo !== 'string' ||
      !conteudo.trim() ||
      typeof email !== 'string' ||
      !email.trim()
    ) {
      return res.status(400).json({
        mensagem: 'Informe título, conteúdo e o email do usuário.'
      });
    }

    const emailNormalizado = email.trim().toLowerCase();

    if (!EMAIL_PATTERN.test(emailNormalizado)) {
      return res.status(400).json({
        mensagem: 'Informe um email válido.'
      });
    }

    try {
      const usuarios = await this.usuarioDao.consulta({ email: emailNormalizado });

      if (usuarios.length === 0) {
        return res.status(404).json({
          mensagem: 'O usuário informado não foi encontrado.'
        });
      }

      const postagem = await this.postagemDao.insere({
        titulo: titulo.trim(),
        conteudo: conteudo.trim(),
        usuario: usuarios[0]._id
      });

      return res.status(201).json({
        postagem: {
          id: postagem._id,
          titulo: postagem.titulo,
          conteudo: postagem.conteudo,
          usuario: emailNormalizado,
          createdAt: postagem.createdAt
        }
      });
    } catch (err) {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(400).json({
          mensagem: 'Os dados da postagem são inválidos.'
        });
      }

      console.error('Erro ao criar postagem:', err);
      return res.status(500).json({
        mensagem: 'Erro ao criar postagem.'
      });
    }
  }
}

module.exports = PostagemController;
