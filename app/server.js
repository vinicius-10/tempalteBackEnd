const express = require('express');
const path = require('node:path');
const UsuarioController = require('./controllers/UsuarioController');

const app = express();
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

app.post(
  ['/cadastroUsuario', '/cadastro_usuario', '/usuarios'],
  usuarioController.cadastrar
);

module.exports = app;
