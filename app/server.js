const express = require('express');
const path = require('node:path');
const PostagemController = require('./controllers/PostagemController');
const UsuarioController = require('./controllers/UsuarioController');

const app = express();
const postagemController = new PostagemController();
const usuarioController = new UsuarioController();

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    mensagem: 'API de usuários funcionando.'
  });
});

app.get('/cadastroUsuario', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cadastroUsuario.html'));
});

app.get('/criarPostagem', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'criarPostagem.html'));
});

app.get('/visualizarPostagens', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'visualizarPostagens.html'));
});

app.get('/visualizarPostagem/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'visualizarPostagem.html'));
});

app.get('/postagens', postagemController.listar);

app.get('/postagens/:id', postagemController.detalhar);

app.post(
  '/cadastroUsuario',
  usuarioController.cadastrar
);

app.post('/criarPostagem', postagemController.criar);

module.exports = app;
