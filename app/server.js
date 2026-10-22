const express = require('express');
const path = require('node:path');
const ComentarioController = require('./controllers/ComentarioController');
const PostagemController = require('./controllers/PostagemController');
const UsuarioController = require('./controllers/UsuarioController');

const app = express();
const comentarioController = new ComentarioController();
const postagemController = new PostagemController();
const usuarioController = new UsuarioController();

app.use(express.json());



app.get('/cadastroUsuario', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cadastroUsuario.html'));
});

app.get('/criarPostagem', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'criarPostagem.html'));
});

app.get(['/visualizarPostagens','/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'visualizarPostagens.html'));
});

app.get('/visualizarPostagem/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'visualizarPostagem.html'));
});

app.get('/postagens', postagemController.listar);

app.get('/postagens/:id', postagemController.detalhar);

app.get('/postagens/:id/comentarios', comentarioController.listarPorPostagem);

app.patch('/postagens/:id', postagemController.editar);

app.delete('/postagens/:id', postagemController.excluir);

app.post('/postagens/:id/comentarios', comentarioController.criar);

app.patch(
  '/postagens/:id/comentarios/:comentarioId',
  comentarioController.editar
);

app.delete(
  '/postagens/:id/comentarios/:comentarioId',
  comentarioController.excluir
);

app.post(
  '/cadastroUsuario',
  usuarioController.cadastrar
);

app.post('/criarPostagem', postagemController.criar);

module.exports = app;
