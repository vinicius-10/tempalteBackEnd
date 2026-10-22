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
    this.editar = this.editar.bind(this);
    this.excluir = this.excluir.bind(this);
    this.criarComentario = this.criarComentario.bind(this);
    this.editarComentario = this.editarComentario.bind(this);
    this.excluirComentario = this.excluirComentario.bind(this);
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

  async editar(req, res) {
    const { id } = req.params;
    const { titulo, conteudo } = req.body || {};

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        mensagem: 'Informe um ID de postagem válido.'
      });
    }

    if (
      typeof titulo !== 'string' ||
      !titulo.trim() ||
      typeof conteudo !== 'string' ||
      !conteudo.trim()
    ) {
      return res.status(400).json({
        mensagem: 'Informe o título e o conteúdo da postagem.'
      });
    }

    try {
      const postagem = await this.postagemDao.atualiza(
        { _id: id },
        { titulo: titulo.trim(), conteudo: conteudo.trim() }
      );

      if (!postagem) {
        return res.status(404).json({
          mensagem: 'Postagem não encontrada.'
        });
      }

      return res.status(200).json({
        postagem: {
          id: postagem._id,
          titulo: postagem.titulo,
          conteudo: postagem.conteudo,
          updatedAt: postagem.updatedAt
        }
      });
    } catch (err) {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(400).json({
          mensagem: 'Os dados da postagem são inválidos.'
        });
      }

      console.error('Erro ao editar postagem:', err);
      return res.status(500).json({
        mensagem: 'Erro ao editar postagem.'
      });
    }
  }

  async excluir(req, res) {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        mensagem: 'Informe um ID de postagem válido.'
      });
    }

    try {
      const postagem = await this.postagemDao.deleta({ _id: id });

      if (!postagem) {
        return res.status(404).json({
          mensagem: 'Postagem não encontrada.'
        });
      }

      await this.comentarioDao.deletaPorPostagem(postagem._id);

      return res.status(200).json({
        mensagem: 'Postagem excluída com sucesso.'
      });
    } catch (err) {
      console.error('Erro ao excluir postagem:', err);
      return res.status(500).json({
        mensagem: 'Erro ao excluir postagem.'
      });
    }
  }

  async criarComentario(req, res) {
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
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(400).json({
          mensagem: 'Os dados do comentário são inválidos.'
        });
      }

      console.error('Erro ao criar comentário:', err);
      return res.status(500).json({
        mensagem: 'Erro ao criar comentário.'
      });
    }
  }

  async editarComentario(req, res) {
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
        {
          _id: comentarioId,
          postagem: id
        },
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
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(400).json({
          mensagem: 'Os dados do comentário são inválidos.'
        });
      }

      console.error('Erro ao editar comentário:', err);
      return res.status(500).json({
        mensagem: 'Erro ao editar comentário.'
      });
    }
  }

  async excluirComentario(req, res) {
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
      if (err.name === 'CastError') {
        return res.status(400).json({
          mensagem: 'Os dados do comentário são inválidos.'
        });
      }

      console.error('Erro ao excluir comentário:', err);
      return res.status(500).json({
        mensagem: 'Erro ao excluir comentário.'
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
